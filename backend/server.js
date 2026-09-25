const express = require('express');
require('dotenv').config({ 'path': '.env' });
const helmet = require('helmet');
const cors = require('cors');
const sequelize = require('./config/database');

// Initialize associations
require('./models/index');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',       
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true                        
}));
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 3001;


app.use((req, res, next) => {
    console.log('[SERVER]', req.method, req.path, 'body:', req.body);
    next();
});

app.get('/', (req, res) => {
    res.send('API app web');
});


async function startServer() {
    try {
        if (process.env.NODE_ENV !== 'test') {
            await sequelize.sync({ alter: true });
            console.log("BD synchronisée avec succès!");
        }
    
        const lessonRoutes = require('./routes/lessonRoute');
        const authRoutes = require('./routes/authRoute');
        const quizRoutes = require('./routes/quizRoute');
        const resultRoutes = require('./routes/resultRoute');
        const questionRoutes = require('./routes/questionRoute');
        
        app.use('/api/lesson', lessonRoutes);
        app.use('/api/auth', authRoutes);
        app.use('/api/quiz', quizRoutes);
        app.use('/api/result', resultRoutes);
        app.use('/api/question', questionRoutes);

        app.listen(PORT, () => {
            console.log(`Serveur Express en écoute sur http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Erreur lors du démarrage:", err);
        process.exit(1);
    }
}

startServer();

module.exports = app;