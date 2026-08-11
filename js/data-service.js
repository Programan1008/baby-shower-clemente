/**
 * Capa de datos del MVP.
 *
 * Ahora usa localStorage para que el flujo funcione sin Firebase.
 * Cuando conectemos Firestore, basta con reemplazar las funciones
 * saveRSVP/getRSVP/clearRSVP manteniendo la misma interfaz pública.
 */

const STORAGE_KEY = "babyClemente:rsvp";

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `rsvp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function saveRSVP(payload) {
  const previous = await getRSVP();
  const now = new Date().toISOString();

  const record = {
    id: previous?.id ?? createId(),
    nombre: payload.nombre.trim(),
    asistencia: Boolean(payload.asistencia),
    cantidadPersonas: payload.asistencia ? Number(payload.cantidadPersonas) : 0,
    creadoEn: previous?.creadoEn ?? now,
    actualizadoEn: now,
    syncStatus: "local"
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));

  // Simulamos una API asíncrona para que el frontend ya quede preparado
  // para Firestore.
  await Promise.resolve();

  return record;
}

export async function getRSVP() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export async function clearRSVP() {
  localStorage.removeItem(STORAGE_KEY);
  await Promise.resolve();
}

/**
 * Próxima etapa:
 *
 * export async function saveRSVP(payload) {
 *   const ref = doc(db, "confirmaciones", payload.id);
 *   await setDoc(ref, payload, { merge: true });
 * }
 */
