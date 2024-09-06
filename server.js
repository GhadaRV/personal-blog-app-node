const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());

app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
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
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/test', (req, res) => {
    res.send('Test route is working');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




