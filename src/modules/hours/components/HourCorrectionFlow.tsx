import { useState } from 'react'
import { FormField } from '../../../components/forms/FormField'
import { FormFlowActions } from '../../../components/forms/FormFlowActions'
import { StepFlowFooter } from '../../../components/forms/StepFlowFooter'
import { StepFlowHeader } from '../../../components/forms/StepFlowHeader'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import { formatMoney } from '../../../utils/money'
import { calculateQuickEntryHoursFromSchedule } from '../../services/services/quickEntryDraft'
import { validateHourCorrectionPatch } from '../services/hourReviewValidation'

type HourCorrectionFlowProps = {
  entry: HourEntry
  onCancel: () => void
  onSave: (patch: {
    startTime?: string
    endTime?: string
    hoursWorked: number
    hourlyRate: number
    extraAmount?: number
    deductions?: number
    reviewNote?: string
  }) => void
}

const steps = ['Horas', 'Tarifa', 'Nota y revision']

export function HourCorrectionFlow({ entry, onCancel, onSave }: HourCorrectionFlowProps) {
  type CorrectionDraft = {
    startTime: string
    endTime: string
    hoursWorked: number
    hourlyRate: number
    extraAmount?: number
    deductions?: number
    reviewNote: string
  }

  const [currentStep, setCurrentStep] = useState(0)
  const [draft, setDraft] = useState<CorrectionDraft>({
    startTime: entry.startTime ?? '',
    endTime: entry.endTime ?? '',
    hoursWorked: entry.hoursWorked,
    hourlyRate: entry.hourlyRate,
    extraAmount: entry.extraAmount,
    deductions: entry.deductions,
    reviewNote: entry.reviewNote ?? '',
  })
  const calculatedHours = calculateQuickEntryHoursFromSchedule(draft.startTime, draft.endTime)
  const totalPay =
    draft.hoursWorked * draft.hourlyRate + (draft.extraAmount ?? 0) - (draft.deductions ?? 0)
  const errors = validateHourCorrectionPatch(draft)
  const canContinue =
    (currentStep === 0 && draft.hoursWorked > 0 && (!draft.startTime || !draft.endTime || (calculatedHours ?? 0) > 0)) ||
    (currentStep === 1 && draft.hourlyRate > 0 && (draft.extraAmount ?? 0) >= 0 && (draft.deductions ?? 0) >= 0)

  return (
    <Card title="Corregir horas" description="Ajusta horario, tarifa y nota de revision sin salir de control de horas.">
      <div className="page-stack">
        <StepFlowHeader
          currentStep={currentStep}
          steps={steps}
          title={steps[currentStep]}
          description={
            currentStep === 0
              ? 'Corrige horario y horas trabajadas.'
              : currentStep === 1
                ? 'Revisa tarifa, extra y deduccion.'
                : 'Añade una nota interna y confirma el resumen.'
          }
        />

        {currentStep === 0 ? (
          <div className="form-grid">
            <FormField type="time" label="Inicio" value={draft.startTime} onChange={(value) => setDraft((current) => ({ ...current, startTime: value }))} />
            <FormField type="time" label="Fin" value={draft.endTime} onChange={(value) => setDraft((current) => ({ ...current, endTime: value }))} />
            <FormField type="number" min={0.25} step={0.25} label="Horas trabajadas" value={draft.hoursWorked} onChange={(value) => setDraft((current) => ({ ...current, hoursWorked: Number(value) || 0 }))} />
            {calculatedHours !== null ? (
              <Button variant="secondary" size="sm" onClick={() => setDraft((current) => ({ ...current, hoursWorked: calculatedHours }))}>
                Usar horario ({calculatedHours.toFixed(2)} h)
              </Button>
            ) : null}
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="form-grid">
            <FormField type="number" min={0.01} step={0.5} label="Tarifa horaria" value={draft.hourlyRate} onChange={(value) => setDraft((current) => ({ ...current, hourlyRate: Number(value) || 0 }))} />
            <FormField type="number" min={0} step={0.5} label="Extra" value={draft.extraAmount ?? ''} onChange={(value) => setDraft((current) => ({ ...current, extraAmount: value ? Number(value) : undefined }))} />
            <FormField type="number" min={0} step={0.5} label="Deduccion" value={draft.deductions ?? ''} onChange={(value) => setDraft((current) => ({ ...current, deductions: value ? Number(value) : undefined }))} />
            <Card title="Total previsto" description="Calculo en tiempo real de la correccion.">
              <strong>{formatMoney(totalPay)}</strong>
            </Card>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="page-stack">
            <FormField
              control="textarea"
              label="Nota de revision"
              value={draft.reviewNote}
              onChange={(value) => setDraft((current) => ({ ...current, reviewNote: value }))}
            />
            <Card title="Resumen final" description="Lo que se guardara en la asignacion revisada.">
              <div className="detail-grid">
                <div>
                  <span className="muted-caption">Horario</span>
                  <strong>{draft.startTime && draft.endTime ? `${draft.startTime} - ${draft.endTime}` : 'Sin horario'}</strong>
                </div>
                <div>
                  <span className="muted-caption">Horas</span>
                  <strong>{draft.hoursWorked.toFixed(2)} h</strong>
                </div>
                <div>
                  <span className="muted-caption">Tarifa</span>
                  <strong>{formatMoney(draft.hourlyRate)}</strong>
                </div>
                <div>
                  <span className="muted-caption">Total</span>
                  <strong>{formatMoney(totalPay)}</strong>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        <StepFlowFooter>
          <FormFlowActions
            secondaryAction={
              currentStep > 0 ? (
                <Button variant="secondary" onClick={() => setCurrentStep((value) => value - 1)}>
                  Atras
                </Button>
              ) : (
                <Button variant="secondary" onClick={onCancel}>
                  Cancelar
                </Button>
              )
            }
            primaryAction={
              currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep((value) => value + 1)} disabled={!canContinue}>
                  Continuar
                </Button>
              ) : (
                <Button onClick={() => onSave(draft)} disabled={errors.length > 0}>
                  Guardar
                </Button>
              )
            }
          />
        </StepFlowFooter>
      </div>
    </Card>
  )
}
