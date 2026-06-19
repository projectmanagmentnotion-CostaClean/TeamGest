import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

const actions = [
  { label: 'Crear servicio', to: '/services/new' },
  { label: 'Ver trabajadores', to: '/workers' },
  { label: 'Ver inmuebles', to: '/properties' },
  { label: 'Ver cierre mensual', to: '/payroll' },
]

export function QuickActions() {
  return (
    <Card title="Acciones rápidas" description="Accesos directos para moverse por la operación sin fricción.">
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
