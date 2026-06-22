import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Inicio', to: '/dashboard' },
  { label: 'Control de horas', to: '/hours' },
  { label: 'Servicios', to: '/services' },
  { label: 'Trabajadores', to: '/workers' },
  { label: 'Inmuebles', to: '/properties' },
  { label: 'Clientes', to: '/clients' },
  { label: 'Cierres', to: '/payroll' },
  { label: 'Ajustes', to: '/settings' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-kicker">CostaFlow Ops</span>
        <h1>Control interno</h1>
        <p>Horas trabajadas, revision operativa y cierres mensuales en local-first.</p>
      </div>

      <nav className="nav-list" aria-label="Principal">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
