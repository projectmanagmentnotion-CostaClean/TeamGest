import { Input } from '../../../../components/ui/Input'
import type { Worker } from '../../../../domain/workers/worker.types'
import type { NewServiceDraftAssignment } from '../../services/newServiceDraft'
import { calculateAssignmentPay } from '../../services/serviceCalculations'
import { formatMoney } from '../../../../utils/money'

type NewServiceStepAssignmentsProps = {
  assignments: NewServiceDraftAssignment[]
  workers: Worker[]
  onChange: (
    workerId: string,
    patch: Partial<NewServiceDraftAssignment>,
  ) => void
  totalLaborCost: number
}

export function NewServiceStepAssignments({
  assignments,
  onChange,
  totalLaborCost,
  workers,
}: NewServiceStepAssignmentsProps) {
  return (
    <div className="stack-list">
      {assignments.map((assignment) => {
        const worker = workers.find((item) => item.id === assignment.workerId)

        return (
          <article key={assignment.workerId} className="row-card">
            <div className="row-card__main">
              <div>
                <h4>{worker?.name ?? 'Trabajador no disponible'}</h4>
                <p>{worker?.defaultHourlyRate ? `Tarifa base ${formatMoney(worker.defaultHourlyRate)}` : 'Tarifa base pendiente'}</p>
              </div>
              <strong>{formatMoney(calculateAssignmentPay(assignment))}</strong>
            </div>
            <div className="detail-grid detail-grid--four">
              <Input
                label="Horas"
                type="number"
                min="0"
                step="0.5"
                value={String(assignment.hoursWorked)}
                onChange={(event) => onChange(assignment.workerId, { hoursWorked: Number(event.target.value) })}
              />
              <Input
                label="Tarifa"
                type="number"
                min="0"
                step="0.5"
                value={assignment.hourlyRate !== undefined ? String(assignment.hourlyRate) : ''}
                onChange={(event) => onChange(assignment.workerId, { hourlyRate: Number(event.target.value) })}
              />
              <Input
                label="Extras"
                type="number"
                min="0"
                step="0.5"
                value={String(assignment.extraAmount ?? 0)}
                onChange={(event) => onChange(assignment.workerId, { extraAmount: Number(event.target.value) })}
              />
              <Input
                label="Deducciones"
                type="number"
                min="0"
                step="0.5"
                value={String(assignment.deductions ?? 0)}
                onChange={(event) => onChange(assignment.workerId, { deductions: Number(event.target.value) })}
              />
            </div>
            <label className="checkbox-row">
              <input
                checked={assignment.confirmed}
                type="checkbox"
                onChange={(event) => onChange(assignment.workerId, { confirmed: event.target.checked })}
              />
              <span>Asignación confirmada</span>
            </label>
          </article>
        )
      })}
      <div className="summary-strip">
        <span>Coste laboral total</span>
        <strong>{formatMoney(totalLaborCost)}</strong>
      </div>
    </div>
  )
}
