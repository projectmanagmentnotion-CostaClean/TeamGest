import { useId, useMemo, useState, type KeyboardEvent } from 'react'

export type SearchableSelectOption = {
  value: string
  label: string
  subtitle?: string
  meta?: string
  disabled?: boolean
  statusLabel?: string
  statusTone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'blocked'
}

type SearchableSelectProps = {
  label: string
  value: string
  options: SearchableSelectOption[]
  placeholder: string
  emptyMessage?: string
  searchPlaceholder?: string
  disabled?: boolean
  allowClear?: boolean
  onChange: (value: string) => void
}

export function SearchableSelect({
  allowClear = false,
  disabled = false,
  emptyMessage = 'No se encontraron resultados',
  label,
  onChange,
  options,
  placeholder,
  searchPlaceholder = 'Buscar',
  value,
}: SearchableSelectProps) {
  const listId = useId()
  const selectedOption = options.find((option) => option.value === value)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return options
    }

    return options.filter((option) =>
      [option.label, option.subtitle, option.meta]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    )
  }, [options, query])

  const handleSelect = (nextValue: string) => {
    onChange(nextValue)
    setQuery('')
    setHighlightedIndex(0)
    setIsOpen(false)
  }

  const displayedValue = isOpen ? query : selectedOption?.label ?? ''

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((current) => Math.min(current + 1, Math.max(filteredOptions.length - 1, 0)))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((current) => Math.max(current - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const exactMatch = filteredOptions.find(
        (option) => option.label.toLowerCase() === query.trim().toLowerCase(),
      )
      const selected = exactMatch ?? filteredOptions[highlightedIndex]
      if (selected && !selected.disabled) {
        handleSelect(selected.value)
      }
    }
  }

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <div className={`searchable-select${disabled ? ' is-disabled' : ''}`}>
        <div className="searchable-select__input-row">
          <input
            className="field-input searchable-select__input"
            value={displayedValue}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => {
              setQuery('')
              setIsOpen(true)
            }}
            onBlur={() => {
              window.setTimeout(() => {
                setIsOpen(false)
                setHighlightedIndex(0)
              }, 120)
            }}
            onChange={(event) => {
              setQuery(event.target.value)
              setHighlightedIndex(0)
              setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-controls={listId}
          />
          {allowClear && value ? (
            <button
              className="button button--ghost button--sm"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect('')}
            >
              Limpiar
            </button>
          ) : null}
        </div>

        {isOpen ? (
          <div className="searchable-select__panel" id={listId} role="listbox">
            <div className="searchable-select__panel-header">{searchPlaceholder}</div>
            {filteredOptions.length === 0 ? (
              <div className="searchable-select__empty">{emptyMessage}</div>
            ) : (
              <div className="searchable-select__list">
                {filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    className={`searchable-select__option${index === highlightedIndex ? ' is-highlighted' : ''}${option.value === value ? ' is-selected' : ''}`}
                    type="button"
                    disabled={option.disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(option.value)}
                  >
                    <div>
                      <strong>{option.label}</strong>
                      {option.subtitle ? <p>{option.subtitle}</p> : null}
                    </div>
                    {option.meta || option.statusLabel ? (
                      <div className="searchable-select__meta">
                        {option.meta ? <span className="muted-caption">{option.meta}</span> : null}
                        {option.statusLabel ? (
                          <span className={`badge badge--${option.statusTone ?? 'neutral'}`}>
                            {option.statusLabel}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </label>
  )
}
