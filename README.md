# Baby Shower Clemente — MVP 1

Mini aplicación web responsive para:

- mostrar la invitación;
- confirmar asistencia (Sí / No);
- indicar el nombre del invitado;
- indicar cuántas personas asistirán;
- mostrar una lista estática de ideas de regalos;
- mostrar una confirmación final;
- recordar la respuesta en el mismo dispositivo;
- generar un archivo `.ics` para agregar el evento al calendario.

## Stack

- HTML5
- CSS3
- JavaScript ES6+ (módulos)
- `localStorage` como capa de persistencia temporal
- arquitectura preparada para reemplazar `localStorage` por Firebase Firestore

No usa React, Node.js, Python, MongoDB ni backend propio.

## Cómo probarlo

Esta versión funciona incluso abriendo `index.html` directamente. Para desarrollo sigue siendo recomendable usar un servidor local.

### Opción 1 — VS Code Live Server

1. Abre la carpeta `baby-clemente-mvp1` en VS Code.
2. Instala la extensión **Live Server** si no la tienes.
3. Clic derecho sobre `index.html`.
4. Selecciona **Open with Live Server**.

### Opción 2 — Python local

Si tienes Python instalado:

```bash
python -m http.server 5500
```

Luego abre:

```text
http://localhost:5500
```

## Archivos principales

```text
baby-clemente-mvp1/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── calendar.js
│   ├── config.js
│   └── data-service.js
└── assets/
    └── images/
        └── invitacion-clemente.png
```

## Qué es simulación en este MVP

La confirmación se almacena solamente en `localStorage`. Esto permite validar toda la UX sin configurar Firebase todavía.

La interfaz de la capa de datos ya está aislada en:

```text
js/data-service.js
```

En la siguiente etapa reemplazaremos internamente:

- `saveRSVP()`
- `getRSVP()`

por operaciones de Firestore, sin reescribir la interfaz.

## Cómo limpiar una prueba

Abre DevTools → Application → Local Storage y elimina:

```text
babyClemente:rsvp
```

o ejecuta en la consola:

```javascript
localStorage.removeItem("babyClemente:rsvp");
location.reload();
```

## Datos que después debemos confirmar

Edita `js/config.js`:

```javascript
export const EVENTO = {
  bebe: "Clemente",
  fechaISO: "2026-09-05",
  fechaTexto: "5 de septiembre de 2026",
  horaInicio: "16:30",
  horaFin: "20:30",
  ubicacionTexto: "Ñuñoa",
  direccion: ""
};
```

También podemos editar ahí mismo la lista de ideas de regalos.

## Próxima etapa

1. Ajustes visuales del MVP.
2. Conectar Firestore.
3. Guardar confirmaciones compartidas.
4. Crear panel de administración.
5. Exportación CSV.
6. Deploy en Netlify.
7. Generar QR definitivo.
