# Baby Shower Clemente — V5 FINAL VISUAL

Versión actualizada con la invitación final aprobada.

## Imagen oficial
La portada utiliza:

`assets/images/invitacion-clemente.png`

La imagen final incluye:
- QR incorporado;
- fecha y hora definitivas;
- dirección definitiva;
- entrada por Francisco Meneses;
- diseño visual final.

## Datos sincronizados en el código
La ubicación utilizada en el resumen final y en el archivo de calendario es:

`Guillermo Mann 1375, entrada por Francisco Meneses`

## Funcionalidad actual
- Responsive para PC y celular.
- Flujo Sí / No.
- Confirmación individual por nombre.
- Lista definitiva de regalos.
- Persistencia temporal con localStorage.
- Modificación de respuesta.
- Reinicio de pruebas.
- Archivo `.ics` para calendario.
- QR solamente dentro de la imagen oficial.

## Próxima etapa
Conectar Firebase / Cloud Firestore para que las confirmaciones sean globales y compartidas entre dispositivos.

Después podremos obtener:
- total de confirmados;
- total de personas que no asistirán;
- lista de nombres;
- panel de administración para los papás.

## Publicación
Después de copiar esta V5 a tu proyecto local:

```bash
git status
git add .
git commit -m "V5 imagen final y direccion definitiva"
git push
```

Netlify debería publicar automáticamente la nueva versión.
