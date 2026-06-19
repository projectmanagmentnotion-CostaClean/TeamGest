import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import {
  resetAllTeamGestLocalData,
  resetLocalServices,
  resetPayrollLocalState,
} from '../services/dataReset'
import { SettingsSection } from './SettingsSection'

type ResetDemoDataPanelProps = {
  onDataChanged: () => void
}

export function ResetDemoDataPanel({ onDataChanged }: ResetDemoDataPanelProps) {
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const runAction = (action: () => string, nextMessage: string) => {
    action()
    setMessage(nextMessage)
    onDataChanged()
  }

  return (
    <SettingsSection
      className="danger-zone"
      title="Reset de datos locales"
      description="Elimina solo datos TeamGest del navegador. No afecta semillas ni almacenamiento ajeno."
    >
      <div className="stack-list">
        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Reset servicios locales</h4>
              <p>Elimina únicamente los servicios creados en este navegador.</p>
            </div>
            <Button variant="secondary" onClick={() => runAction(resetLocalServices, 'Servicios locales reiniciados.')}>
              Reset servicios
            </Button>
          </div>
        </div>

        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Reset estado de nómina</h4>
              <p>Elimina estados, bloqueos y auditoría mensual de payroll.</p>
            </div>
            <Button variant="secondary" onClick={() => runAction(resetPayrollLocalState, 'Estado local de cierres reiniciado.')}>
              Reset payroll
            </Button>
          </div>
        </div>

        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Reset completo del namespace TeamGest</h4>
              <p>Elimina servicios locales, cierres, auditoría, historial de backup y ajustes locales.</p>
            </div>
            <Button
              onClick={() => runAction(resetAllTeamGestLocalData, 'Todo el espacio local TeamGest fue reiniciado.')}
              disabled={confirmation !== 'RESET'}
            >
              Reset total
            </Button>
          </div>
          <Input
            label="Confirmación obligatoria"
            hint="Escribe RESET para habilitar el borrado completo."
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </div>
      </div>

      {message ? (
        <WarningBanner title="Acción ejecutada" tone="warning">
          {message}
        </WarningBanner>
      ) : null}
    </SettingsSection>
  )
}
