const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
require('dotenv').config();

app.use(express.json());


app.use(cors({
    origin: 'https://www.orchipro.fr',
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));



// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/data', (req, res) => {
    const data = { message: 'Hello from the server!' };
    res.json(data);
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.get('/test', (req, res) => {
    res.send('Test route is working');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




