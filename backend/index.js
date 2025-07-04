require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const supabase = require('./config/supabaseConfig');
const http = require("http");
const {Server} = require("socket.io");
const { initializeSocket } = require('./Sockets');
const {initializzeSocket} = require('./Sockets/friend');
const multer = require('multer'); // Add multer

connectDB();

// const server = http.createServer(app);

app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(cookieParser());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for simplicity

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', upload.fields([
  { name: 'recording', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]), require('./routes/sosRoutes')); // Use multer middleware for SOS routes
app.use('/api/history', require('./routes/historyRoutes'));

const expressServer = app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`));

const io = new Server(expressServer, {
    cors: {
      origin: "*",
    },
});
  
initializeSocket(io);
initializzeSocket(io);