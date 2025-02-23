const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = { admin };

//Todo : tokenda arıza devam ediyor. bir de login de user var mı kontrolümüz var mı?