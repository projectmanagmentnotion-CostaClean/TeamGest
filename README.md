# TeamGest

TeamGest es una aplicación operativa local-first para gestionar la operación de una empresa de limpieza: trabajadores, clientes, inmuebles, servicios, horas trabajadas y cierres mensuales por trabajador.

> Estado actual: versión local preparada para uso interno. Los datos viven en el navegador mediante `localStorage`. No hay backend, autenticación, sincronización multiusuario ni pagos reales.

## Inicio rápido

Requisitos: Node.js compatible con el `package-lock.json` y npm.

```bash
npm install
npm run dev
```

Comandos de verificación:

```bash
npm run build
npm run lint
npm run preview
```

La aplicación se abre normalmente en `http://localhost:5173`.

## Flujo operativo principal

1. `Dashboard`: prioridades, avisos y actividad.
2. `Registrar horas`: entrada principal de horas ya trabajadas.
3. `Control de horas`: consulta, filtros y seguimiento de incidencias.
4. `Revisión de horas`: revisión, corrección, exclusión y validación.
5. `Cierres`: control mensual por trabajador y estado de bloqueo.
6. `Ajustes`: configuración, salud del almacenamiento, backup, importación, reset y auditoría.

## Módulos y rutas

| Área | Rutas principales |
| --- | --- |
| Dashboard | `/dashboard` |
| Entrada rápida | `/quick-entry` |
| Horas | `/hours`, `/hours/review`, `/hours/workers/:workerId`, `/hours/properties/:propertyId` |
| Trabajadores | `/workers`, `/workers/new`, `/workers/:id`, `/workers/:id/edit` |
| Inmuebles | `/properties`, `/properties/new`, `/properties/:id`, `/properties/:id/edit` |
| Clientes | `/clients`, `/clients/new`, `/clients/:id`, `/clients/:id/edit` |
| Servicios | `/services`, `/services/new`, `/services/:id`, `/services/:id/edit` |
| Nómina/cierres | `/payroll`, `/payroll/:month`, `/payroll/:month/workers/:workerId` |
| Ajustes | `/settings` |

## Arquitectura resumida

- `src/app`: composición de la aplicación, proveedores y routing.
- `src/components`: shell, formularios y componentes UI reutilizables.
- `src/domain`: tipos, inputs, estados y contratos de dominio.
- `src/modules`: páginas, componentes y servicios por módulo funcional.
- `src/infrastructure`: factoría de repositorios, repositorios locales, auditoría, mocks y plan de backend.
- `src/utils`: fechas, dinero, etiquetas, IDs y validaciones comunes.
- `docs`: especificaciones, auditorías, QA y planes de migración.

La factoría de repositorios está en `src/infrastructure/repositoryFactory.ts`. El runtime actual crea repositorios basados en `localStorage`; la infraestructura real está documentada pero deliberadamente desactivada.

## Persistencia y seguridad

Las claves usan el prefijo `teamgest:` y se definen en `src/infrastructure/storage/storageKeys.ts`. La aplicación incluye migraciones de esquema, metadatos, salud del almacenamiento, backup JSON, importación, reset y auditoría local.

`localStorage` no es almacenamiento seguro empresarial. No introducir datos reales sensibles ni credenciales en el repositorio. Las copias JSON deben tratarse como información operativa sensible.

## Documentación de continuidad

La guía principal para el siguiente agente está en [`docs/ORCHESTRATOR_HANDOFF.md`](docs/ORCHESTRATOR_HANDOFF.md). Incluye estado, mapa del código, invariantes, comandos, limitaciones, riesgos, orden de continuación y checklist de entrega.

Documentos de referencia:

- [`docs/READY_TO_USE_LOCAL_APP.md`](docs/READY_TO_USE_LOCAL_APP.md): alcance listo para uso local.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md): entidades y relaciones.
- [`docs/MODULE_RULES.md`](docs/MODULE_RULES.md): límites de ownership por módulo.
- [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md): comprobaciones de QA.
- [`docs/MIGRATION_PLAN_LOCAL_TO_REAL.md`](docs/MIGRATION_PLAN_LOCAL_TO_REAL.md): paso futuro a backend.
- [`docs/SECURITY_PRIVACY_NOTES.md`](docs/SECURITY_PRIVACY_NOTES.md): riesgos y postura de seguridad.
- [`docs/hardening/00_HARDENING_INDEX.md`](docs/hardening/00_HARDENING_INDEX.md): índice del hardening final.

## Git

La rama principal es `main` y el remoto configurado es `origin`. Antes de cerrar cualquier cambio, ejecutar build, lint, `git status`, commit y push. No subir `node_modules`, `dist`, archivos `.local`, secretos ni backups de datos.
