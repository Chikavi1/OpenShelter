Diagnóstico Profesional (estado actual)
Nivel general hoy: funcional para demo/operación interna, pero todavía lejos de un estándar profesional de producción pública.
Calificación rápida: 5.5/10.

Hallazgos Prioritarios (ordenados por severidad)

Crítico: exposición potencial de datos sensibles en API pública
La API pública devuelve el estado completo del dashboard, no una vista pública filtrada: route.ts:7, route.ts:8.
Ese estado incluye consultas de solicitudes, hogares temporales y seguimientos: dashboard-store.ts:88, dashboard-store.ts:89, dashboard-store.ts:91.
El modelo contiene PII explícita (correo, dirección, etc.): dashboard-defaults.ts:41, dashboard-defaults.ts:92.
Impacto: riesgo legal/privacidad y fuga de datos operativos.
Crítico: falta de defensa anti-spam y anti-fuerza bruta
Login sin rate limiting/captcha/bloqueo progresivo: route.ts:7.
Formulario público de adopción inserta directo a DB sin controles anti-abuso: route.ts:10, route.ts:40.
Impacto: spam masivo, llenado basura de CRM y riesgo de brute force.
Alto: hardening de auth mejorable
Comparación de firma no constante en tiempo: auth.ts:89.
Validación de credenciales con password plano desde variable de entorno: auth.ts:65, auth.ts:66.
Impacto: seguridad aceptable para pequeño proyecto, débil para entorno serio.
Alto: cabeceras de seguridad ausentes
Configuración actual no muestra CSP/HSTS/X-Frame-Options/Permissions-Policy: next.config.mjs:1, next.config.mjs:4.
Impacto: superficie mayor para XSS/clickjacking y políticas débiles de navegador.
Alto: SEO técnico muy básico
Solo metadata global mínima en layout: layout.tsx:5, layout.tsx:6, layout.tsx:7.
Falta de metadata enriquecida por página (OG/Twitter/canonical) y no se encontró implementación de sitemap/robots en el workspace.
Landing en cliente con carga de datos vía fetch no-store: page.tsx:1, page.tsx:21, use-public-site.ts:19.
Impacto: compartidos pobres y menor indexación/calidad SEO.
Medio: performance web subóptima
Imágenes sin optimización de Next: next.config.mjs:5.
Uso extensivo de img en landing: page.tsx:71, page.tsx:94.
Regla ESLint para no-img-element está desactivada: eslint.config.mjs:11.
Impacto: peor LCP y consumo de ancho de banda.
Medio: observabilidad y salud operativa inmaduras
Healthcheck solo devuelve ok, sin verificación de DB/storage/dependencias: route.ts:2.
No se aprecia capa de logging/tracing estructurado.
Impacto: incidentes difíciles de diagnosticar en producción.
Medio: validación de uploads insuficiente
Se valida que exista archivo, pero no tamaño máximo, whitelist MIME estricta ni antivirus: route.ts:14, route.ts:18.
Impacto: riesgo de abuso de almacenamiento y carga de contenido no deseado.
Medio: calidad y confiabilidad
No se encontraron pruebas automáticas (unit/integration/e2e).
Impacto: regresiones frecuentes al crecer el producto.
Qué falta para “tener algo ya bien” (prioridad práctica)

Semana 1 (bloque de seguridad/privacidad)
Separar DTO público de dashboard y exponer solo campos públicos en la API pública.
Rate limit en login y formularios públicos + captcha.
Hash de credenciales admin (o mover a usuarios en DB con hash) y comparación segura.
Agregar cabeceras de seguridad en middleware o configuración global.
Semana 2 (bloque SEO/performance)
Metadata por página: title/description/OG/Twitter/canonical.
Implementar sitemap y robots.
Migrar home y catálogo a render del servidor con datos públicos prefiltrados.
Cambiar imágenes críticas a optimización nativa y definir estrategia de tamaños.
Semana 3 (operación y calidad)
Healthcheck real (DB + storage).
Logging estructurado en APIs críticas (login, adopción, uploads, admin state).
Suite mínima de pruebas: auth, API pública, API admin y formularios.
Notas alineadas con tu lista de pendientes

Tu punto de “SEO para compartidos bonitos” es totalmente correcto y prioritario.
“Phone con filtro” también aplica calidad de datos; hoy no restringe numéricos: phone-input.tsx:66.
“Donativos según configuración” y “eventos” son mejoras de negocio/UX, pero seguridad y privacidad deben ir antes.
