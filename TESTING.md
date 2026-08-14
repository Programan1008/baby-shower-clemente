# TESTING V6 — FIRESTORE

## Prueba 1: primera escritura
1. Publicar V6.
2. Abrir Netlify.
3. Reiniciar prueba si corresponde.
4. Confirmar Sí.
5. Nombre: `PRUEBA FIREBASE 1`.
6. Guardar.
7. Revisar Firestore > Datos.
8. Debe aparecer `confirmaciones`.

## Prueba 2: segundo dispositivo
1. Abrir la URL desde otro celular o modo incógnito.
2. Confirmar con otro nombre.
3. Revisar Firestore.
4. Deben existir dos documentos diferentes.

## Prueba 3: modificación
1. En el primer dispositivo, modificar la respuesta.
2. Guardar.
3. En Firestore debe actualizarse el mismo documento, no crear otro.

## Prueba 4: No asistiré
1. Usar otro navegador/incógnito.
2. Seleccionar No.
3. Ingresar nombre.
4. Debe guardarse `asistencia: false`.

## Prueba 5: reglas
Después de confirmar que funciona:
1. Abrir `firestore.rules`.
2. Copiar su contenido.
3. Firebase Console > Firestore > Reglas.
4. Pegar.
5. Publicar.
6. Volver a probar una confirmación nueva.
