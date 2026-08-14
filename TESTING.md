# TESTING V7

1. Publicar V7 en GitHub/Netlify.
2. Publicar `firestore.rules` en Firebase.
3. Abrir `/admin/`.
4. Iniciar sesión con el usuario de prueba creado en Firebase Authentication.
5. Como Firestore está vacío, debe mostrar 0 / 0 / 0.
6. Desde otro navegador o celular, crear una confirmación.
7. Volver al panel y pulsar Actualizar.
8. Debe aparecer el nombre y actualizar el contador.
9. Cerrar sesión.
10. Confirmar que sin login no se ve ningún registro.
