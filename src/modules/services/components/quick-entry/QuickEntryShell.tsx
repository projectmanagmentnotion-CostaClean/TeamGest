import type { ReactNode } from 'react'
import { Card } from '../../../../components/ui/Card'
import { Stepper } from '../../../../components/ui/Stepper'

type QuickEntryShellProps = {
  children: ReactNode
}

const steps = [
  'Trabajador',
  'Inmueble',
  'Horario',
  'Pago',
  'Revision',
]

export function QuickEntryShell({ children }: QuickEntryShellProps) {
  return (
    <Card title="Registrar horas" description="Entrada prioritaria para registrar horas confirmadas.">
      <Stepper currentStep={4} steps={steps} />
      {children}
    </Card>
  )
}
