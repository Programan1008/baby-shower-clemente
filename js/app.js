(() => {
  "use strict";

  const EVENTO = Object.freeze({
    bebe: "Clemente",
    fechaISO: "2026-09-05",
    fechaTexto: "5 de septiembre de 2026",
    horaInicio: "16:30",
    horaFin: "20:30",
    ubicacionTexto: "Ñuñoa",
    direccion: "",
    tituloCalendario: "Baby Shower de Clemente",
    descripcionCalendario: "Celebración por la llegada de Clemente."
  });

  const REGALOS = Object.freeze([
    { icono: "🍼", nombre: "Pañales", detalle: "Tallas M y G" },
    { icono: "👕", nombre: "Ropita", detalle: "Idealmente de invierno" },
    { icono: "🧴", nombre: "Colonia para bebé", detalle: "Aroma suave" },
    { icono: "🛁", nombre: "Artículos de baño", detalle: "Shampoo, jabón o crema" },
    { icono: "🧻", nombre: "Toallitas húmedas", detalle: "Presentación para bebé" },
    { icono: "🧸", nombre: "Otro detalle", detalle: "Lo que quieras elegir con cariño" }
  ]);

  const LIMITS = Object.freeze({ minPersonas: 1, maxPersonas: 10 });
  const STORAGE_KEY = "babyClemente:rsvp";

  const state = {
    asistencia: null,
    cantidadPersonas: 1,
    currentRecord: null
  };

  const $ = (id) => document.getElementById(id);
  const steps = [...document.querySelectorAll(".step")];

  const flowCard = $("flowCard");
  const startBtn = $("startBtn");
  const yesBtn = $("yesBtn");
  const noBtn = $("noBtn");
  const rsvpForm = $("rsvpForm");
  const guestName = $("guestName");
  const nameError = $("nameError");
  const peopleBlock = $("peopleBlock");
  const peopleCount = $("peopleCount");
  const minusBtn = $("minusBtn");
  const plusBtn = $("plusBtn");
  const backToAttendanceBtn = $("backToAttendanceBtn");
  const detailsTitle = $("detailsTitle");
  const detailsCopy = $("detailsCopy");
  const giftGrid = $("giftGrid");
  const finishBtn = $("finishBtn");
  const finalTitle = $("finalTitle");
  const finalMessage = $("finalMessage");
  const summaryCard = $("summaryCard");
  const calendarBtn = $("calendarBtn");
  const editBtn = $("editBtn");
  const resetBtn = $("resetBtn");
  const returningSummary = $("returningSummary");
  const returnCalendarBtn = $("returnCalendarBtn");
  const returnEditBtn = $("returnEditBtn");
  const returnResetBtn = $("returnResetBtn");
  const toast = $("toast");

  function showStep(name, scroll = true) {
    steps.forEach((step) => {
      step.classList.toggle("is-active", step.dataset.step === name);
    });

    if (scroll) {
      flowCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function createId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return `rsvp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getRSVP() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function saveRSVP(payload) {
    const previous = getRSVP();
    const now = new Date().toISOString();

    const record = {
      id: previous?.id || createId(),
      nombre: payload.nombre.trim(),
      asistencia: Boolean(payload.asistencia),
      cantidadPersonas: payload.asistencia ? Number(payload.cantidadPersonas) : 0,
      creadoEn: previous?.creadoEn || now,
      actualizadoEn: now,
      syncStatus: "local"
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return record;
  }

  function clearRSVP() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function setAttendance(value) {
    state.asistencia = value;

    if (value) {
      detailsTitle.textContent = "¡Genial!";
      detailsCopy.textContent = "Cuéntanos quién viene a celebrar la llegada de Clemente.";
      peopleBlock.hidden = false;
    } else {
      detailsTitle.textContent = "Gracias por responder";
      detailsCopy.textContent = "Solo necesitamos tu nombre para registrar que esta vez no podrás acompañarnos.";
      peopleBlock.hidden = true;
    }

    showStep("details");
    setTimeout(() => guestName.focus(), 250);
  }

  function updateCounter() {
    peopleCount.textContent = String(state.cantidadPersonas);
    peopleCount.value = state.cantidadPersonas;
    minusBtn.disabled = state.cantidadPersonas <= LIMITS.minPersonas;
    plusBtn.disabled = state.cantidadPersonas >= LIMITS.maxPersonas;
  }

  function renderGifts() {
    giftGrid.replaceChildren();

    REGALOS.forEach((gift) => {
      const card = document.createElement("article");
      card.className = "gift-card";

      const icon = document.createElement("div");
      icon.className = "gift-card__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = gift.icono;

      const title = document.createElement("h3");
      title.textContent = gift.nombre;

      const detail = document.createElement("p");
      detail.textContent = gift.detalle;

      card.append(icon, title, detail);
      giftGrid.append(card);
    });
  }

  function buildSummary(record) {
    const dl = document.createElement("dl");

    const rows = [
      ["Nombre", record.nombre],
      ["Asistencia", record.asistencia ? "Sí" : "No"]
    ];

    if (record.asistencia) {
      rows.push(["Personas", String(record.cantidadPersonas)]);
    }

    rows.push(
      ["Fecha", EVENTO.fechaTexto],
      ["Hora", `${EVENTO.horaInicio} hrs`],
      ["Ubicación", EVENTO.ubicacionTexto]
    );

    rows.forEach(([label, value]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      dl.append(dt, dd);
    });

    return dl;
  }

  function renderDone(record) {
    state.currentRecord = record;
    summaryCard.replaceChildren(buildSummary(record));

    if (record.asistencia) {
      finalTitle.textContent = "¡Listo!";
      finalMessage.replaceChildren();

      const strong = document.createElement("strong");
      strong.textContent = "Tu asistencia ha sido confirmada.";
      finalMessage.append(strong, document.createElement("br"),
        document.createTextNode("Nos vemos para celebrar la llegada de Clemente."));

      calendarBtn.hidden = false;
    } else {
      finalTitle.textContent = "¡Gracias!";
      finalMessage.textContent = "Tu respuesta quedó registrada. Esperamos poder compartir otra ocasión contigo.";
      calendarBtn.hidden = true;
    }

    showStep("done");
  }

  function renderReturning(record) {
    state.currentRecord = record;
    returningSummary.replaceChildren(buildSummary(record));
    returnCalendarBtn.hidden = !record.asistencia;
    showStep("returning", false);
  }

  function prepareEdit(record) {
    state.asistencia = record.asistencia;
    state.cantidadPersonas = record.cantidadPersonas || LIMITS.minPersonas;
    guestName.value = record.nombre;
    updateCounter();

    if (record.asistencia) {
      detailsTitle.textContent = "Modifica tu confirmación";
      detailsCopy.textContent = "Puedes actualizar el nombre o la cantidad de personas.";
      peopleBlock.hidden = false;
    } else {
      detailsTitle.textContent = "Modifica tu respuesta";
      detailsCopy.textContent = "Puedes cambiar tu respuesta desde el paso anterior.";
      peopleBlock.hidden = true;
    }

    showStep("details");
  }

  function resetDemo() {
    clearRSVP();
    state.asistencia = null;
    state.cantidadPersonas = 1;
    state.currentRecord = null;
    guestName.value = "";
    nameError.textContent = "";
    updateCounter();
    showStep("attendance");
    showToast("Prueba reiniciada.");
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function toICSDate(dateISO, time) {
    const [year, month, day] = dateISO.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  }

  function escapeICS(text = "") {
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function downloadCalendarFile() {
    const start = toICSDate(EVENTO.fechaISO, EVENTO.horaInicio);
    const end = toICSDate(EVENTO.fechaISO, EVENTO.horaFin);

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Baby Clemente//RSVP//ES",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@baby-clemente`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeICS(EVENTO.tituloCalendario)}`,
      `DESCRIPTION:${escapeICS(EVENTO.descripcionCalendario)}`,
      `LOCATION:${escapeICS(EVENTO.direccion || EVENTO.ubicacionTexto)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "baby-shower-clemente.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  startBtn.addEventListener("click", () => {
    flowCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  yesBtn.addEventListener("click", () => setAttendance(true));
  noBtn.addEventListener("click", () => setAttendance(false));

  minusBtn.addEventListener("click", () => {
    state.cantidadPersonas = Math.max(LIMITS.minPersonas, state.cantidadPersonas - 1);
    updateCounter();
  });

  plusBtn.addEventListener("click", () => {
    state.cantidadPersonas = Math.min(LIMITS.maxPersonas, state.cantidadPersonas + 1);
    updateCounter();
  });

  backToAttendanceBtn.addEventListener("click", () => showStep("attendance"));

  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = guestName.value.trim();

    if (nombre.length < 2) {
      nameError.textContent = "Ingresa un nombre válido.";
      guestName.focus();
      return;
    }

    nameError.textContent = "";

    const record = saveRSVP({
      nombre,
      asistencia: state.asistencia,
      cantidadPersonas: state.asistencia ? state.cantidadPersonas : 0
    });

    state.currentRecord = record;

    if (record.asistencia) {
      showStep("gifts");
    } else {
      renderDone(record);
    }

    showToast("Respuesta guardada en este dispositivo.");
  });

  finishBtn.addEventListener("click", () => {
    if (state.currentRecord) renderDone(state.currentRecord);
  });

  calendarBtn.addEventListener("click", downloadCalendarFile);
  returnCalendarBtn.addEventListener("click", downloadCalendarFile);

  editBtn.addEventListener("click", () => {
    if (state.currentRecord) prepareEdit(state.currentRecord);
  });

  returnEditBtn.addEventListener("click", () => {
    if (state.currentRecord) prepareEdit(state.currentRecord);
  });

  resetBtn.addEventListener("click", resetDemo);
  returnResetBtn.addEventListener("click", resetDemo);

  function init() {
    renderGifts();
    updateCounter();

    const existing = getRSVP();
    if (existing) {
      renderReturning(existing);
    }
  }

  init();
})();
