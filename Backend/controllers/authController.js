const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, email, bio, avatar } = req.body;

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Default avatar if none provided
    const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username;

    const user = new User({
      username,
      password: hashed,
      email,
      bio: bio || "", // empty if not provided
      avatar: avatar || defaultAvatar // fallback to generated avatar
    });

    await user.save();

    res.status(201).json({ 
      message: "Registered successfully", 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
      }
    });

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

    // Fetch user with selected profile fields
    const user = await User.findById(req.user.id).select(
      "username email avatar bio location website social is_public sections saves upvotes downvotes stars joinedAt last_login"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure arrays
    const sections = Array.isArray(user.sections) ? user.sections : [];
    const saves = Array.isArray(user.saves) ? user.saves : [];
    const upvotes = Array.isArray(user.upvotes) ? user.upvotes : [];
    const downvotes = Array.isArray(user.downvotes) ? user.downvotes : [];
    const stars = Array.isArray(user.stars) ? user.stars : [];

    // Profile data response
    const profileData = {
      username: user.username,
      email: user.email,
      avatar: user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username,
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      social: user.social || {},

      is_public: user.is_public || false,

      sections,
      sectionsCount: sections.length,
      saves,
      savesCount: saves.length,

      upvotesCount: upvotes.length,
      downvotesCount: downvotes.length,
      starsCount: stars.length,

      joinedAt: user.joinedAt,
      last_login: user.last_login
    };
    {console.log(sections)}
    res.json(profileData);
  } catch (err) {
    console.error("Profile fetch error:", err);
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

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ["bio", "avatar", "location", "website", "social"];

    // Filter request body to only include allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("username email bio avatar location website social is_public");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      profile: user
    });
  } catch (err) {
    console.error("Update profile error:", err);
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

// Get all public profiles
exports.getPublicProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query; // Pagination support
    
    const skip = (page - 1) * limit;

    // Fetch only public users
    const users = await User.find({ is_public: true })
      .select("username bio avatar email social") // only expose safe fields
      .skip(skip)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments({ is_public: true });

    res.json({
      profiles: users,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (err) {
    console.error("Error fetching public profiles:", err);
    res.status(500).json({ error: "Server error fetching profiles" });
  }
};


exports.getPublicProfileById = async (req, res) => {
  try {
    const  id  = req.params.id;
    console.log("Fetching public profile for ID:", req.params.id);
    // Fetch only public users
    const user = await User.findOne({ _id: id, is_public: true })
      .select(
        "username email bio location website social sections saves upvotes downvotes stars posts"
      )
      // .populate({
      //   path: "posts",
      //   select: "title content section createdAt", 
      // });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or profile is private" });
    }

    // Ensure arrays
    const sections = Array.isArray(user.sections) ? user.sections : [];
    const saves = Array.isArray(user.saves) ? user.saves : [];
    const upvotes = Array.isArray(user.upvotes) ? user.upvotes : [];
    const downvotes = Array.isArray(user.downvotes) ? user.downvotes : [];
    const stars = Array.isArray(user.stars) ? user.stars : [];
    const posts = user.posts;

    // Profile data
    const profileData = {
      username: user.username,
      email: user.email,
      avatar:
        user.avatar ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username,
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      social: user.social || {},

      is_public: user.is_public || false,

      sections,
      sectionsCount: sections.length,
      //saves,  
      savesCount: saves.length,
      upvotesCount: upvotes.length,
      downvotesCount: downvotes.length,
      starsCount: stars.length,

      posts, // populated posts
      postsCount: posts.length,

      joinedAt: user.joinedAt,
      last_login: user.last_login,
    };

    res.json(profileData);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};
