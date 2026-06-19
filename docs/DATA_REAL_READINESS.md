# Data Real Readiness

## Current architecture

TeamGest currently runs as a local-first application:

- seed entities come from mock infrastructure
- local mutations persist through repository abstractions and storage helpers
- runtime repositories remain local/mock
- no Supabase client, auth runtime, or backend network layer is active

## What is ready

- shared repository abstraction already shields UI pages from direct data source access
- local-first mutation flows exist for services, payroll state, audit, backup/import/reset
- domain models for workers, clients, properties, services, payroll and audit are already separated
- storage and audit concerns are isolated enough to map toward future backend adapters

## What is not ready

- repositories do not yet return async mutation/list result envelopes
- auth and role enforcement do not exist
- no RLS, tenancy, ownership model, or real conflict handling exists
- local JSON backup is not a production migration pipeline by itself
- current runtime still assumes immediate local reads after writes

## Repository abstraction status

- UI already consumes `getRepositories()`
- repository factory still returns local/mock implementations only
- real contracts can be introduced without rewriting page consumers, but runtime activation must stay disabled until auth/security work exists

## localStorage limitations

- browser-local only
- single-device and single-browser scope
- no trustworthy concurrent multi-user behavior
- no secure storage guarantees for payroll-related information
- susceptible to manual deletion, browser quota issues, and device-level access

## Future backend requirements

- authenticated user model and role policy
- secure row ownership and row-level access control
- async repository interfaces with mutation/error envelopes
- migration tooling from local backup payloads to backend tables
- audit append policy and operational rollback guidance

## Migration risks

- local data may contain partial or malformed states accumulated over prototype use
- assignment/service references must be validated before real import
- archived/inactive semantics need a firm soft-delete strategy
- local ids should be preserved carefully to avoid broken cross-entity relations

## Recommended next steps before activation

1. Freeze repository contracts and async result shapes.
2. Finalize auth and role policy before any real adapter implementation.
3. Finalize Supabase schema and enum strategy.
4. Build import validators against real table constraints.
5. Add environment-gated real adapter wiring only after security review.
