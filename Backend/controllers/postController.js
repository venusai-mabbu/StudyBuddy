const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const author = req.user.id;
    console.log(author);
    const postsData = Array.isArray(req.body) ? req.body : [req.body];

    const createdPosts = [];

    for (const item of postsData) {
      const { question, answer, section } = item;

      if (!question || !answer || !section) {
        return res.status(400).json({ error: "Each post must include question, answer, and section." });
      }

      const upperSection = section;

      const post = await Post.create({
        question,
        answer,
        section: upperSection,
        author
      });

      await User.findByIdAndUpdate(author, {
        $push: { [`posts.${upperSection}`]: post._id },
        $addToSet: { sections: upperSection }
      });

      createdPosts.push(post);
    }

    // Return one object or array depending on input
    res.status(201).json(Array.isArray(req.body) ? createdPosts : createdPosts[0]);

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
    console.log("user",req.user.id);
    const user = await User.findById(req.user.id);
    const postId = req.params.id;
    console.log("venusai"+user);

    if (!user.saves.includes(postId)) {
      user.saves.push(postId);
      await user.save();
    }

    res.json({ message: "Post saved", saves: user.saves });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
