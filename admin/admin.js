import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { firebaseConfig } from "../js/firebase-config.js";

const AUTHORIZED_UIDS = new Set(["bgPQyQ7KDndLDQMJXj9fHnV9MdS2"]);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = id => document.getElementById(id);

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2500);
}

function formatTimestamp(value) {
  if (!value?.toDate) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(value.toDate());
}

function personRow(record) {
  const row = document.createElement("div");
  row.className = "person";

  const name = document.createElement("b");
  name.textContent = record.nombre;

  const date = document.createElement("small");
  date.textContent = formatTimestamp(record.actualizadoEn || record.creadoEn);

  row.append(name, date);
  return row;
}

function renderList(container, records, emptyText) {
  container.replaceChildren();

  if (!records.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = emptyText;
    container.append(p);
    return;
  }

  records.forEach(record => container.append(personRow(record)));
}

async function loadConfirmations() {
  const refresh = $("refreshBtn");
  refresh.disabled = true;
  refresh.textContent = "Actualizando...";

  try {
    const snapshot = await getDocs(collection(db, "confirmaciones"));
    const all = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    all.sort((a, b) => {
      const aTime = a.actualizadoEn?.toMillis?.() || a.creadoEn?.toMillis?.() || 0;
      const bTime = b.actualizadoEn?.toMillis?.() || b.creadoEn?.toMillis?.() || 0;
      return bTime - aTime;
    });

    const confirmed = all.filter(item => item.asistencia === true);
    const declined = all.filter(item => item.asistencia === false);

    $("confirmedCount").textContent = String(confirmed.length);
    $("declinedCount").textContent = String(declined.length);
    $("totalCount").textContent = String(all.length);

    renderList($("confirmedList"), confirmed, "Aún no hay confirmaciones.");
    renderList($("declinedList"), declined, "Aún no hay respuestas negativas.");

    $("lastUpdate").textContent =
      "Actualizado: " + new Intl.DateTimeFormat("es-CL", {
        timeStyle: "short"
      }).format(new Date());

    toast("Datos actualizados.");
  } catch (error) {
    console.error("Error leyendo confirmaciones:", error);
    toast(error.code === "permission-denied"
      ? "Acceso denegado por Firestore."
      : "No se pudieron cargar los datos.");
  } finally {
    refresh.disabled = false;
    refresh.textContent = "Actualizar";
  }
}

function showLogin() {
  $("loginPanel").hidden = false;
  $("dashboard").hidden = true;
}

async function showDashboard(user) {
  if (!AUTHORIZED_UIDS.has(user.uid)) {
    await signOut(auth);
    $("loginError").textContent = "Esta cuenta no está autorizada para administrar el evento.";
    showLogin();
    return;
  }

  $("loginPanel").hidden = true;
  $("dashboard").hidden = false;
  $("sessionUser").textContent = user.email || "Administrador autorizado";
  $("loginError").textContent = "";

  await loadConfirmations();
}

$("loginForm").addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("email").value.trim();
  const password = $("password").value;

  if (!email || !password) {
    $("loginError").textContent = "Ingresa correo y contraseña.";
    return;
  }

  $("loginError").textContent = "";
  $("loginBtn").disabled = true;
  $("loginBtn").textContent = "Ingresando...";

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await showDashboard(credential.user);
  } catch (error) {
    console.error("Error de login:", error);
    $("loginError").textContent = "Correo o contraseña incorrectos, o acceso no autorizado.";
  } finally {
    $("loginBtn").disabled = false;
    $("loginBtn").textContent = "Iniciar sesión";
  }
});

$("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  showLogin();
  toast("Sesión cerrada.");
});

$("refreshBtn").addEventListener("click", loadConfirmations);

onAuthStateChanged(auth, user => {
  if (user) showDashboard(user);
  else showLogin();
});
