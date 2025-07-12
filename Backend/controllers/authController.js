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
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email is_public sections saves');
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.username,
      email: user.email,
      is_public: user.is_public,
      sections: user.sections,
      sectionsCount: user.sections.length,
      saves:user.saves
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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
