import { EVENTO } from "./config.js";

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

export function downloadCalendarFile() {
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
