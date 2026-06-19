import type { SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  hint?: string
  options: Array<{ label: string; value: string }>
}

export function Select({ className = '', hint, label, options, ...props }: SelectProps) {
  const classes = ['field-input', className].filter(Boolean).join(' ')

  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <select {...props} className={classes}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  )
}
