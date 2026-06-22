# CostaFlow Ops UX System

## Minimalist UX

The interface should feel calm, premium and operational. Layouts use generous spacing, a light canvas and blue as the main accent so operators can scan status quickly without visual noise.

## Card-based interface

Cards are the default surface for summaries, placeholders, forms and warnings. This keeps modules visually consistent while allowing future density changes without redesigning each page independently.

## StepFlow future

Complex create and review flows evolve into a step-based experience. The current StepFlow keeps the user focused on one decision at a time while preserving a stable draft.

## Warning system

Warning banners and warning cards establish a shared tone system for informational, warning, danger, blocked and success states. Later sprints can keep wiring repository and calculation outputs into this pattern.

## Mobile-first principles

The shell prioritizes safe resizing, sticky navigation on small screens and simple tap targets. Desktop uses a persistent sidebar, while mobile exposes a compact bottom navigation that keeps the main content readable.

## Dashboard command center UX

The dashboard should behave like a command center: strong hero hierarchy, compact KPIs, visible critical alerts, recent activity and direct actions without forcing dense navigation.

## Worker profile UX

Worker detail screens are read-only operational profiles. They should explain who the worker is, what they worked on this month, what they are expected to earn and what needs review.

## Client profile UX

Client screens should clarify the commercial relationship quickly: who the client is, what properties depend on them, what services ran this month and where warnings require follow-up.

## Property profile UX

Property screens should combine place context, linked client, service history and worker participation into a compact operational profile that can be scanned without editing controls.

## Services operational profile UX

Service screens should expose operational state immediately: what service it is, where it happens, who is assigned, what it costs and which warnings block clean execution.

## StepFlow creation UX

The creation flow should reduce decision load by revealing only one step at a time while keeping a visible sense of progress and a stable local draft.

## Guided validation and warnings

Warnings should appear close to the active step, be readable at a glance and block forward movement only when the service draft is not yet viable.

## Cross-linked operational navigation

Read-only profiles should be linked to adjacent entities so the user can move naturally across the operational chain.

## Read-only operational screens

When a screen is informational only, the layout should make that obvious through clear summaries, labels and warning states rather than empty form controls.

## Mobile scanability

Lists and summaries should collapse cleanly into stacked cards. Dense tables should be avoided unless the data can remain readable on a narrow screen.

## Payroll financial-operational UX

Payroll screens should feel serious and clear, but still operational rather than accounting-heavy. The user should understand totals, risks and status at a glance.

## Review, paid and locked status UX

Status progression should read as internal workflow tracking. The interface must clarify that paid is a local operational mark, not a bank transfer.

## Lock panel UX

Lock controls should be visually cautious, explain the effect clearly and surface blocking warnings before allowing the month to be locked.

## Audit trail UX

Audit entries should be simple, chronological and easy to scan so operational changes can be traced without reading dense logs.

## Settings control center UX

Settings should behave like a local data control center rather than a developer dump. The page should separate overview, health, backup, import, audit and danger actions clearly.

## Backup, import and reset UX

Export actions should feel safe and immediate. Import and reset actions must feel cautious, require explicit confirmation and explain that only browser-local TeamGest data is affected.

## Local-only warning patterns

Any message related to persistence should remind the operator that the system is local-first and that JSON backup does not equal cloud or enterprise-grade storage.

## Professional visual system

Shared page headers, section headers, metric grids, entity cards and detail grids should create a calmer and more premium product rhythm across modules.

## Mobile-first operational patterns

Small screens should prioritize stacked cards, clear action rows, readable navigation and enough bottom spacing so fixed navigation never hides primary actions.

## Responsive grids

Dense summary areas should use reusable grids that collapse predictably rather than one-off per-page layouts.

## Danger and action hierarchy

Destructive controls should be visually separated from routine actions through dedicated surfaces and cautious copy.

## Management flow UX

Worker, client, property and service maintenance now use compact form flows with a draft summary, inline validation and a single local save action.

## Quick Work Entry UX

Quick Work Entry is the primary operational path for registering hours. It should minimize decision load, prefer one confirmed assignment and keep labor context visible while saving.

## Prefilled operational actions

Fast actions may prefill worker, property and date when the URL is safe and explicit. The UI should hide technical parameters and present only clean operational copy.

## Payroll impact messaging

Hour registration should always clarify that the entry feeds the internal monthly closure, the effective hourly rate and the estimated total pay.

## Mobile-first hour registration

Quick Entry should favor stacked cards, large tap targets, full-width actions and no horizontal overflow on small screens.

## Hours-first control UX

The new central operational surface should be `Control de horas`, not a dense service board. It should read as a monthly review workspace built from worker, property and client context.

## Hour review UX

Hour review should isolate pending confirmations, invalid rates, invalid hours and locked-month boundaries. Actions should stay cautious and repository-safe.

## Worker and property hour drilldowns

Worker and property detail pages should expose direct paths into derived hour review so the operator can move from profile context into closure-ready work without hunting through all services.

## Deprioritized UX directions

Pipeline boards, calendar-centric planning and external calendar or Notion integrations are intentionally deprioritized in the current product direction.

## Real StepFlow standard

Important create, edit and review flows should show one active step at a time with a visible progress header, clear previous and next actions, and a contained save or review footer.

## Searchable dropdown standard

Selectors with meaningful option volume should open a capped internal dropdown with search instead of rendering a full page-length option wall.

## No infinite scroll forms

Important forms should avoid endless vertical stacks. Long selectors must scroll inside the dropdown panel, not expand the whole page.

## Mobile-first selector rules

Searchable selectors should remain tappable, readable and capped on small screens. Internal option lists can scroll, but the surrounding page should stay stable.

## Mobile StepFlow standard

On screens under `768px`, StepFlow must switch from any desktop rail treatment to a fully stacked flow. The mobile experience should show a compact progress header, the current step title, full-width form content and full-width footer actions without side columns.

## Compact mobile progress indicator

Mobile StepFlow should communicate progress with `Paso X de Y`, a compact progress bar and the current step label. Large vertical step pills should stay desktop-only so the active form keeps the available viewport width.

## Searchable dropdown mobile behavior

Searchable dropdowns should inherit the input width, stay inside the viewport, cap their own height and scroll internally. Long labels, subtitles and meta values should wrap safely instead of forcing page-level horizontal overflow.

## Quick Entry mobile standard

`Registrar horas` is the primary mobile StepFlow benchmark. Its summary card, current step content and footer actions should stack cleanly without a narrow left column or selector panels that stretch the page.

## Settings control-center standard

Settings should feel like an operational control center, not a developer dump. The page should separate routine configuration, local data safety, audit visibility and system state into distinct sections with clear labels and helper text.

## Settings mobile standard

On mobile, settings should avoid one endless wall of controls. A compact section navigator should switch the visible card group so the operator can focus on one settings area at a time.

## Data safety UX

Backup and import belong in the data-safety section, while destructive reset actions should stay visually separated in a visible danger zone. System copy must keep reminding the operator that persistence is still browser-local.
