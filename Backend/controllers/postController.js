const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { question, answer, section } = req.body;
    const author = req.user.id;

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

// exports.getSections = async (req, res) => {
//   try {

//     const sections = await User.find({ sections });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.getPostsBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const posts = await Post.find({ section }).populate('author', 'username');
    res.json(posts);
  } catch (err) {
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
