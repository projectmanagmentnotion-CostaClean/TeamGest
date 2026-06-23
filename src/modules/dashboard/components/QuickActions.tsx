import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

const actions = [
  { label: 'Registrar horas', to: '/quick-entry' },
  { label: 'Control de horas', to: '/hours' },
  { label: 'Abrir cierre mensual', to: '/payroll' },
  { label: 'Crear servicio', to: '/services/new' },
  { label: 'Ver trabajadores', to: '/workers' },
  { label: 'Ver inmuebles', to: '/properties' },
]

export function QuickActions() {
  return (
    <Card title="Acciones rapidas" description="Accesos directos para operar sin friccion.">
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
