const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

const initializeFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'YOUR_STORAGE_BUCKET_URL'
  });
};

module.exports = { admin, initializeFirebase };