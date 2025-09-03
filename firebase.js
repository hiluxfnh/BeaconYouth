// Firebase initialization and helpers (shared by all pages)
// Using Firebase v12 modular SDK from gstatic CDN

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit as qLimit,
  updateDoc,
  doc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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

// Submit a contact message to Firestore
// data shape: { name, email, subject?, message, consent, source, userAgent, status, createdAt }
export async function submitContact(data) {
  const docRef = await addDoc(collection(db, "contacts"), {
    ...data,
    status: "received",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Auth helpers for admin page
export function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}
export function signOutCurrent() {
  return signOut(auth);
}
export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

// Admin data helpers
export async function fetchInquiries(max = 100) {
  const q = query(
    collection(db, "inquiries"),
    orderBy("createdAt", "desc"),
    qLimit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function fetchContacts(max = 100) {
  const q = query(
    collection(db, "contacts"),
    orderBy("createdAt", "desc"),
    qLimit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function updateSubmissionStatus(kind, id, status) {
  const ref = doc(db, kind, id);
  await updateDoc(ref, { status });
}
