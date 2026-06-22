import { NavLink } from 'react-router-dom'

const mobileItems = [
  { label: 'Inicio', to: '/dashboard' },
  { label: 'Horas', to: '/hours' },
  { label: 'Servicios', to: '/services' },
  { label: 'Cierres', to: '/payroll' },
  { label: 'Ajustes', to: '/settings' },
]

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile">
      {mobileItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `mobile-nav__link${isActive ? ' is-active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
