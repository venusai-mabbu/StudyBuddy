const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, email });
    await user.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log(token);
    res.cookie('token', token, {
    httpOnly: true,

    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
  res.json({ message: "Logged in" ,token:token,userID:user._id,email:user.email,sections:user.sections});

    // res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// controllers/authController.js

exports.logout = (req, res) => {
  res.clearCookie('token'); // Clear the JWT cookie
  return res.status(200).json({ message: "Logged out successfully" });
};


exports.getProfile = async (req, res) => {
  try {
    // Check if user ID exists in request
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user.id).select('username email is_public sections saves');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure sections and saves are arrays
    const sections = Array.isArray(user.sections) ? user.sections : [];
    const saves = Array.isArray(user.saves) ? user.saves : [];

    const profileData = {
      username: user.username,
      email: user.email,
      is_public: user.is_public || false,
      sections: sections,
      sectionsCount: sections.length,
      saves: saves
    };

    res.json("sunitha"+profileData);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getSections = async(req,res)=> {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const sections = await User.findById(req.user.id).select('sections');
    
    if (!sections) {
      return res.status(404).json({ message: "User not found" });
    }


    res.json(sections);
  } catch (err) {
    console.error('Section fetch error:', err);
    res.status(500).json({ error: err.message });
  }
  

}

exports.updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    );
    res.json({ message: "Username updated", username: user.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.togglePublic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.is_public = !user.is_public;
    await user.save();
    res.json({ message: "Visibility toggled", is_public: user.is_public });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.unsavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { saves: postId } },
      { new: true }
    );
    res.json({ message: "Post unsaved", saves: user.saves });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
