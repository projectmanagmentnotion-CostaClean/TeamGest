# Security

TeamGest is browser-local and is not enterprise-secure storage. LocalStorage and JSON backups may contain operational/payroll information.

# Additional restrictions

- Never add real employee/customer data, credentials or secrets to code, fixtures or backups.
- Preserve repository/storage boundaries; UI must not call localStorage directly.
- Keep destructive local reset/import actions scoped to recognized TeamGest namespaces and explicit confirmation.
- Do not activate auth, RLS, Supabase or remote adapters without a reviewed contract and safe local coexistence.
- Production secrets, real-data migration, public deployment and main merge are human gates.
