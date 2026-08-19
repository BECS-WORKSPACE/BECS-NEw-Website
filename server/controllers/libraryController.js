const LibraryResource = require('../models/LibraryResource');
const User = require('../models/User');

// --- ADMIN / TEACHER ROUTES ---

// Create a new digital library resource
exports.createResource = async (req, res) => {
  try {
    const { title, description, type, fileUrl, fileName, fileSize, mimeType, categoryId, courseId, topicTags, difficulty, isPremium, allowDownload } = req.body;
    
    const resource = await LibraryResource.create({
      title,
      description,
      type,
      fileUrl,
      fileName,
      fileSize,
      mimeType,
      categoryId,
      courseId,
      topicTags,
      difficulty,
      isPremium,
      allowDownload,
      uploadedBy: req.user._id
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Failed to create library resource' });
  }
};

// --- STUDENT ROUTES ---

// Enterprise Search API with filtering
exports.searchLibrary = async (req, res) => {
  try {
    const { q, type, difficulty, categoryId, courseId, page = 1, limit = 20 } = req.query;
    let query = { status: 'published' };

    // Full-Text Search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Faceted Filters
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (categoryId) query.categoryId = categoryId;
    if (courseId) {
      query.courseId = courseId;
    } else if (req.query.enrolledOnly === 'true' && req.user && req.user.enrolledCourses) {
      // If user wants only enrolled courses materials
      query.courseId = { $in: req.user.enrolledCourses };
    }

    const resources = await LibraryResource.find(query)
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-previousVersions'); // Don't send huge arrays to UI for search

    const total = await LibraryResource.countDocuments(query);

    res.status(200).json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalResults: total
    });
  } catch (error) {
    console.error('Error searching library:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

// Fetch Single Resource & Verify Access
exports.getResource = async (req, res) => {
  try {
    const resource = await LibraryResource.findById(req.params.id);
    if (!resource || resource.status !== 'published') {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Premium Check
    if (resource.isPremium && !req.user.isPremium) {
      // In a real app, also check subscriptionValidUntil
      return res.status(403).json({ message: 'This resource requires an active EduVerse Premium subscription.' });
    }

    // Increment View Count asynchronously
    LibraryResource.findByIdAndUpdate(resource._id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ message: 'Failed to load resource' });
  }
};

// Request Presigned Download URL
exports.getDownloadUrl = async (req, res) => {
  try {
    const resource = await LibraryResource.findById(req.params.id);
    if (!resource || !resource.allowDownload) {
      return res.status(403).json({ message: 'Downloads are disabled for this resource.' });
    }

    if (resource.isPremium && !req.user.isPremium) {
      return res.status(403).json({ message: 'Premium required for download.' });
    }

    // In a real production app (AWS S3/Cloudinary), you would generate a 5-minute presigned URL here:
    // const s3 = new AWS.S3();
    // const url = s3.getSignedUrl('getObject', { Bucket: 'bucket', Key: resource.fileUrl, Expires: 300 });
    
    // For this simulation, we return the direct URL but increment the analytics download counter
    await LibraryResource.findByIdAndUpdate(resource._id, { $inc: { downloadCount: 1 } });

    res.status(200).json({ downloadUrl: resource.fileUrl, fileName: resource.fileName });
  } catch (error) {
    console.error('Error generating download link:', error);
    res.status(500).json({ message: 'Download failed' });
  }
};

// Toggle Bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    const isBookmarked = user.libraryBookmarks.includes(id);
    
    if (isBookmarked) {
      user.libraryBookmarks = user.libraryBookmarks.filter(bId => bId.toString() !== id);
    } else {
      user.libraryBookmarks.push(id);
    }
    
    await user.save();
    res.status(200).json({ bookmarked: !isBookmarked, bookmarks: user.libraryBookmarks });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Failed to update bookmark' });
  }
};
