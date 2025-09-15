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

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getUserPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postsBySection = {};

    for (const [section, postIds] of user.posts.entries()) {
      const posts = await Post.find({ _id: { $in: postIds } }).populate('author', 'username');
      postsBySection[section] = posts;
    }

    res.status(200).json(postsBySection);
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
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyUpvoted = user.upvotes.includes(postId);
    const alreadyDownvoted = user.downvotes.includes(postId);

    if (alreadyUpvoted) {
      // Remove upvote
      post.upvotes -= 1;
      user.upvotes.pull(postId);
    } else {
      // Add upvote
      post.upvotes += 1;
      user.upvotes.push(postId);

      // Remove downvote if it exists
      if (alreadyDownvoted) {
        post.downvotes -= 1;
        user.downvotes.pull(postId);
      }
    }

    await user.save();
    await post.save();

    res.json({ message: "Upvote updated", upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.downvotePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyDownvoted = user.downvotes.includes(postId);
    const alreadyUpvoted = user.upvotes.includes(postId);

    if (alreadyDownvoted) {
      // Remove downvote
      post.downvotes -= 1;
      user.downvotes.pull(postId);
    } else {
      // Add downvote
      post.downvotes += 1;
      user.downvotes.push(postId);

      // Remove upvote if it exists
      if (alreadyUpvoted) {
        post.upvotes -= 1;
        user.upvotes.pull(postId);
      }
    }

    await user.save();
    await post.save();

    res.json({ message: "Downvote updated", upvotes: post.upvotes, downvotes: post.downvotes });
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

exports.unsavePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove postId if it exists in the saves array
    const index = user.saves.indexOf(postId);
    if (index !== -1) {
      user.saves.splice(index, 1); // or use .pull(postId) if it's a Mongoose array
      await user.save();
    }

    res.json({ message: "Post unsaved", saves: user.saves });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
