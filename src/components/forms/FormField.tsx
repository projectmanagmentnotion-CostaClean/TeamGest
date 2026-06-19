import type { ReactNode } from 'react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

type BaseFieldProps = {
  label: string
  hint?: string
  error?: string
}

type InputFieldProps = BaseFieldProps & {
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time'
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  min?: number
  step?: number
}

type SelectFieldProps = BaseFieldProps & {
  control: 'select'
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
}

type TextAreaFieldProps = BaseFieldProps & {
  control: 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextAreaFieldProps

function ErrorText({ children }: { children?: ReactNode }) {
  return children ? <span className="warning-text">{children}</span> : null
}

export function FormField(props: FormFieldProps) {
  if ('control' in props && props.control === 'select') {
    return (
      <div className="field">
        <Select
          label={props.label}
          hint={props.hint}
          value={props.value}
          options={props.options}
          onChange={(event) => props.onChange(event.target.value)}
        />
        <ErrorText>{props.error}</ErrorText>
      </div>
    )
  }

  if ('control' in props && props.control === 'textarea') {
    return (
      <label className="field">
        <span className="field__label">{props.label}</span>
        <textarea
          className="field-input field-textarea"
          placeholder={props.placeholder}
          rows={props.rows ?? 5}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
        />
        {props.hint ? <span className="field__hint">{props.hint}</span> : null}
        <ErrorText>{props.error}</ErrorText>
      </label>
    )
  }

  return (
    <div className="field">
      <Input
        type={props.type ?? 'text'}
        label={props.label}
        hint={props.hint}
        placeholder={props.placeholder}
        min={props.min}
        step={props.step}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <ErrorText>{props.error}</ErrorText>
    </div>
  )
}
