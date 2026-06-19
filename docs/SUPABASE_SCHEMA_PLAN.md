# Supabase Schema Plan

## Status

Planning only. Supabase is not installed or activated in runtime.

## Proposed tables

- `users`
- `profiles`
- `workers`
- `clients`
- `properties`
- `service_jobs`
- `service_assignments`
- `payroll_months`
- `payroll_worker_statuses`
- `payroll_audit_entries`
- `app_audit_entries`
- `app_settings`
- `storage_backups`

## Relationships

- `profiles.user_id -> users.id`
- `properties.client_id -> clients.id`
- `service_jobs.client_id -> clients.id`
- `service_jobs.property_id -> properties.id`
- `service_assignments.service_job_id -> service_jobs.id`
- `service_assignments.worker_id -> workers.id`
- `payroll_worker_statuses.payroll_month_id -> payroll_months.id`
- `payroll_worker_statuses.worker_id -> workers.id`
- `payroll_audit_entries.payroll_month_id -> payroll_months.id`

## Index concepts

- status indexes on workers and clients
- date/status composite indexes on service jobs
- worker/confirmed index on service assignments
- month-key index on payroll months
- action/date index on app audit entries

## RLS concepts

- workers should eventually see only their own assigned operational data
- managers/admins need service write access
- payroll access should be limited to managers/admin-like roles and accountant/viewer roles
- audit tables should be append-oriented with restricted mutation rights

## Ownership model

- operational entities should be organization-owned
- user-facing access should be mediated by profile role
- payroll and audit data should not be writable by worker-only roles

## Timestamps and soft delete

Recommended baseline columns:

- `created_at`
- `updated_at`
- `deleted_at` where archive/soft-delete behavior matters

## Enum strategy

Keep readable text enums aligned with current domain values:

- entity status
- service status
- payroll status
- worker role
- service type

## Audit strategy

- operational payroll audit stays separated from app-level audit
- append-only semantics are preferred
- metadata should remain compact and non-sensitive

## Backup/import policy

- local browser backups should not be stored as raw production blobs by default
- backend can store backup metadata and migration references
- import should validate counts, references and enum compatibility before write
