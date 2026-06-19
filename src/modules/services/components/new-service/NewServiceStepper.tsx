import { Stepper } from '../../../../components/ui/Stepper'

type NewServiceStepperProps = {
  currentStep: number
}

const steps = [
  'Cliente',
  'Inmueble',
  'Tipo',
  'Horario',
  'Equipo',
  'Asignaciones',
  'Revisión',
]

export function NewServiceStepper({ currentStep }: NewServiceStepperProps) {
  return <Stepper currentStep={currentStep} steps={steps} />
}
