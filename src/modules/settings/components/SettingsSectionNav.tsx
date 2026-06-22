import { Button } from '../../../components/ui/Button'
import type { AppSettingsSectionId } from '../../../domain/settings/appSettings.types'

type SettingsSectionNavProps = {
  activeSection: AppSettingsSectionId
  onChange: (section: AppSettingsSectionId) => void
}

const sections: Array<{ id: AppSettingsSectionId; label: string }> = [
  { id: 'company', label: 'Empresa' },
  { id: 'hours', label: 'Horas y pagos' },
  { id: 'quick-entry', label: 'Registro rapido' },
  { id: 'review', label: 'Revision de horas' },
  { id: 'services', label: 'Servicios' },
  { id: 'display', label: 'Visualizacion' },
  { id: 'data-safety', label: 'Datos y seguridad' },
  { id: 'audit', label: 'Auditoria' },
  { id: 'system', label: 'Sistema' },
]

export function SettingsSectionNav({ activeSection, onChange }: SettingsSectionNavProps) {
  return (
    <div className="settings-nav">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={section.id === activeSection ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onChange(section.id)}
        >
          {section.label}
        </Button>
      ))}
    </div>
  )
}
