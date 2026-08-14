# Baby Shower Clemente — V6 Firestore

Esta versión conecta la invitación real con **Cloud Firestore**.

## Qué cambia

- Firestore pasa a ser la fuente central de confirmaciones.
- `localStorage` se mantiene solo para recordar la respuesta en el mismo navegador.
- Una confirmación se guarda en la colección `confirmaciones`.
- Al modificar una respuesta desde el mismo dispositivo se actualiza el mismo documento.
- Si Firestore falla, la interfaz informa el error y no finge que la respuesta quedó registrada.

## Archivos nuevos

- `js/firebase-config.js`
- `js/data-service.js`
- `firestore.rules`

## Primera prueba

1. Publica esta versión en GitHub/Netlify.
2. Abre el sitio.
3. Usa `Reiniciar prueba` si tu navegador conserva una respuesta anterior.
4. Selecciona Sí o No.
5. Ingresa un nombre, por ejemplo: `PRUEBA FIREBASE`.
6. Guarda.
7. Ve a Firebase Console > Firestore > Datos.
8. Debe aparecer automáticamente:
   - colección `confirmaciones`
   - un documento con nombre, asistencia y timestamps.

## IMPORTANTE: reglas

Actualmente tu Firestore fue creado en modo de prueba. Después de comprobar la primera escritura, abre:

Firebase Console > Firestore Database > Reglas

y reemplaza las reglas temporales por el contenido de `firestore.rules`.

Luego pulsa **Publicar**.

Estas reglas:
- permiten crear confirmaciones;
- permiten modificar una confirmación conocida;
- validan nombre y asistencia;
- bloquean lectura/listado público;
- bloquean borrado público.

## Git

```bash
git status
git add .
git commit -m "V6 conectar confirmaciones con Firestore"
git push
```

## Siguiente etapa

Crear un panel administrativo seguro para los papás. Como las reglas de esta V6 bloquean lectura pública, ese panel requerirá autenticación antes de poder consultar los nombres y estadísticas.
