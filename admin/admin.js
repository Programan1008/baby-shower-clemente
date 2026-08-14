import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import { firebaseConfig } from "../js/firebase-config.js";

/* =========================================================
   ADMINISTRADORES AUTORIZADOS
   ========================================================= */

const AUTHORIZED_UIDS = new Set([
  "yNMU9itxIzfzdxDxhHSJDqJtr6s1", // Cris
  "pbTxZHPkxpUI6vWEkCrIiAEcKfx2", // César
  "Ilgd5X6ASeUOW4vx68ITyM9GB6q1"  // Katherine
]);

/* =========================================================
   FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* =========================================================
   UTILIDADES
   ========================================================= */

const $ = id => document.getElementById(id);

function toast(message) {
  const el = $("toast");

  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
}

function formatTimestamp(value) {
  if (!value?.toDate) {
    return "Sin fecha";
  }

  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(value.toDate());
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "Sin fecha";
  }
}

/* =========================================================
   CREACIÓN DE FILAS
   ========================================================= */

function personRow(record) {
  const row = document.createElement("div");
  row.className = "person";

  const name = document.createElement("b");
  name.textContent = record.nombre || "Sin nombre";

  const date = document.createElement("small");
  date.textContent = formatTimestamp(
    record.actualizadoEn || record.creadoEn
  );

  row.append(name, date);

  return row;
}

function renderList(container, records, emptyText) {
  if (!container) return;

  container.replaceChildren();

  if (!records.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = emptyText;

    container.append(p);

    return;
  }

  records.forEach(record => {
    container.append(personRow(record));
  });
}

/* =========================================================
   FIRESTORE
   ========================================================= */

async function loadConfirmations() {
  const refresh = $("refreshBtn");

  if (refresh) {
    refresh.disabled = true;
    refresh.textContent = "Actualizando...";
  }

  try {
    console.log("Consultando confirmaciones en Firestore...");

    const snapshot = await getDocs(
      collection(db, "confirmaciones")
    );

    const all = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    /*
      Ordenar por última actualización,
      dejando primero los registros más recientes.
    */
    all.sort((a, b) => {
      const aTime =
        a.actualizadoEn?.toMillis?.() ||
        a.creadoEn?.toMillis?.() ||
        0;

      const bTime =
        b.actualizadoEn?.toMillis?.() ||
        b.creadoEn?.toMillis?.() ||
        0;

      return bTime - aTime;
    });

    const confirmed = all.filter(
      item => item.asistencia === true
    );

    const declined = all.filter(
      item => item.asistencia === false
    );

    $("confirmedCount").textContent =
      String(confirmed.length);

    $("declinedCount").textContent =
      String(declined.length);

    $("totalCount").textContent =
      String(all.length);

    renderList(
      $("confirmedList"),
      confirmed,
      "Aún no hay confirmaciones."
    );

    renderList(
      $("declinedList"),
      declined,
      "Aún no hay respuestas negativas."
    );

    $("lastUpdate").textContent =
      "Actualizado: " +
      new Intl.DateTimeFormat("es-CL", {
        timeStyle: "short"
      }).format(new Date());

    console.log(
      `Confirmaciones cargadas: ${all.length}`
    );

    toast("Datos actualizados.");

  } catch (error) {
    console.error(
      "Error leyendo confirmaciones:",
      error
    );

    console.error(
      "Código Firestore:",
      error.code
    );

    console.error(
      "Mensaje Firestore:",
      error.message
    );

    if (error.code === "permission-denied") {
      toast(
        "Tu cuenta no tiene permiso para leer las confirmaciones."
      );
    } else if (
      error.code === "unavailable"
    ) {
      toast(
        "Firestore no está disponible temporalmente."
      );
    } else {
      toast(
        "No se pudieron cargar los datos."
      );
    }

  } finally {
    if (refresh) {
      refresh.disabled = false;
      refresh.textContent = "Actualizar";
    }
  }
}

/* =========================================================
   PANTALLAS
   ========================================================= */

function showLogin() {
  const loginPanel = $("loginPanel");
  const dashboard = $("dashboard");

  if (loginPanel) {
    loginPanel.hidden = false;
  }

  if (dashboard) {
    dashboard.hidden = true;
  }
}

