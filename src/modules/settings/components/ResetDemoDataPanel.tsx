import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { ConfirmDangerBox } from '../../../components/ui/ConfirmDangerBox'
import { Input } from '../../../components/ui/Input'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getAppSettings } from '../services/appSettingsService'
import {
  resetAllTeamGestLocalData,
  resetEntityManagementLocalState,
  resetLocalServices,
  resetPayrollLocalState,
} from '../services/dataReset'

type ResetDemoDataPanelProps = {
  onDataChanged: () => void
}

export function ResetDemoDataPanel({ onDataChanged }: ResetDemoDataPanelProps) {
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const requireTypedConfirmation = getAppSettings().dataSafetySettings.requireTypedConfirmation

  const runAction = (action: () => string, nextMessage: string) => {
    action()
    setMessage(nextMessage)
    onDataChanged()
  }

  return (
    <ConfirmDangerBox
      title="Reset de datos locales"
      description="Elimina solo datos TeamGest del navegador. No afecta semillas ni almacenamiento ajeno."
    >
      <div className="stack-list">
        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Reset servicios locales</h4>
              <p>Elimina unicamente los servicios creados o modificados en este navegador.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => runAction(resetLocalServices, 'Servicios locales reiniciados.')}
            >
              Reset servicios
            </Button>
          </div>
        </div>

        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Reset gestion local</h4>
              <p>Elimina altas, overrides y archivados locales de trabajadores, clientes e inmuebles.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                runAction(
                  resetEntityManagementLocalState,
                  'Gestion local de trabajadores, clientes e inmuebles reiniciada.',
                )
              }
            >
              Reset gestion
            </Button>
          </div>
        </div>

        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Reset estado de cierres</h4>
              <p>Elimina estados, bloqueos y auditoria mensual del cierre interno.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                runAction(resetPayrollLocalState, 'Estado local de cierres reiniciado.')
              }
            >
              Reset cierres
            </Button>
          </div>
        </div>

        <div className="row-card">
          <div className="row-card__main">
            <div>
              <h4>Reset completo del namespace TeamGest</h4>
              <p>Elimina servicios locales, CRUD local, cierres, auditoria, historial de backup y ajustes locales.</p>
            </div>
            <Button
              onClick={() =>
                runAction(
                  resetAllTeamGestLocalData,
                  'Todo el espacio local TeamGest fue reiniciado.',
                )
              }
              disabled={requireTypedConfirmation && confirmation !== 'RESET'}
            >
              Reset total
            </Button>
          </div>
          <Input
            label="Confirmacion obligatoria"
            hint={
              requireTypedConfirmation
                ? 'Escribe RESET para habilitar el borrado completo.'
                : 'La confirmacion escrita esta desactivada en ajustes.'
            }
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </div>
      </div>

      {message ? (
        <WarningBanner title="Accion ejecutada" tone="warning">
          {message}
        </WarningBanner>
      ) : null}
    </ConfirmDangerBox>
  )
}
