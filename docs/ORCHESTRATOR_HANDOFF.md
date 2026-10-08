# TeamGest — Orchestrator Handoff

Documento de continuidad para cualquier agente o desarrollador que retome el proyecto. Fecha de revisión: 2026-10-08. Esta revisión corresponde al commit `7ae8c93` (`docs: prepare orchestrator handoff`).

## 1. Resumen ejecutivo

TeamGest es una SPA React 19 + TypeScript + Vite para operaciones de una empresa de limpieza. El producto se encuentra en una fase local-first operativa y endurecida: permite gestionar maestros, registrar horas, revisar incidencias y seguir cierres mensuales. La persistencia activa es el navegador mediante `localStorage`.

La prioridad de producto es **hours-first**: las horas trabajadas, su revisión y su cierre mensual tienen precedencia sobre la gestión administrativa secundaria. El dashboard y la navegación deben continuar orientando al operador hacia ese flujo.

Estado comprobado en esta entrega:

- `npm run build`: correcto.
- `npm run lint`: ejecutado sin errores reportados.
- búsqueda de secretos en archivos no generados: sin candidatos encontrados.
- working tree previo a la documentación: limpio y alineado con `origin/main`.
- no existen tests automatizados (`*.test.*` / `*.spec.*`) en el repositorio.

## 2. Contrato de producto actual

### Sí está implementado

- Dashboard operativo con avisos y prioridades.
- Entrada rápida de servicios y registro de horas.
- Control de horas por trabajador e inmueble.
- Revisión de horas con correcciones, incidencias, exclusiones y warnings.
- Cierres mensuales por trabajador con estados, bloqueos y auditoría local.
- CRUD local de trabajadores, clientes, inmuebles y servicios.
- Configuración tipada y validada.
- Backup JSON, importación, reset, metadatos y health check de almacenamiento.
- Auditoría local de eventos operativos.
- Lazy loading de páginas mediante `React.lazy`.
- Layout responsive y flows de formularios tipo StepFlow.

### No está implementado y no debe suponerse implementado

- Backend o API.
- Supabase en runtime.
- Autenticación, roles, RLS o multiusuario.
- Sincronización entre dispositivos.
- Pagos reales.
- Exportación PDF/CSV.
- Calendario, Google Calendar o pipeline.
- Tests automatizados y browser visual QA automatizado.

No presentar el estado local como seguro para nómina real ni como producto multiusuario.

## 3. Cómo arrancar y verificar

Desde la raíz del repositorio:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

El build ejecuta primero `tsc -b` y después Vite. `dist/` se genera, pero está ignorado por Git. No instalar Supabase ni infraestructura adicional para continuar el runtime actual.

## 4. Mapa de arquitectura

```text
src/
├── app/                 composición, providers y rutas
├── components/          shell, UI común y flows de formularios
├── domain/              tipos, inputs y contratos de dominio
├── infrastructure/      repositorios, storage, auditoría y plan real
├── modules/
│   ├── dashboard/       resumen operativo
│   ├── hours/           horas, revisión e incidencias
│   ├── payroll/         nómina derivada y cierres mensuales
│   ├── services/        servicios y Quick Entry
│   ├── workers/         trabajadores
│   ├── properties/      inmuebles
│   ├── clients/         clientes
│   └── settings/        configuración y seguridad de datos local
├── styles/              tokens y estilos globales
└── utils/               utilidades puras
```

Puntos de entrada importantes:

- `src/main.tsx`: bootstrap React.
- `src/app/App.tsx`: composición raíz.
- `src/app/routes.tsx`: catálogo de rutas y lazy loading.
- `src/app/providers/AppProviders.tsx`: providers globales.
- `src/infrastructure/repositoryFactory.ts`: composición de repositorios y herramientas de storage.
- `src/infrastructure/storage/storageKeys.ts`: contrato de namespace persistente.
- `src/infrastructure/storage/storageMigrations.ts`: versión y migraciones.
- `src/infrastructure/storage/storageBackup.ts`: backup descargable.
- `src/infrastructure/audit/auditRepository.ts`: auditoría local.
- `src/infrastructure/real/README.md`: frontera y plan de backend.

