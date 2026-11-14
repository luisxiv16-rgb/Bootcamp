# Bootcamp UIP 2027 — auditoría de corrección (30 octubre 2026)

**Rama:** fix/registro-original-produccion-20261030. **Producción sin modificar.**

Se recuperó en el entorno de trabajo una copia íntegra del `index.html` aprobado: 14,145,410 bytes, SHA-256 `b680ede32b4b04bb5dadc4a87227a963cf7f82eca9a846d8acc5d1a83ef7908a`.

Hallazgos verificables:
- El título del documento indica «Plataforma en construcción».
- La portada ofrece «Probar con participante ficticio» y su código incluye `loadDemoParticipant()`.
- El registro original usa `localStorage` y no guarda directamente en `bootcamp_profiles`.
- Los cuatro test de Punto de inicio guardan los resultados en `localStorage` mediante `pSave()`.
- El panel de coordinación original presenta estadísticas locales, no Supabase.
- El código contiene imágenes institucionales embebidas y no debe ser reemplazado por un HTML simplificado.
- Supabase tiene `bootcamp_profiles` (2 perfiles al auditar), `bootcamp_ruta_progress` y tablas LEVEL UP; la existencia de tablas no verifica la conexión funcional de los formularios originales.

Se preparó un paquete local con respaldo íntegro y edición visual no destructiva de preproducción, pero **no se transfirió a GitHub ni a producción** debido al tamaño del `index.html` y falta de pruebas de integración. No se borró información.

**Aceptación pendiente antes de fusionar**: autenticar registro por correo sin Google; perfil centralizado (incluidos sede, facultad y turno); persistencia segura de cuatro test y puntuación no duplicable; grupos de 8 por carrera; acceso administrativo; bloqueo presencial validado por servidor; QA escritorio/móvil; recuperación de cuenta; backups y E2E.
