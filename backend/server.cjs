// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// User schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', UserSchema);

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { email, password, role } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Create new user
      const newUser = new User({ email, password, role });
      await newUser.save();
  
      console.log('User created:', newUser); // Add this log statement
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
