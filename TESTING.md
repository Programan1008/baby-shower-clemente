# PRUEBAS DEL MVP 1

## Importante
Esta versión ya NO utiliza módulos JavaScript (`type="module"`), por lo que puedes probarla incluso abriendo `index.html` con doble clic.

Aun así, para desarrollo sigue siendo recomendable usar Live Server.

## Qué se corrigió

1. La imagen de la invitación ya no usa `object-fit: cover`.
2. Se muestra completa con su proporción original.
3. Los textos y botones ya no se superponen encima de la invitación.
4. El botón **Confirmar asistencia** queda debajo de la imagen.
5. JavaScript se carga con `defer` y en un único archivo, para evitar errores al abrir con `file://`.
6. Se agregó **Reiniciar prueba** para borrar localStorage fácilmente.

## Flujo a probar

### Caso A — Sí asiste
1. Presiona `Confirmar asistencia`.
2. Presiona `Sí, asistiré`.
3. Escribe un nombre.
4. Cambia el número de personas con `-` y `+`.
5. Presiona `Confirmar`.
6. Revisa la lista de regalos.
7. Presiona `Continuar`.
8. Revisa la confirmación final.
9. Prueba `Agregar al calendario`.
10. Recarga la página: debería reconocer la respuesta guardada.

### Caso B — No asiste
1. Usa `Reiniciar prueba`.
2. Selecciona `No podré asistir`.
3. Ingresa un nombre.
4. Confirma.
5. Debe saltar directamente a la pantalla final, sin mostrar regalos.

### Caso C — Modificar
1. Con una respuesta guardada, recarga la página.
2. Presiona `Modificar mi respuesta`.
3. Cambia nombre o cantidad.
4. Confirma nuevamente.

## Si algo falla
Abre DevTools con `F12` → pestaña `Console` y copia el error exacto.
