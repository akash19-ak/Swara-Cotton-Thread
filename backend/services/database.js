const mongoose = require('mongoose');

let isMongo = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB Connected successfully!');
      isMongo = true;
    } catch (err) {
      console.error('MongoDB connection failed. Falling back to local JSON database.', err.message);
      isMongo = false;
    }
  } else {
    console.log('No MONGODB_URI configured. Using local JSON database (backend/data/db.json).');
    isMongo = false;
  }
}

function isMongoDB() {
  return isMongo;
}

module.exports = {
  connectDB,
  isMongoDB
};
