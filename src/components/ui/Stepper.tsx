type StepperProps = {
  currentStep: number
  steps: string[]
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <ol className="stepper">
      {steps.map((step, index) => {
        const state =
          index < currentStep ? 'is-complete' : index === currentStep ? 'is-current' : ''

        return (
          <li key={step} className={`stepper__item ${state}`.trim()}>
            <span className="stepper__index">{index + 1}</span>
            <div>
              <strong>{step}</strong>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
