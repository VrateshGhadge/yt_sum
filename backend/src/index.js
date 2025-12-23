const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const { globalLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Routes
const authRouter = require('./routes/authRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

// Global rate limiter
app.use(globalLimiter);


app.use('/api/auth', authRouter);
app.use('/api/transcript', transcriptRoutes);

app.use(errorHandler);

// Connect DB
connectDB();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});


