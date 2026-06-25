import type { HourEntryFilters as HourEntryFiltersValue } from '../../../domain/hours/hourEntry.types'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

type FilterOption = {
  label: string
  value: string
}

type HourEntryFiltersProps = {
  filters: HourEntryFiltersValue
  workers: FilterOption[]
  properties: FilterOption[]
  clients: FilterOption[]
  onChange: (filters: HourEntryFiltersValue) => void
}

export function HourEntryFilters({
  clients,
  filters,
  onChange,
  properties,
  workers,
}: HourEntryFiltersProps) {
  return (
    <Card title="Filtros del control" description="Reduce la vista por mes, responsable, inmueble o estado sin perder el foco del cierre.">
      <div className="hours-filter-grid">
        <Input
          label="Mes"
          type="month"
          value={filters.month}
          onChange={(event) => onChange({ ...filters, month: event.target.value })}
        />
        <Select
          label="Trabajador"
          value={filters.workerId}
          onChange={(event) => onChange({ ...filters, workerId: event.target.value })}
          options={[{ label: 'Todos', value: '' }, ...workers]}
        />
        <Select
          label="Inmueble"
          value={filters.propertyId}
          onChange={(event) => onChange({ ...filters, propertyId: event.target.value })}
          options={[{ label: 'Todos', value: '' }, ...properties]}
        />
        <Select
          label="Cliente"
          value={filters.clientId}
          onChange={(event) => onChange({ ...filters, clientId: event.target.value })}
          options={[{ label: 'Todos', value: '' }, ...clients]}
        />
        <Select
          label="Estado"
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as HourEntryFiltersValue['status'] })}
          options={[
            { label: 'Todos', value: 'all' },
            { label: 'Borrador', value: 'draft' },
            { label: 'Pendiente de revisar', value: 'pending_review' },
            { label: 'Confirmada', value: 'confirmed' },
            { label: 'Incidencia', value: 'issue' },
            { label: 'Excluida', value: 'excluded' },
            { label: 'Pagada', value: 'paid' },
            { label: 'Bloqueada', value: 'locked' },
          ]}
        />
        <Select
          label="Confirmacion"
          value={filters.confirmation}
          onChange={(event) =>
            onChange({ ...filters, confirmation: event.target.value as HourEntryFiltersValue['confirmation'] })
          }
          options={[
            { label: 'Todas', value: 'all' },
            { label: 'Confirmadas', value: 'confirmed' },
            { label: 'Pendientes', value: 'pending' },
          ]}
        />
      </div>
    </Card>
  )
}
