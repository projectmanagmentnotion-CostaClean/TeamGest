import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function TopBar() {
  const currentDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Sprint 1</p>
        <h2>Centro operativo</h2>
      </div>

      <div className="topbar-actions">
        <Badge tone="info">Arquitectura base</Badge>
        <span className="topbar-date">{currentDate}</span>
        <Button size="sm" variant="secondary">
          Nueva vista
        </Button>
      </div>
    </header>
  )
}
