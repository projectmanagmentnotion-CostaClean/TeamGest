# Final Visual QA Audit

Sprint 32 starts with a code-level audit of the current local-first app structure. This is not browser visual QA. Findings below come from route review, shared UI inspection and module-level code inspection.

## Routes audited

- `/dashboard`
- `/quick-entry`
- `/hours`
- `/hours/review`
- `/hours/workers/:workerId`
- `/hours/properties/:propertyId`
- `/workers`
- `/workers/new`
- `/workers/:id`
- `/workers/:id/edit`
- `/clients`
- `/clients/new`
- `/clients/:id`
- `/clients/:id/edit`
- `/properties`
- `/properties/new`
- `/properties/:id`
- `/properties/:id/edit`
- `/services`
- `/services/new`
- `/services/:id`
- `/services/:id/edit`
- `/payroll`
- `/payroll/:month`
- `/payroll/:month/workers/:workerId`
- `/settings`

## Main findings

### Visual hierarchy issues

- Dashboard still spreads attention too evenly across quick actions, today services and recent activity instead of clearly reinforcing the hours-first narrative.
- Dashboard quick actions still include lower-priority paths such as `Crear servicio` with the same emphasis as the core daily routes.
- `/hours` starts with a technical derived-model warning before the main operational scan, which weakens the route's first impression.
- Payroll warning cards still use `payroll` wording in user-facing titles instead of more internal-operational Spanish.

### Mobile layout risks

- Shared responsive CSS is already strong, but several action rows still rely on many side-by-side buttons and long labels.
- Success and review surfaces can become visually long on mobile because all actions or detail blocks are shown at the same level.
- Some warning and empty-state cards still rely on long paragraphs rather than short next-step guidance.

### StepFlow inconsistencies

- StepFlow remains active in the main create/edit flows, but not every flow uses equally clear review-step copy.
- Client and property flows are structurally step-based, but their helper text is thinner and less operationally explicit than worker, service or quick-entry flows.
- Quick Entry review step is minimal and leaves the final confirmation feeling lighter than the rest of the flow.

### Warning and copy issues

- Several user-facing warnings remain technically correct but could be shorter and more action-oriented.
- `/hours` uses `Modelo derivado`, which is accurate but too technical for the main operational route.
- Hour review action disable reasons are shown as one generic caption rather than tied to the most relevant next action.
- Success copy in Quick Entry still says `Impacto en payroll`, which is less aligned with the app's preferred closure language.

### Excessive scroll and dense areas

- The app does not rely on infinite scrolling, but some list pages and review groups can still feel dense when all sections are rendered in one long sequence.
- `/hours/review` can become visually heavy because all groups use the same treatment and there is no short explanatory grouping banner at the top.
- Dashboard quick-actions and settings data-safety area can accumulate multiple cards with similar visual weight.

### Confusing actions

- Dashboard mixes `Registrar horas`, `Control de horas`, `Abrir cierre mensual`, `Crear servicio`, `Ver trabajadores` and `Ver inmuebles` with similar hierarchy.
- Payroll overview CTA `Abrir cierre del mes` is clear, but the page could better emphasize who is ready vs who needs review before that action.
- Review actions are functional, but labels such as `Incidencia` and `Excluir` could use clearer contextual help.

### Empty states

- Most core routes already use empty states correctly.
- Some empty states could be more operational by pointing to the next best action instead of only describing absence.

### Spanish and user-facing labels

- The app is mostly in Spanish and free of `Quick Work Entry`, but some labels remain more technical than needed:
  - `Modelo derivado`
  - `Alertas de payroll`
  - `Impacto en payroll`
- Helper text is uneven across modules. Worker and service flows are stronger than client and property flows.

### Pages that feel too technical

- `/hours` currently exposes implementation framing too early.
- Settings remains safe and segmented, but the data-safety section can still feel more technical than routine.
- Warning panels sometimes describe state without immediately telling the operator what to do next.

### Hours-first support gaps

- Dashboard already points to hours and closures, but should rank them more clearly.
- Quick Entry remains the main operational flow, but the review step and success copy can better reinforce the closure narrative.
- Hours Control should foreground the current month, pending review and closure impact more clearly than the derived-model explanation.

## Safe polish targets approved by this audit

- Re-prioritize dashboard actions and copy around hours, review and monthly closure.
- Make `/hours` less technical and more operational in its opening guidance.
- Improve warning titles and next-step wording across hours, payroll and settings.
- Strengthen review-step and success-step copy in Quick Entry.
- Tighten helper text in CRUD StepFlow flows without changing architecture.
- Keep layouts compact and grouped without adding new features, new persistence or broad refactors.
