(() => {
  "use strict";

  const EVENTO = Object.freeze({
    bebe: "Clemente",
    fechaISO: "2026-09-05",
    fechaTexto: "5 de septiembre de 2026",
    horaInicio: "16:30",
    horaFin: "20:30",
    ubicacionTexto: "Guillermo Mann 1375, entrada por Francisco Meneses",
    tituloCalendario: "Baby Shower de Clemente",
    descripcionCalendario: "Baby Shower de Clemente. Entrada por Francisco Meneses."
  });

  const REGALOS = Object.freeze([
    {
      numero: 1,
      categoria: "Artículos grandes",
      icono: "🍼",
      items: [
        { nombre: "Colchón de cuna" },
        { nombre: "Protector impermeable para el colchón" },
        { nombre: "Silla de comer" },
        { nombre: "Mecedora para bebé" },
        { nombre: "Corral", detalle: "Opcional" },
        { nombre: "Monitor para bebé" }
      ]
    },
    {
      numero: 2,
      categoria: "Lactancia y alimentación",
      icono: "🍽️",
      items: [
        { nombre: "Extractor de leche eléctrico" },
        { nombre: "Cojín de lactancia" }
      ]
    },
    {
      numero: 3,
      categoria: "Dormitorio",
      icono: "🧸",
      items: [
        { nombre: "Sábanas ajustables" },
        { nombre: "Manta liviana" },
        { nombre: "Manta gruesa" },
        { nombre: "Luz nocturna" },
        { nombre: "Humidificador" }
      ]
    },
    {
      numero: 4,
      categoria: "Baño e higiene",
      icono: "🛁",
      items: [
        { nombre: "Bañera" },
        { nombre: "Cepillo para el pelo" },
        { nombre: "Cortaúñas electrónico" },
        { nombre: "Aspirador nasal" },
        { nombre: "Termómetro digital" }
      ]
    },
    {
      numero: 5,
      categoria: "Paseos",
      icono: "🌎",
      items: [
        { nombre: "Mochila ergonómica portabebés" },
        { nombre: "Bolso mudador" },
        { nombre: "Mudador portátil" }
      ]
    },
    {
      numero: 6,
      categoria: "Ropa",
      icono: "👕",
      items: [
        {
          nombre: "Bodys",
          opciones: ["Manga corta", "Manga larga"]
        },
        { nombre: "Pijamas" },
        { nombre: "Pantalones" },
        { nombre: "Polerones o chalecos" },
        { nombre: "Calcetines" },
        { nombre: "Gorritos" },
        { nombre: "Mitones" },
        { nombre: "Enteritos" },
        { nombre: "Chaleco grueso" }
      ]
    },
    {
      numero: 7,
      categoria: "Cambio de pañal",
      icono: "👶🏼",
      items: [
        { nombre: "Pañales" }
      ]
    }
  ]);

  const STORAGE_KEY = "babyClemente:rsvp";
  const state = {
    asistencia: null,
    currentRecord: null
  };

  const $ = id => document.getElementById(id);
  const steps = [...document.querySelectorAll(".step")];

  function showStep(name, scroll = true) {
    steps.forEach(step => {
      step.classList.toggle("is-active", step.dataset.step === name);
    });

    if (scroll) {
      $("flowCard").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  function getRSVP() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function createId() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return `rsvp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function saveRSVP({ nombre, asistencia }) {
    const previous = getRSVP();
    const now = new Date().toISOString();

    const record = {
      id: previous?.id || createId(),
      nombre: nombre.trim(),
      asistencia: Boolean(asistencia),
      creadoEn: previous?.creadoEn || now,
      actualizadoEn: now,
      syncStatus: "local"
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return record;
  }

  function setAttendance(value) {
    state.asistencia = value;

    $("detailsTitle").textContent = value ? "¡Genial!" : "Gracias por responder";
    $("detailsCopy").textContent = value
      ? "Escribe tu nombre para registrar tu confirmación."
      : "Escribe tu nombre para registrar que esta vez no podrás acompañarnos.";

    showStep("details");
    setTimeout(() => $("guestName").focus(), 220);
  }

  function renderGifts() {
    const container = $("giftSections");
    container.replaceChildren();

    REGALOS.forEach(section => {
      const article = document.createElement("article");
      article.className = "gift-section";

      const header = document.createElement("div");
      header.className = "gift-header";

      const icon = document.createElement("div");
      icon.className = "gift-icon";
      icon.textContent = section.icono;
      icon.setAttribute("aria-hidden", "true");

      const title = document.createElement("h3");
      title.textContent = `${section.numero}. ${section.categoria}`;

      header.append(icon, title);

      const list = document.createElement("ul");
      list.className = "gift-list";

      section.items.forEach(item => {
        const li = document.createElement("li");
        li.className = item.opciones ? "gift-item gift-item--group" : "gift-item";

        const label = document.createElement("span");
        label.textContent = item.detalle
          ? `${item.nombre} (${item.detalle})`
          : item.nombre;

        li.append(label);

        if (item.opciones?.length) {
          const sublist = document.createElement("div");
          sublist.className = "gift-sublist";

          item.opciones.forEach(option => {
            const chip = document.createElement("span");
            chip.className = "gift-chip";
            chip.textContent = option;
            sublist.append(chip);
          });

          li.append(sublist);
        }

        list.append(li);
      });

      article.append(header, list);
      container.append(article);
    });
  }

  function buildSummary(record) {
    const dl = document.createElement("dl");

    [
      ["Nombre", record.nombre],
      ["Asistencia", record.asistencia ? "Sí" : "No"],
      ["Fecha", EVENTO.fechaTexto],
      ["Hora", `${EVENTO.horaInicio} hrs`],
      ["Ubicación", EVENTO.ubicacionTexto]
    ].forEach(([label, value]) => {
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
    $("summaryCard").replaceChildren(buildSummary(record));

    $("finalTitle").textContent = record.asistencia ? "¡Listo!" : "¡Gracias!";
    $("finalMessage").textContent = record.asistencia
      ? "Tu asistencia ha sido confirmada. Nos vemos para celebrar la llegada de Clemente."
      : "Tu respuesta quedó registrada. Esperamos poder compartir otra ocasión contigo.";

    $("calendarBtn").hidden = !record.asistencia;
    showStep("done");
  }

  function prepareEdit(record) {
    state.asistencia = record.asistencia;
    $("guestName").value = record.nombre;
    $("detailsTitle").textContent = "Modificar respuesta";
    $("detailsCopy").textContent = "Puedes actualizar el nombre registrado o volver para cambiar Sí/No.";
    showStep("details");
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    state.asistencia = null;
    state.currentRecord = null;
    $("guestName").value = "";
    $("nameError").textContent = "";
    showStep("attendance");
    showToast("Prueba reiniciada.");
  }

  function toICSDate(dateISO, time) {
    const [year, month, day] = dateISO.split("-");
    const [hour, minute] = time.split(":");
    return `${year}${month}${day}T${hour}${minute}00`;
  }

  function downloadCalendarFile() {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Baby Clemente//RSVP//ES",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `DTSTART:${toICSDate(EVENTO.fechaISO, EVENTO.horaInicio)}`,
      `DTEND:${toICSDate(EVENTO.fechaISO, EVENTO.horaFin)}`,
      `SUMMARY:${EVENTO.tituloCalendario}`,
      `DESCRIPTION:${EVENTO.descripcionCalendario}`,
      `LOCATION:${EVENTO.ubicacionTexto}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\\r\\n");

    const url = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar;charset=utf-8" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "baby-shower-clemente.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  $("startBtn").addEventListener("click", () => {
    $("flowCard").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("yesBtn").addEventListener("click", () => setAttendance(true));
  $("noBtn").addEventListener("click", () => setAttendance(false));
  $("backBtn").addEventListener("click", () => showStep("attendance"));

  $("rsvpForm").addEventListener("submit", event => {
    event.preventDefault();

    const nombre = $("guestName").value.trim();

    if (nombre.length < 2) {
      $("nameError").textContent = "Ingresa un nombre válido.";
      $("guestName").focus();
      return;
    }

    $("nameError").textContent = "";

    const record = saveRSVP({
      nombre,
      asistencia: state.asistencia
    });

    state.currentRecord = record;

    if (record.asistencia) {
      showStep("gifts");
    } else {
      renderDone(record);
    }

    showToast("Respuesta guardada en este dispositivo.");
  });

  $("finishBtn").addEventListener("click", () => {
    if (state.currentRecord) renderDone(state.currentRecord);
  });

  $("calendarBtn").addEventListener("click", downloadCalendarFile);
  $("returnCalendarBtn").addEventListener("click", downloadCalendarFile);

  $("editBtn").addEventListener("click", () => {
    if (state.currentRecord) prepareEdit(state.currentRecord);
  });

  $("returnEditBtn").addEventListener("click", () => {
    if (state.currentRecord) prepareEdit(state.currentRecord);
  });

  $("resetBtn").addEventListener("click", resetDemo);
  $("returnResetBtn").addEventListener("click", resetDemo);

  renderGifts();

  const existing = getRSVP();
  if (existing) {
    state.currentRecord = existing;
    $("returningSummary").replaceChildren(buildSummary(existing));
    $("returnCalendarBtn").hidden = !existing.asistencia;
    showStep("returning", false);
  }
})();
