const admin = require('firebase-admin');
const path = require('path');

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(path.join(__dirname, '../firebase-service-account.json'))
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  throw error;
}

module.exports = { admin };