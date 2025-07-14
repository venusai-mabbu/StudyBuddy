const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  register,
  login,
  logout,
  getProfile,
  updateUsername,
  updatePassword,
  togglePublic,
  unsavePost,
  getSections
} = require('../controllers/authController');



router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);


router.get('/profile', auth, getProfile);
router.get('/sections', auth, getSections);



router.put('/update-username', auth, updateUsername);
router.put('/update-password', auth, updatePassword);
router.patch('/toggle-public', auth, togglePublic);
router.delete('/unsave/:id', auth, unsavePost);


module.exports = router;
