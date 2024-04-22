// server.cjs
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express(); // Initialize Express app

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Route to create admin user
app.post('/admin/create', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Set custom claim to make the user an admin
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    console.log('Admin user created:', userRecord.uid); // Log admin user creation

    res.status(200).json({ message: 'Admin user created successfully.' });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Rest of your server setup

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
