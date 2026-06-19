import { StatusPill } from '../ui/StatusPill'

export function TopBar() {
  const currentDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">CostaFlow Ops</p>
        <h2>Centro operativo</h2>
      </div>

      <div className="topbar-actions">
        <StatusPill tone="success">Operacion activa</StatusPill>
        <StatusPill tone="info">Modo local</StatusPill>
        <span className="topbar-date">{currentDate}</span>
      </div>
    </header>
  )
}