async function showDashboard(user) {
  /*
    Segunda validación:
    además de Firebase Authentication,
    revisamos que el UID esté permitido.
  */

  if (!AUTHORIZED_UIDS.has(user.uid)) {
    console.warn(
      "Usuario autenticado pero NO autorizado:",
      user.uid
    );

    await signOut(auth);

    $("loginError").textContent =
      "Esta cuenta no está autorizada para administrar el evento.";

    showLogin();

    return;
  }

  console.log(
    "Administrador autorizado:",
    user.email,
    user.uid
  );

  $("loginPanel").hidden = true;
  $("dashboard").hidden = false;

  $("sessionUser").textContent =
    user.email || "Administrador autorizado";

  $("loginError").textContent = "";

  await loadConfirmations();
}

/* =========================================================
   LOGIN
   ========================================================= */

$("loginForm").addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const email = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password) {
      $("loginError").textContent =
        "Ingresa correo y contraseña.";

      return;
    }

    $("loginError").textContent = "";

    $("loginBtn").disabled = true;
    $("loginBtn").textContent =
      "Ingresando...";

    try {
      console.log(
        "Intentando autenticación Firebase:",
        email
      );

      const credential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log(
        "Firebase Authentication correcto."
      );

      console.log(
        "UID recibido:",
        credential.user.uid
      );

      /*
        Aquí comprobamos el UID
        inmediatamente después del login.
      */

      if (
        !AUTHORIZED_UIDS.has(
          credential.user.uid
        )
      ) {
        console.warn(
          "UID no autorizado:",
          credential.user.uid
        );

        await signOut(auth);

        $("loginError").textContent =
          "Tu cuenta existe, pero no tiene autorización para este panel.";

        return;
      }

      await showDashboard(
        credential.user
      );

    } catch (error) {
      /*
        IMPORTANTE:
        ahora mostramos el error real
        que devuelve Firebase.
      */

      console.error(
        "Error de login:",
        error
      );

      console.error(
        "Código Firebase:",
        error.code
      );

      console.error(
        "Mensaje Firebase:",
        error.message
      );

      switch (error.code) {

        case "auth/invalid-credential":

          $("loginError").textContent =
            "Correo o contraseña incorrectos.";

          break;

        case "auth/invalid-email":

          $("loginError").textContent =
            "El correo electrónico no es válido.";

          break;

        case "auth/user-disabled":

          $("loginError").textContent =
            "Este usuario está deshabilitado en Firebase.";

          break;

        case "auth/too-many-requests":

          $("loginError").textContent =
            "Demasiados intentos. Espera unos minutos e inténtalo nuevamente.";

          break;

        case "auth/network-request-failed":

          $("loginError").textContent =
            "Error de conexión. Revisa tu conexión a Internet.";

          break;

        case "auth/operation-not-allowed":

          $("loginError").textContent =
            "El acceso por correo y contraseña no está habilitado.";

          break;

        case "auth/unauthorized-domain":

          $("loginError").textContent =
            "Este dominio no está autorizado en Firebase Authentication.";

          break;

        default:

          $("loginError").textContent =
            `Error de autenticación: ${
              error.code || "desconocido"
            }`;
      }

    } finally {

      $("loginBtn").disabled = false;

      $("loginBtn").textContent =
        "Iniciar sesión";
    }
  }
);

/* =========================================================
   LOGOUT
   ========================================================= */

$("logoutBtn").addEventListener(
  "click",
  async () => {

    try {
      await signOut(auth);

      showLogin();

      toast(
        "Sesión cerrada."
      );

    } catch (error) {

      console.error(
        "Error cerrando sesión:",
        error
      );

      toast(
        "No se pudo cerrar la sesión."
      );
    }
  }
);

/* =========================================================
   ACTUALIZACIÓN MANUAL
   ========================================================= */

$("refreshBtn").addEventListener(
  "click",
  loadConfirmations
);

/* =========================================================
   CONTROL DE SESIÓN FIREBASE
   ========================================================= */

onAuthStateChanged(
  auth,
  user => {

    if (!user) {

      console.log(
        "No existe sesión activa."
      );

      showLogin();

      return;
    }

    console.log(
      "Sesión Firebase detectada:",
      user.email,
      user.uid
    );

    showDashboard(user);
  }
);