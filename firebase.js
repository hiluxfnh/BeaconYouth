// Firebase initialization and helpers (shared by all pages)
// Using Firebase v12 modular SDK from gstatic CDN

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Your Firebase config (provided)
export const firebaseConfig = {
  apiKey: "AIzaSyBPdyPCIlRQjw2MjSPinQYhV8shfypSHCM",
  authDomain: "byc-website-3ee13.firebaseapp.com",
  projectId: "byc-website-3ee13",
  storageBucket: "byc-website-3ee13.firebasestorage.app",
  messagingSenderId: "1706290118",
  appId: "1:1706290118:web:9539232b5cb5df531360c7",
  measurementId: "G-2YZ4B6YB6Z",
};

// Initialize
const app = initializeApp(firebaseConfig);
// Analytics can throw on some environments (e.g., http localhost without gtag); make it safe.
try {
  getAnalytics(app);
} catch (_) {}

// Firestore
const db = getFirestore(app);

// Submit an inquiry/request to Firestore
// data shape: { type, name, email, phone?, org?, message, consent, source, userAgent, status, createdAt }
export async function submitInquiry(data) {
  const docRef = await addDoc(collection(db, "inquiries"), {
    ...data,
    status: "received",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
