type SettingsToggleFieldProps = {
  checked: boolean
  label: string
  hint: string
  onChange: (checked: boolean) => void
}

export function SettingsToggleField({
  checked,
  hint,
  label,
  onChange,
}: SettingsToggleFieldProps) {
  return (
    <label className="checkbox-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <strong>{label}</strong>
        <span className="field__hint">{hint}</span>
      </span>
    </label>
  )
}
