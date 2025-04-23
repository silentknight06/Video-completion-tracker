// backend/routes/progressRoutes.js
const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const Progress = require('../models/Progress');

const router = express.Router();

// GET /api/progress/:videoId
router.get('/:videoId', verifyToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    let prog = await Progress.findOne({ user: userId, videoId });
    if (!prog) {
      // no record yet
      return res.json({ watched: [], currentTime: 0 });
    }
    res.json({
      watched: prog.watched,
      currentTime: prog.currentTime
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/progress/:videoId
router.post('/:videoId', verifyToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const { watched, currentTime } = req.body;

    // upsert the progress document
    await Progress.findOneAndUpdate(
      { user: userId, videoId },
      { watched, currentTime },
      { upsert: true }
    );
    res.json({ message: 'Progress saved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
