const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  register,
  login,
  getProfile,
  updateUsername,
  updatePassword,
  togglePublic,
  unsavePost
} = require('../controllers/authController');



router.post('/register', register);
router.post('/login', login);

router.get('/profile', auth, getProfile);


router.put('/update-username', auth, updateUsername);
router.put('/update-password', auth, updatePassword);
router.patch('/toggle-public', auth, togglePublic);
router.delete('/unsave/:id', auth, unsavePost);


module.exports = router;
