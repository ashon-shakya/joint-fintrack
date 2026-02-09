const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));


app.get('/', (req, res) => {
    res.send('FinTrack API is running');
});

// Start Server
const startServer = async () => {
    try {
        // Database connection
        connectDB().then(() => {
            console.log(`MongoDB Connected!`);
            app.listen(PORT, (error) => {
                if (error) {
                    console.error('Error starting server:', error);
                    process.exit(1);
                }
                console.log(`Server running on port ${PORT}`);
            });

        }).catch((error) => {
            console.error('Error connecting to database:', error);
            process.exit(1);
        })
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
