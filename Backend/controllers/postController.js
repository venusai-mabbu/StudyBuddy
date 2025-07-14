const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { question, answer, section } = req.body;
    const author = req.user.id;
    section.toUpperCase;
    const post = await Post.create({ question, answer, section, author });

    await User.findByIdAndUpdate(author, {
      $push: { [`posts.${section}`]: post._id },
      $addToSet: { sections: section }
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username'); // Optional: populate author details
    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const user = await User.findById(req.user.id)
      .populate('posts') // this populates the full Post objects
      .select('posts');
      console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.posts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getUserSectionPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const section = req.params.section;

    const posts = await Post.find({
      author: req.user.id,
      section: section
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts by section:', err);
    res.status(500).json({ error: err.message });
  }
};




// exports.getPostsBySection = async (req, res) => {
//   try {
//     const { author, section } = req.params;

//     // Find posts with matching author ID and section (case-insensitive match)
//     const posts = await Post.find({
//       // author: author, // author is ObjectId in string format
//       section: section.toUpperCase(), // normalize section casing
//     }).populate('author', 'username');

//     res.json(posts);
//   } catch (err) {
//     console.error('Error fetching posts by section:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.editPost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { [`posts.${post.section}`]: post._id }
    });

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.upvotePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post upvoted", upvotes: post.upvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downvotePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { downvotes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post downvoted", downvotes: post.downvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.id;

    if (!user.saves.includes(postId)) {
      user.saves.push(postId);
      await user.save();
    }

    res.json({ message: "Post saved", saves: user.saves });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
