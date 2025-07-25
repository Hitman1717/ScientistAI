const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled Chat" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
