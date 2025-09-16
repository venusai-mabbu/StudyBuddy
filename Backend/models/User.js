const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  
  // Auth
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // Profile
  avatar: { type: String, default: "" }, // Profile pic URL
  bio: { type: String, maxlength: 200 },
  location: { type: String },
  website: { type: String },

  // 🔹 Social Media Handles (all optional)
  social: {
    linkedin: { type: String, default: "" },
    quora: { type: String, default: "" },
    instagram: { type: String, default: "" },
    medium: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" }
  },

  // Privacy
  is_public: { type: Boolean, default: false },

  // Engagement
  sections: [String],
  saves: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  upvotes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  stars: [{ type: Schema.Types.ObjectId, ref: "Post" }],

  posts: {
    type: Map,
    of: [{ type: Schema.Types.ObjectId, ref: "Post" }]
  },


  // Activity
  last_login: { type: Date, default: Date.now },
  joinedAt: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
