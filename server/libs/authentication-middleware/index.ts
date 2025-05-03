import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp(); // Uses Application Default Credentials (ADC)
}

export default admin;
