const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  question: String,
  response: String,
  agent: { type: String, enum: ['newton', 'einstein', 'darwin', 'tesla'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }, // ✅ new field
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Query', querySchema);
