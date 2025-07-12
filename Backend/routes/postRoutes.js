const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createPost,
  // getSections,
  getPostsBySection,
  editPost,
  deletePost,
  upvotePost,
  downvotePost,
  savePost
} = require('../controllers/postController');

router.post('/', auth, createPost);


// router.get('/sections/', getSections);
router.get('/section/:section', getPostsBySection);


router.put('/:id', auth, editPost);
router.delete('/:id', auth, deletePost);

router.post('/:id/upvote', auth, upvotePost);
router.post('/:id/downvote', auth, downvotePost);
router.post('/:id/save', auth, savePost);

module.exports = router;
