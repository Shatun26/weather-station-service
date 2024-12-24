import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

export function initializeFirebase() {
  if (!admin.apps.length) {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || '{}');

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }
  return admin.firestore();
}
