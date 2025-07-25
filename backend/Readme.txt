==========================
 SCIENTIST-AI API ROUTES 
==========================

Base URL: http://localhost:5000/api
Auth Required: ✅ Yes (JWT token in Authorization header)

--------------------------------------
🔐 AUTH ROUTES
--------------------------------------

1. POST /auth/signup
→ Register a new user
Body:
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "123456"
}

2. POST /auth/login
→ Login and receive JWT
Body:
{
  "email": "student@example.com",
  "password": "123456"
}

Response:
{
  "token": "<JWT>",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "..."
  }
}

--------------------------------------
💬 CHAT SESSION ROUTES
--------------------------------------

3. POST /sessions/new
→ Create a new chat session
Body:
{
  "title": "Biology Homework" // Optional, default = "New Chat"
}

Headers:
Authorization: Bearer <JWT>

Response:
{
  "_id": "SESSION_ID",
  "title": "...",
  "createdAt": "...",
  ...
}

4. GET /sessions
→ Get all sessions created by the logged-in user

Headers:
Authorization: Bearer <JWT>

Response: [ { session objects... } ]


5. DELETE /sessions/:id
→ Delete one session + all its chat queries
Headers:
Authorization: Bearer <JWT>

Response:
{ "message": "Session and related chats deleted" }

--------------------------------------
📩 CHAT QUERY ROUTES
--------------------------------------

6. POST /query/ask
→ Ask a question to a selected scientist in a session

Body:
{
  "question": "What is gravity?",
  "agent": "newton", // Options: "einstein", "newton", "darwin", "tesla"
  "sessionId": "<SESSION_ID>"
}

Headers:
Authorization: Bearer <JWT>

Response:
{
  "_id": "QUERY_ID",
  "question": "...",
  "response": "...",
  "agent": "...",
  "session": "...",
  "createdAt": "..."
}

7. GET /sessions/:id/queries
→ Get all Q&A pairs from a session

Headers:
Authorization: Bearer <JWT>

Response: [ { question, response, agent, ... } ]

8. GET /query/my-queries
→ Get all queries (not grouped by session)

Headers:
Authorization: Bearer <JWT>

Response: [ { query objects... } ]


--------------------------------------
⚠️ AGENTS SUPPORTED
--------------------------------------

"newton"   => Isaac Newton
"einstein" => Albert Einstein
"darwin"   => Charles Darwin
"tesla"    => Nikola Tesla

Each one has a specific science domain.

--------------------------------------
✅ HEADERS NEEDED (always)
--------------------------------------

Authorization: Bearer <JWT>

Content-Type: application/json


--------------------------------------
🔁 FLOW SUGGESTION FOR FRONTEND
--------------------------------------

- On login → Save JWT in localStorage
- Show option to start new chat (POST /sessions/new)
- Show previous sessions (GET /sessions)
- Inside chat → Send question via POST /query/ask
- Display all Q&A via GET /sessions/:id/queries
- Allow user to delete session (DELETE /sessions/:id)


Let backend dev know if you need mock responses or help!

– SCIENTIST AI BACKEND 🧠
