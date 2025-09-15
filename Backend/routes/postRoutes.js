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
  unsavePost,
  getAllPosts,
  getPostById,
  getUserPosts,
  getUserSectionPosts

} = require('../controllers/postController');

router.post('/', auth, createPost);


// router.get('/sections/', getSections);
// router.get('/:author/:section', getPostsBySection);

router.get('/getAllPosts', getAllPosts);
router.get('/saved/:id', auth, getPostById);
router.get('/authorPosts',auth, getUserPosts);


router.get('/section/:section', auth, getUserSectionPosts);


router.put('/:id', auth, editPost);
router.delete('/:id', auth, deletePost);

router.post('/upvote/:id', auth, upvotePost);
router.post('/downvote/:id', auth, downvotePost);
router.post('/save/:id', auth, savePost);
router.post('/unsave/:id', auth, unsavePost);


module.exports = router;
