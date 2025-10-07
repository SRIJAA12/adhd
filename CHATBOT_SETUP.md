# AI Chatbot Setup Instructions

## 1. Install Required Dependencies

Run this command in the `neuroflow-dashboard` directory:

```bash
npm install dotenv
```

## 2. Create .env File

Create a `.env` file in the root directory (`d:\adhd\neuroflow-dashboard\.env`) with:

```
OPENAI_API_KEY=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
PORT=5000
```

**Note**: The `.env` file is already in `.gitignore` so your API key won't be committed to git.

## 3. Start the Backend Server

```bash
node server.js
```

The server will start on port 5000 and confirm OpenAI API is configured.

## 4. Start the Frontend

In a new terminal:

```bash
npm run dev
```

## 5. Using the AI Chatbot

### Access Points:
1. **From Dashboard**: Click the floating AI chatbot button (bottom right)
2. **From Any Page**: The AI button is available on all authenticated pages

### Features:
- **Quick Action Buttons**: Click emoji buttons for common ADHD challenges
  - 😰 Overwhelmed
  - 🚫 Can't Start
  - 🌬 Breathing
  - ⏰ Time Blindness
  - 💔 RSD (Rejection Sensitive Dysphoria)

- **Contextual Suggestions**: After each bot response, click suggested follow-up questions

- **Personalized Responses**: The chatbot knows your:
  - Username
  - ADHD subtype
  - Age group
  - Pronouns

### ADHD-Specific Support:
- Emotional regulation & STOP method
- Task initiation strategies
- Time blindness management
- RSD (Rejection Sensitive Dysphoria) support
- Hyperfocus management
- Task breakdown into tiny steps
- Body doubling techniques
- Pomodoro technique guidance

## API Endpoint

**POST** `http://localhost:5000/api/chatbot/message`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "message": "I feel overwhelmed",
  "conversationHistory": [
    { "isUser": true, "content": "previous message" },
    { "isUser": false, "content": "bot response" }
  ]
}
```

**Response:**
```json
{
  "response": "I hear you... [empathetic response]",
  "suggestions": ["Tell me more", "I need another strategy"]
}
```

## Troubleshooting

### If chatbot doesn't respond:
1. Check backend server is running on port 5000
2. Verify OpenAI API key is correct in `.env`
3. Check browser console for errors
4. Ensure you're logged in (JWT token is valid)

### Fallback Mode:
If OpenAI API fails, the chatbot provides supportive fallback responses with ADHD strategies.

## Security Notes

- API key is stored server-side only
- All requests require JWT authentication
- Conversation history limited to last 10 messages
- User data is never sent to OpenAI (only username, ADHD type, age group)
