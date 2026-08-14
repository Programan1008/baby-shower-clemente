# Baby Shower Clemente — V7 Admin Privado

Panel privado:
`/admin/`

UID de prueba autorizado:
`bgPQyQ7KDndLDQMJXj9fHnV9MdS2`

## Qué agrega
- Login con Firebase Authentication.
- Panel privado con:
  - confirmados;
  - no asistirán;
  - total de respuestas;
  - nombres;
  - fecha/hora de actualización.
- Lectura de Firestore protegida por UID.
- La contraseña no se guarda en HTML ni JavaScript.

## Publicación
```bash
git status
git add .
git commit -m "V7 panel privado de administracion"
git push
```

## IMPORTANTE: reglas de Firestore
Después de subir V7:

1. Firebase Console
2. Firestore
3. Reglas
4. Reemplaza las reglas actuales por el contenido de `firestore.rules`
5. Pulsa **Publicar**

Luego abre:
`https://babyshower-clementev1.netlify.app/admin/`

## Cuando lleguen los correos de los padres
1. Crear sus usuarios en Authentication.
2. Copiar sus UIDs.
3. Agregar cada UID a:
   - `admin/admin.js`
   - `firestore.rules`
4. Hacer `git push`.
5. Publicar las reglas nuevas.

Después puedes retirar tu UID si quieres que solo los padres mantengan acceso.
