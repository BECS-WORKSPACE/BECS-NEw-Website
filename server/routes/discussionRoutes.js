const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', discussionController.createDiscussion);
router.get('/', discussionController.getDiscussions);
router.post('/:id/reply', discussionController.addReply);
router.put('/:id/resolve', discussionController.resolveDiscussion);

module.exports = router;
