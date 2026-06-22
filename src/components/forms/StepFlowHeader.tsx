import { Stepper } from '../ui/Stepper'

type StepFlowHeaderProps = {
  title: string
  description: string
  steps: string[]
  currentStep: number
}

export function StepFlowHeader({ currentStep, description, steps, title }: StepFlowHeaderProps) {
  const totalSteps = steps.length
  const progress = `${Math.round(((currentStep + 1) / totalSteps) * 100)}%`

  return (
    <div className="stepflow-screen__header">
      <div className="stepflow-progress" aria-label={`Paso ${currentStep + 1} de ${totalSteps}`}>
        <div className="stepflow-progress__meta">
          <span className="eyebrow">Paso {currentStep + 1} de {totalSteps}</span>
          <strong>{title}</strong>
        </div>
        <div className="stepflow-progress__bar" aria-hidden="true">
          <span style={{ width: progress }} />
        </div>
      </div>
      <div className="stepflow-screen__stepper">
        <Stepper currentStep={currentStep} steps={steps} />
      </div>
      <div className="section-header__content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}
