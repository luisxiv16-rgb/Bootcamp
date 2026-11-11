# Actualización Bootcamp UIP 2027 — fase de preparación (11/11/2026)
- **No modificar la portada original:** index.html es un HTML monolítico grande, cuya lectura por el conector devuelve contenido vacío; se preserva.
- **Implementado en esta rama:** catálogo de las siete estaciones, horarios, rúbrica y módulo puro que propone equipos multidisciplinarios (150 personas ficticias, 20 equipos, 10 de 8 y 10 de 7); no escribe a base de datos.
- **Prueba reproducible:** `node --test tests/estaciones-2027.test.mjs` (el archivo usa assertions); también se puede ejecutar `node tests/estaciones-2027.test.mjs`.
- **Migraciones Supabase NO aplicadas:** falta backup verificable y diseño de RLS/roles de facilitador y logística; no alterar `bootcamp_profiles.team` existente.
- **Pendiente:** integración autenticada con la interfaz existente; esquema persistente para equipos, estaciones, evidencias, puntuaciones y QR; pruebas RLS, móviles y Vercel.
- **No publicar ni fusionar** hasta superar pruebas críticas, preservar UI y disponer de rollback comprobado.
