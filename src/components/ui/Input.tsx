import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
}

export function Input({ className = '', hint, id, label, ...props }: InputProps) {
  const classes = ['field-input', className].filter(Boolean).join(' ')

  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <input {...props} className={classes} id={id} />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  )
}
