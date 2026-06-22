import { Stepper } from '../ui/Stepper'

type StepFlowHeaderProps = {
  title: string
  description: string
  steps: string[]
  currentStep: number
}

export function StepFlowHeader({ currentStep, description, steps, title }: StepFlowHeaderProps) {
  return (
    <div className="stepflow-screen__header">
      <Stepper currentStep={currentStep} steps={steps} />
      <div className="section-header__content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}