## 5. Rutas completas

Definidas en `src/app/routes.tsx`:

```text
/                         redirige a /dashboard
/dashboard
/quick-entry
/hours
/hours/review
/hours/workers/:workerId
/hours/properties/:propertyId
/workers
/workers/new
/workers/:id
/workers/:id/edit
/properties
/properties/new
/properties/:id
/properties/:id/edit
/clients
/clients/new
/clients/:id
/clients/:id/edit
/services
/services/new
/services/:id
/services/:id/edit
/payroll
/payroll/:month
/payroll/:month/workers/:workerId
/settings
```

La ruta wildcard vuelve a `/dashboard`. Mantener páginas lazy y el fallback de carga al añadir rutas nuevas.

## 6. Dominio e invariantes

Entidades principales: `Worker`, `Client`, `Property`, `Service`, entradas de horas, meses de nómina/cierre y ajustes de aplicación. Los tipos viven en `src/domain/` y los repositorios en `src/infrastructure/repositories/`.

Invariantes de continuación:

1. Las horas son el flujo operativo principal.
2. Los cálculos de dinero y horas deben permanecer en servicios puros y centralizados.
3. Las relaciones se mantienen por IDs estables, nunca por índices o etiquetas visibles.
4. Archivar no equivale a borrar; respetar los estados y la recuperación local.
5. Las advertencias deben bloquear o señalar solo cuando la regla de negocio lo exige.
6. Los formularios StepFlow deben conservar navegación móvil sin railes comprimidos ni overflow.
7. Las acciones destructivas requieren confirmación y deben dejar rastro cuando corresponda.
8. Todo cambio de almacenamiento debe contemplar migración, backup e importación.
9. No activar backend/auth sin revisar `AUTH_ROLES_PLAN.md`, `SUPABASE_SCHEMA_PLAN.md`, `DATA_REAL_READINESS.md` y `MIGRATION_PLAN_LOCAL_TO_REAL.md`.

## 7. Persistencia local

El namespace es `teamgest`. Las claves actuales se declaran en `src/infrastructure/storage/storageKeys.ts`:

```text
teamgest:services:created
teamgest:services:overrides
teamgest:services:archived
teamgest:workers:created
teamgest:workers:overrides
teamgest:workers:archived
teamgest:clients:created
teamgest:clients:overrides
teamgest:clients:archived
teamgest:properties:created
teamgest:properties:overrides
teamgest:properties:archived
teamgest:payroll:months
teamgest:payroll:audit
teamgest:app:audit
teamgest:storage:metadata
teamgest:settings
teamgest:backup:history
```

Existe además una clave legacy de servicios: `costaflow.services.local`. No eliminarla sin comprobar la migración. La versión del esquema y las marcas de backup/import/reset viven en los metadatos de storage.

## 8. Backend futuro

El backend está planificado, no conectado. La transición correcta es:

1. Exportar un backup JSON local.
2. Validar versión, namespace y conteos.
3. Diseñar tablas y políticas de acceso.
4. Migrar en orden: trabajadores, clientes, inmuebles, servicios, asignaciones, meses/cierres y auditoría.
5. Verificar IDs, referencias, conteos y muestras.
6. Conservar backup original y metadata de lote.
7. Activar autenticación y permisos antes de datos multiusuario.

No reemplazar los repositorios locales directamente por llamadas remotas sin una estrategia de fallback/migración y sin preservar auditoría.

## 9. Documentación existente que debe leerse antes de cambios grandes

- `docs/APP_BLUEPRINT.md`: visión y alcance.
- `docs/DATA_MODEL.md`: entidades y relaciones.
- `docs/MODULE_RULES.md`: ownership y límites de módulos.
- `docs/UX_SYSTEM.md`: sistema visual y reglas de interacción.
- `docs/CODEX_WORKFLOW.md`: disciplina de trabajo, QA y cierre.
- `docs/QA_CHECKLIST.md`: QA del runtime.
- `docs/FINISHED_LOCAL_APP_CHECKLIST.md`: definición de terminado local.
- `docs/SECURITY_PRIVACY_NOTES.md`: riesgos de localStorage y backups.
- `docs/hardening/00_HARDENING_INDEX.md` a `10_RELEASE_READINESS.md`: hardening final separado por áreas.
- `docs/TECHNICAL_CLEANUP_AUDIT.md`: cleanup aplicado y diferido.
- `docs/SUPABASE_SCHEMA_PLAN.md` y `src/infrastructure/real/`: diseño futuro, no runtime activo.

