// backend/server.js
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const dotenv   = require('dotenv');

const authRoutes     = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');

dotenv.config();
const app = express();

app.use(cors({ origin: '*', methods: 'GET,POST,PUT,DELETE', allowedHeaders: 'Content-Type,Authorization' }));
app.use(express.json());

// serve static videos from public/
app.use('/videos', express.static(path.join(__dirname, 'public')));

// auth & progress APIs
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
