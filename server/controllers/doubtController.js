const Doubt = require('../models/Doubt');

exports.getDoubts = async (req, res) => {
  try {
    const userId = req.user._id;
    // Assuming a teacher can see all doubts, and a student can only see their own.
    const query = req.user.role === 'teacher' || req.user.role === 'admin' ? {} : { student: userId };
    
    const doubts = await Doubt.find(query)
      .populate('student', 'name email')
      .populate('answeredBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, doubts });
  } catch (error) {
    console.error('Error fetching doubts:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving doubts' });
  }
};

exports.submitDoubt = async (req, res) => {
  try {
    const { subject, title, text } = req.body;
    
    const newDoubt = await Doubt.create({
      student: req.user._id,
      subject,
      title,
      text
    });

    res.status(201).json({ success: true, doubt: newDoubt });
  } catch (error) {
    console.error('Error submitting doubt:', error);
    res.status(500).json({ success: false, message: 'Server error submitting doubt' });
  }
};

// Teacher endpoints
exports.answerDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerText } = req.body;

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    doubt.status = 'answered';
    doubt.answerText = answerText;
    doubt.answeredBy = req.user._id;
    doubt.answeredAt = Date.now();

    await doubt.save();

    res.json({ success: true, doubt });
  } catch (error) {
    console.error('Error answering doubt:', error);
    res.status(500).json({ success: false, message: 'Server error answering doubt' });
  }
};
