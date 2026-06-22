import { formatEntityStatusLabel, getEntityStatusTone } from '../../utils/labels'
import { SearchableSelect, type SearchableSelectOption } from './SearchableSelect'

export type SearchableEntityOption = {
  id: string
  label: string
  subtitle?: string
  status?: 'active' | 'inactive' | 'archived'
  meta?: string
}

type SearchableEntitySelectProps = {
  label: string
  placeholder: string
  entityLabel: 'trabajador' | 'cliente' | 'inmueble' | 'servicio'
  value: string
  options: SearchableEntityOption[]
  allowClear?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}

export function SearchableEntitySelect({
  allowClear,
  disabled,
  entityLabel,
  label,
  onChange,
  options,
  placeholder,
  value,
}: SearchableEntitySelectProps) {
  const mappedOptions: SearchableSelectOption[] = options.map((option) => ({
    value: option.id,
    label: option.label,
    subtitle: option.subtitle,
    meta: option.meta,
    statusLabel: option.status ? formatEntityStatusLabel(option.status) : undefined,
    statusTone: option.status ? getEntityStatusTone(option.status) : undefined,
  }))

  return (
    <SearchableSelect
      allowClear={allowClear}
      disabled={disabled}
      label={label}
      value={value}
      options={mappedOptions}
      placeholder={placeholder}
      searchPlaceholder={`Buscar ${entityLabel}`}
      emptyMessage="No se encontraron resultados"
      onChange={onChange}
    />
  )
}
