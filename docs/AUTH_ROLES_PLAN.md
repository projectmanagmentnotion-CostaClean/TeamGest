# Auth Roles Plan

## Status

Planning only. Authentication is not implemented.

## Proposed roles

- `owner_admin`
- `manager`
- `worker`
- `accountant_viewer`

## Access model

### owner_admin

- full operational access
- can manage workers, clients, properties, services, payroll, settings, and migration tooling

### manager

- can create and review services
- can operate closures and payroll workflow
- can use local-to-real migration tools once enabled

### worker

- can view only own assigned services and own operational context
- should not access wider payroll, settings, backups, or global audit data

### accountant_viewer

- read-only payroll/export visibility
- no service mutation
- no worker-assignment editing

## Future auth requirements

- authenticated user to profile mapping
- role checks at repository/API layer
- row-level policies for service visibility
- stricter policies for payroll and audit surfaces
