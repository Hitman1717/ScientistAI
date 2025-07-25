const Query = require('../models/Query');
const { agents, globalPrompt } = require('../utils/agents');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- REFACTORED GEMINI LOGIC ---
const getAnswerFromGemini = async (agentKey, userQuestion, chatHistory) => {
  const agent = agents[agentKey];
  
  // Define the model and safety settings
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    // The system instruction provides context for the whole conversation
    systemInstruction: `${agent.persona}\n${globalPrompt}`,
  });

  try {
    // Start a chat session with the history from the database
    const chat = model.startChat({
      history: chatHistory,
      // Optional: Adjust safety settings if needed
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    // Send the new question to the ongoing chat
    const result = await chat.sendMessage(userQuestion);
    const response = await result.response;
    const text = response.text();

    return text || "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("Gemini SDK Error:", err.message);
    
    // Specifically check for quota errors to give a better message
    if (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED')) {
      return "The server is experiencing high demand and has exceeded its quota. Please try again later.";
    }
    
    return "Sorry, something went wrong while getting the answer.";
  }
};

// --- UPDATED ASK AGENT ENDPOINT ---
exports.askAgent = async (req, res) => {
  const { question, agent, sessionId } = req.body;
  const userId = req.user._id;

  if (!question || !agent || !sessionId) {
    return res.status(400).json({ message: "Question, agent, and sessionId are required." });
  }

  if (!agents[agent]) {
    return res.status(400).json({ message: "Invalid agent selected." });
  }

  // 1. Fetch the conversation history for this session from your database
  const historyDocs = await Query.find({ session: sessionId, user: userId }).sort({ createdAt: 'asc' });

  // 2. Format the history for the Gemini SDK
  const chatHistory = historyDocs.flatMap(doc => [
    { role: 'user', parts: [{ text: doc.question }] },
    { role: 'model', parts: [{ text: doc.response }] },
  ]);

  // 3. Get the new response, providing the existing chat history
  const response = await getAnswerFromGemini(agent, question, chatHistory);

  // 4. Save the new exchange to the database
  const savedQuery = await Query.create({
    question,
    response,
    agent,
    user: userId,
    session: sessionId,
  });

  res.status(200).json(savedQuery);
};