import { useState, type ChangeEvent } from 'react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { importTeamGestBackupPayload, previewTeamGestBackupImport } from '../services/dataImport'
import { SettingsSection } from './SettingsSection'

type ImportDataPanelProps = {
  onDataChanged: () => void
}

export function ImportDataPanel({ onDataChanged }: ImportDataPanelProps) {
  const [textValue, setTextValue] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [preview, setPreview] = useState<Awaited<ReturnType<typeof previewTeamGestBackupImport>> | null>(null)

  const handlePreviewFromText = async () => {
    try {
      const result = await previewTeamGestBackupImport(textValue)
      setPreview(result)
      setError(null)
      setSuccess(null)
    } catch (previewError) {
      setPreview(null)
      setError(previewError instanceof Error ? previewError.message : 'No se pudo validar el JSON pegado.')
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const result = await previewTeamGestBackupImport(file)
      setPreview(result)
      setTextValue(await file.text())
      setError(null)
      setSuccess(null)
    } catch (previewError) {
      setPreview(null)
      setError(previewError instanceof Error ? previewError.message : 'No se pudo leer el archivo seleccionado.')
    }
  }

  const handleImport = () => {
    if (!preview || !confirmed) {
      return
    }

    const result = importTeamGestBackupPayload(preview.payload)
    setSuccess(`Importacion completada. Meses restaurados: ${result.summary.payrollMonthsCount}.`)
    setError(null)
    setPreview(null)
    setConfirmed(false)
    onDataChanged()
  }

  return (
    <SettingsSection
      title="Importar copia"
      description="Valida primero una copia compatible y reemplaza solo namespaces reconocidos."
      action={<Badge tone="warning">Reemplaza local</Badge>}
    >
      <label className="field">
        <span className="field__label">Pega aqui el JSON de la copia</span>
        <textarea
          className="field-input field-textarea"
          rows={8}
          value={textValue}
          onChange={(event) => setTextValue(event.target.value)}
          placeholder="Pega el contenido del backup TeamGest en formato JSON"
        />
      </label>

      <label className="field">
        <span className="field__label">O selecciona un archivo JSON</span>
        <input
          className="field-input"
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
        />
      </label>

      <div className="quick-actions">
        <Button variant="secondary" onClick={() => void handlePreviewFromText()} disabled={!textValue.trim()}>
          Validar copia
        </Button>
        <Button onClick={handleImport} disabled={!preview || !confirmed}>
          Importar copia compatible
        </Button>
      </div>

      {preview ? (
        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Resumen detectado</h4>
              <p>{preview.summary.appName} - esquema {preview.summary.schemaVersion}</p>
            </div>
            <Badge tone="info">Listo para importar</Badge>
          </div>
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Servicios locales</span>
              <strong>{preview.summary.createdServicesCount}</strong>
            </div>
            <div>
              <span className="muted-caption">Meses de nomina</span>
              <strong>{preview.summary.payrollMonthsCount}</strong>
            </div>
            <div>
              <span className="muted-caption">Auditoria de cierres</span>
              <strong>{preview.summary.payrollAuditCount}</strong>
            </div>
            <div>
              <span className="muted-caption">Auditoria app</span>
              <strong>{preview.summary.appAuditCount}</strong>
            </div>
          </div>
        </div>
      ) : null}

      <label className="checkbox-row">
        <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
        <span>Entiendo que esto reemplazara datos locales compatibles.</span>
      </label>

      {error ? (
        <WarningBanner title="Importacion no valida" tone="danger">
          {error}
        </WarningBanner>
      ) : null}

      {success ? (
        <WarningBanner title="Importacion completada" tone="success">
          {success}
        </WarningBanner>
      ) : null}
    </SettingsSection>
  )
}
