require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch(err => console.error(err));
