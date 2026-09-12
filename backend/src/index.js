const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const { globalLimiter } = require('./middleware/rateLimiter');

dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
const { clerkMiddleware } = require("@clerk/express");
app.use(clerkMiddleware());

// CORS — comma-separated CLIENT_ORIGIN env (defaults cover Vite's 5173/5174)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow same-origin/non-browser requests (no Origin header).
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        credentials: true,
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Routes
const transcriptRoutes = require('./routes/transcriptRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const askRoutes = require('./routes/askRoutes');
const notesRoutes = require('./routes/notesRoutes');
const quizRoutes = require('./routes/quizRoutes');
const historyRoutes = require('./routes/historyRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

// Global rate limiter
app.use(globalLimiter);


app.use('/api/transcript', transcriptRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/ask', askRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/history', historyRoutes);

app.use(errorHandler);

// Connect DB
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});


