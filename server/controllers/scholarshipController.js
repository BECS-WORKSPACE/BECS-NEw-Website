const ScholarshipTest = require('../models/ScholarshipTest');
const User = require('../models/User');

const getFallbackTest = () => {
  return {
    _id: 'default_test',
    title: 'EduVerse Scholarship Test',
    questions: [
      { _id: 'q1', questionText: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
      { _id: 'q2', questionText: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], correctAnswer: 'Mars' },
      { _id: 'q3', questionText: 'What is the capital of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], correctAnswer: 'New Delhi' },
      { _id: 'q4', questionText: 'Who wrote the national anthem of India?', options: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Mahatma Gandhi', 'Subhas Chandra Bose'], correctAnswer: 'Rabindranath Tagore' },
      { _id: 'q5', questionText: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correctAnswer: 'Mitochondria' }
    ]
  };
};

exports.getTestQuestions = async (req, res) => {
  try {
    let test = await ScholarshipTest.findOne();
    if (!test) {
      test = getFallbackTest();
    }
    
    // Remove correct answers before sending to client
    const sanitizedQuestions = test.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.status(200).json({
      testId: test._id,
      title: test.title,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching scholarship test.' });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body; // answers: { qId: 'selected option' }
    
    let test = await ScholarshipTest.findById(testId);
    if (!test && testId === 'default_test') {
      test = getFallbackTest();
    }

    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    let correctCount = 0;
    test.questions.forEach(q => {
      if (answers[q._id.toString()] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / test.questions.length) * 100;
    
    // Map percentage to discount logic
    // 100% -> 50% discount
    // 80% -> 40% discount
    // 60% -> 30% discount
    // 40% -> 20% discount
    // Below 40 -> 10% discount
    let discount = 10;
    if (percentage === 100) discount = 50;
    else if (percentage >= 80) discount = 40;
    else if (percentage >= 60) discount = 30;
    else if (percentage >= 40) discount = 20;

    // Update user's scholarship discount
    const user = await User.findById(req.user.id);
    if (user.scholarshipDiscount && user.scholarshipDiscount > discount) {
      // Don't reduce their discount if they scored higher previously
      return res.status(200).json({
        score: percentage,
        discountEarned: discount,
        appliedDiscount: user.scholarshipDiscount,
        message: 'You scored lower than your previous attempt, so your previous discount is kept.'
      });
    }

    user.scholarshipDiscount = discount;
    await user.save();

    res.status(200).json({
      score: percentage,
      discountEarned: discount,
      appliedDiscount: discount,
      message: `Congratulations! You have earned a ${discount}% scholarship discount.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error processing test submission.' });
  }
};
