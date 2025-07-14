const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  is_public: { type: Boolean, default: false },
  sections: [String],
  saves: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  posts: {
    type: Map,
    of: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
  }
});

module.exports = mongoose.model('User', userSchema);
