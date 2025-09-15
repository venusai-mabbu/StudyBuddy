require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());


const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');


app.use(cors({
  origin: "http://localhost:5173", 
    // origin: "http://192.168.1.36:3001", 
  credentials: true               
}));

// Other middlewares
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch(err => console.error(err));
