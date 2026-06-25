import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

const actions = [
  { label: 'Registrar horas', to: '/quick-entry' },
  { label: 'Revisar horas pendientes', to: '/hours/review' },
  { label: 'Control de horas', to: '/hours' },
  { label: 'Ver cierre mensual', to: '/payroll' },
  { label: 'Trabajadores', to: '/workers' },
  { label: 'Ajustes y seguridad', to: '/settings' },
]

export function QuickActions() {
  return (
    <Card title="Siguientes acciones" description="Atajos para avanzar en el flujo diario sin cambiar de contexto.">
      <div className="quick-actions">
        {actions.map((action) => (
          <Link key={action.to} className="button button--secondary" to={action.to}>
            {action.label}
          </Link>
        ))}
      </div>
    </Card>
  )
}
