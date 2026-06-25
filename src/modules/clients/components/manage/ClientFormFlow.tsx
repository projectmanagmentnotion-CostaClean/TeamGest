import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormField } from '../../../../components/forms/FormField'
import { FormFlowActions } from '../../../../components/forms/FormFlowActions'
import { FormValidationPanel } from '../../../../components/forms/FormValidationPanel'
import { StepFlowFooter } from '../../../../components/forms/StepFlowFooter'
import { StepFlowHeader } from '../../../../components/forms/StepFlowHeader'
import { StepFlowScreen } from '../../../../components/forms/StepFlowScreen'
import { Button } from '../../../../components/ui/Button'
import type { Client } from '../../../../domain/clients/client.types'
import { getRepositories } from '../../../../infrastructure/repositoryFactory'
import { createClientFormDraft } from '../../services/clientFormDraft'
import { validateClientForm } from '../../services/clientFormValidation'
import { ClientFormSummary } from './ClientFormSummary'

type ClientFormFlowProps = {
  client?: Client
}

const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
  { label: 'Archivado', value: 'archived' },
]

const steps = ['Datos comerciales', 'Facturacion', 'Notas']

export function ClientFormFlow({ client }: ClientFormFlowProps) {
  const repositories = getRepositories()
  const navigate = useNavigate()
  const [draft, setDraft] = useState(createClientFormDraft(client))
  const [currentStep, setCurrentStep] = useState(0)
  const errors = validateClientForm(draft)

  const save = () => {
    if (errors.length > 0) {
      return
    }

    if (client) {
      repositories.clients.updateClient(client.id, draft)
      navigate(`/clients/${client.id}`)
      return
    }

    const created = repositories.clients.createClient(draft)
    navigate(`/clients/${created.id}`)
  }

  return (
    <StepFlowScreen
      title={client ? 'Editar cliente' : 'Nuevo cliente'}
      description="Ficha comercial local-first sin dependencias externas."
      sidebar={
        <div className="page-stack">
          <ClientFormSummary draft={draft} />
          <FormValidationPanel errors={errors} />
        </div>
      }
    >
      <div className="page-stack">
        <StepFlowHeader
          currentStep={currentStep}
          steps={steps}
          title={steps[currentStep]}
          description={
            currentStep === 0
              ? 'Datos de contacto y estado comercial para relacionar inmuebles y servicios sin dudas.'
              : currentStep === 1
                ? 'Identidad fiscal y direccion de facturacion para referencia interna.'
                : 'Notas breves y utiles para seguimiento interno.'
          }
        />

        {currentStep === 0 ? (
          <div className="form-grid">
            <FormField label="Nombre" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
            <FormField type="email" label="Email" value={draft.email ?? ''} onChange={(value) => setDraft((current) => ({ ...current, email: value }))} />
            <FormField label="Telefono" value={draft.phone ?? ''} onChange={(value) => setDraft((current) => ({ ...current, phone: value }))} />
            <FormField control="select" label="Estado" value={draft.status} options={statusOptions} onChange={(value) => setDraft((current) => ({ ...current, status: value as Client['status'] }))} />
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="page-stack">
            <div className="form-grid">
              <FormField label="Razon social" value={draft.billingName ?? ''} onChange={(value) => setDraft((current) => ({ ...current, billingName: value }))} />
              <FormField label="CIF / NIF" value={draft.billingTaxId ?? ''} onChange={(value) => setDraft((current) => ({ ...current, billingTaxId: value }))} />
            </div>
            <FormField
              control="textarea"
              label="Direccion fiscal"
              value={draft.billingAddress ?? ''}
              onChange={(value) => setDraft((current) => ({ ...current, billingAddress: value }))}
            />
          </div>
        ) : null}

        {currentStep === 2 ? (
          <FormField
            control="textarea"
            label="Notas internas"
            value={draft.notes ?? ''}
            onChange={(value) => setDraft((current) => ({ ...current, notes: value }))}
          />
        ) : null}

        <StepFlowFooter>
          <FormFlowActions
            secondaryAction={
              currentStep > 0 ? (
                <Button variant="secondary" onClick={() => setCurrentStep((value) => value - 1)}>
                  Atras
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => navigate(client ? `/clients/${client.id}` : '/clients')}>
                  Cancelar
                </Button>
              )
            }
            primaryAction={
              currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep((value) => value + 1)} disabled={!draft.name.trim()}>
                  Continuar
                </Button>
              ) : (
                <Button onClick={save} disabled={errors.length > 0}>
                  {client ? 'Guardar cambios' : 'Guardar'}
                </Button>
              )
            }
          />
        </StepFlowFooter>
      </div>
    </StepFlowScreen>
  )
}
