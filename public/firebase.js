// Firebase initialization and shared helpers for the public site.
// Uses the browser SDK directly from the Firebase CDN.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getCountFromServer,
  getDocs,
  query,
  orderBy,
  limit as qLimit,
  updateDoc,
  doc,
  serverTimestamp,
  connectFirestoreEmulator,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBPdyPCIlRQjw2MjSPinQYhV8shfypSHCM",
  authDomain: "byc-website-3ee13.firebaseapp.com",
  projectId: "byc-website-3ee13",
  storageBucket: "byc-website-3ee13.firebasestorage.app",
  messagingSenderId: "1706290118",
  appId: "1:1706290118:web:9539232b5cb5df531360c7",
  measurementId: "G-2YZ4B6YB6Z",
};

export const PUBLIC_ADMIN_EMAILS = ["beaconyouthcollective@gmail.com"];

function shouldUseFirestoreEmulator() {
  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  if (!isLocalHost) return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("useEmulators") === "1";
}

export function isAllowedAdminEmail(email) {
  return PUBLIC_ADMIN_EMAILS.includes((email || "").trim().toLowerCase());
}

const app = initializeApp(firebaseConfig);

try {
  if (!shouldUseFirestoreEmulator()) {
    getAnalytics(app);
  }
} catch (_) {}

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

if (shouldUseFirestoreEmulator()) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export async function submitInquiry(data) {
  const docRef = await addDoc(collection(db, "inquiries"), {
    ...data,
    status: "received",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function submitContact(data) {
  const docRef = await addDoc(collection(db, "contacts"), {
    ...data,
    status: "received",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function signInWithGoogle() {
  try {
    return await signInWithPopup(auth, provider);
  } catch (e) {
    if (
      e?.code === "auth/popup-blocked" ||
      e?.code === "auth/popup-closed-by-user" ||
      e?.code === "auth/operation-not-supported-in-this-environment"
    ) {
      return signInWithRedirect(auth, provider);
    }
    throw e;
  }
}

export function signOutCurrent() {
  return signOut(auth);
}

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

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

export async function submitSubscriber(data) {
  const docRef = await addDoc(collection(db, "subscribers"), {
    email: (data?.email || "").trim(),
    source: data?.source || window.location.pathname,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchSubscribers(max = 500) {
  const q = query(
    collection(db, "subscribers"),
    orderBy("createdAt", "desc"),
    qLimit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getSubscribersCount() {
  const coll = collection(db, "subscribers");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count || 0;
}
