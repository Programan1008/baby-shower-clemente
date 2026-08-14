import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const STORAGE_KEY = "babyClemente:rsvp";

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `rsvp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getLocalRSVP() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearLocalRSVP() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function saveRSVP({ nombre, asistencia }) {
  const previous = getLocalRSVP();
  const id = previous?.id || createId();
  const now = new Date().toISOString();

  const localRecord = {
    id,
    nombre: nombre.trim(),
    asistencia: Boolean(asistencia),
    creadoEn: previous?.creadoEn || now,
    actualizadoEn: now,
    syncStatus: "synced"
  };

  const remoteRecord = {
    nombre: localRecord.nombre,
    asistencia: localRecord.asistencia,
    actualizadoEn: serverTimestamp()
  };

  // Solo definimos creadoEn la primera vez.
  if (!previous?.id) {
    remoteRecord.creadoEn = serverTimestamp();
  }

  // Usamos el mismo ID del navegador para que "Modificar mi respuesta"
  // actualice el mismo documento en Firestore en vez de duplicarlo.
  await setDoc(
    doc(db, "confirmaciones", id),
    remoteRecord,
    { merge: true }
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(localRecord));
  return localRecord;
}
