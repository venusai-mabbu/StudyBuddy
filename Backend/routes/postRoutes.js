const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createPost,
  // getSections,
  // getPostsBySection,
  editPost,
  deletePost,
  upvotePost,
  downvotePost,
  savePost,
  getAllPosts,
  getUserPosts,
  getUserSectionPosts
} = require('../controllers/postController');

router.post('/', auth, createPost);


// router.get('/sections/', getSections);
// router.get('/:author/:section', getPostsBySection);

router.get('/getAllPosts', getAllPosts);
router.get('/getUserPosts',auth, getUserPosts);
router.get('/section/:section', auth, getUserSectionPosts);


router.put('/:id', auth, editPost);
router.delete('/:id', auth, deletePost);

router.post('/upvote/:id', auth, upvotePost);
router.post('/downvote/:id', auth, downvotePost);
router.post('/save/:id', auth, savePost);

module.exports = router;
