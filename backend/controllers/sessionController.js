const Session = require('../models/Session');
const Query = require('../models/Query');

// ✅ Create a new session
exports.createSession = async (req, res) => {
  try {
    const { title } = req.body;
    const session = await Session.create({
      title: title || "New Chat",
      user: req.user._id,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to create session." });
  }
};

// ✅ Get all sessions for a user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions." });
  }
};

// ✅ Get all queries from a specific session
exports.getSessionQueries = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const queries = await Query.find({
      session: sessionId,
      user: req.user._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(queries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch session queries." });
  }
};

// ✅ Delete session + its queries
exports.deleteSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    await Query.deleteMany({ session: sessionId, user: req.user._id });
    await Session.findOneAndDelete({ _id: sessionId, user: req.user._id });
    res.status(200).json({ message: "Session and its chats deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete session." });
  }
};
