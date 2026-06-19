import { Input } from '../../../../components/ui/Input'

type NewServiceStepScheduleProps = {
  date?: string
  startTime?: string
  endTime?: string
  onChange: (field: 'date' | 'startTime' | 'endTime', value: string) => void
}

export function NewServiceStepSchedule({
  date,
  endTime,
  onChange,
  startTime,
}: NewServiceStepScheduleProps) {
  return (
    <div className="form-grid">
      <Input label="Fecha" type="date" value={date ?? ''} onChange={(event) => onChange('date', event.target.value)} />
      <Input
        label="Hora de inicio"
        type="time"
        value={startTime ?? ''}
        onChange={(event) => onChange('startTime', event.target.value)}
      />
      <Input
        label="Hora de fin"
        type="time"
        value={endTime ?? ''}
        onChange={(event) => onChange('endTime', event.target.value)}
      />
    </div>
  )
}
