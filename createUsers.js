// createUsers.js
const mongoose = require('./config/database');
const Admin = require('./models/Admin');

async function createAdmin() {
  const admin = new Admin({
    username: 'admin1',
    password: 'admin123', // Plaintext password will be hashed
    role: 'admin',
  });

  try {
    await admin.save();
    console.log('Admin created successfully.');
  } catch (err) {
    console.error('Error creating admin:', err);
  }
}

createAdmin();