## 9.1 Inventario de entrega

La entrega versionada incluye:

- `package.json` y `package-lock.json` para instalación reproducible.
- `index.html`, `vite.config.ts`, `tsconfig*.json` y `eslint.config.js` para build, TypeScript, Vite y lint.
- `public/` con favicon e iconos estáticos.
- `src/app/` con composición, providers y routing lazy.
- `src/components/` con shell, UI genérica, formularios y StepFlow.
- `src/domain/` con tipos e inputs de negocio.
- `src/infrastructure/` con mocks, repositorios locales, storage, auditoría y planificación real aislada.
- `src/modules/` con dashboard, horas, trabajadores, clientes, inmuebles, servicios, cierres y ajustes.
- `src/styles/` y `src/utils/` con tokens, responsive UI y utilidades puras.
- `docs/` con blueprint, modelo de datos, reglas de módulos, UX, QA, hardening, seguridad, migración y este handoff.

No forman parte de la entrega por diseño:

- `node_modules/` y `dist/`, generados localmente.
- archivos `.env`, `.local`, logs, claves, certificados y backups de datos reales.
- datos personales o credenciales reales.

## 10. Orden recomendado para continuar

### Si la siguiente tarea es mantenimiento local

1. Leer este documento y el documento específico del módulo.
2. Reproducir con `npm run build` y `npm run lint`.
3. Cambiar primero servicios/types si cambia una regla; después UI.
4. Actualizar warnings, auditoría y documentación de QA.
5. Verificar migraciones si toca storage.
6. Ejecutar build, lint y revisión de `git diff`.

### Si la siguiente tarea es backend real

No comenzar por instalar un SDK. Primero completar decisiones de auth/roles, esquema, migración, backup, políticas de acceso y estrategia de coexistencia local/remota. Revisar `DATA_REAL_READINESS.md` y la migración, y exigir una prueba de importación reversible.

### Si la siguiente tarea es UX

Preservar el sistema de tokens en `src/styles/tokens.css`, los patrones de `src/components/ui`, el shell responsive y los StepFlows. Cualquier afirmación de QA visual debe indicar si fue browser-tested o solo code-level.

## 11. QA y limitaciones conocidas

- No hay suite automatizada; la validación principal es build, lint, revisión de rutas y QA documentado.
- El browser visual QA no está automatizado en el repositorio.
- Los datos del navegador pueden perderse al limpiar el perfil o cambiar de dispositivo.
- Los backups son portables y no están cifrados por la aplicación.
- El chunk principal puede seguir siendo grande; comprobar el documento de performance antes de optimizar.
- `dist/` y `node_modules/` no forman parte del commit.

## 12. Checklist de entrega para Orchestrator

- [ ] Leer este handoff y el documento del módulo afectado.
- [ ] Confirmar `git status` antes de editar.
- [ ] No introducir secretos ni backups reales.
- [ ] Mantener cambios pequeños y por responsabilidad.
- [ ] Ejecutar `npm run build`.
- [ ] Ejecutar `npm run lint`.
- [ ] Revisar diff y estado Git.
- [ ] Actualizar documentación afectada.
- [ ] Commit con mensaje descriptivo.
- [ ] Push a `origin/main` o a la rama de trabajo acordada.
- [ ] Reportar hash, build, lint, pruebas omitidas y limitaciones.

## 13. Remoto y estado de publicación

El remoto configurado es:

```text
origin https://github.com/projectmanagmentnotion-CostaClean/TeamGest.git
```

La rama de trabajo actual es `main`. Nunca incluir tokens en URLs, commits o documentación. Antes de informar que una entrega está publicada, comprobar `git status --short --branch` y confirmar que el push terminó sin error.
