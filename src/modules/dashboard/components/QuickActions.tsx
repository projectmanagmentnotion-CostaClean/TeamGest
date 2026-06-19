import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

const actions = [
  { label: 'Registrar horas', to: '/quick-entry' },
  { label: 'Crear servicio', to: '/services/new' },
  { label: 'Ver trabajadores', to: '/workers' },
  { label: 'Ver inmuebles', to: '/properties' },
  { label: 'Ver cierre mensual', to: '/payroll' },
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
