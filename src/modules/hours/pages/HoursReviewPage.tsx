import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MetricGrid } from '../../../components/ui/MetricGrid'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatCard } from '../../../components/ui/StatCard'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMoney } from '../../../utils/money'
import { HourCorrectionFlow } from '../components/HourCorrectionFlow'
import { HourEntryCard } from '../components/HourEntryCard'
import { HourExcludeDialog } from '../components/HourExcludeDialog'
import { HourIncidentDialog } from '../components/HourIncidentDialog'
import { HourReviewActions } from '../components/HourReviewActions'
import { HoursEmptyState } from '../components/HoursEmptyState'
import { buildHourEntries } from '../services/hourEntryBuilder'
import {
  canConfirmHourEntry,
  canCorrectHourEntry,
  canExcludeHourEntry,
  canMarkIncident,
  canRestoreHourEntry,
  confirmHourEntry,
  correctHourEntry,
  excludeHourEntry,
  markHourEntryIncident,
  restoreHourEntry,
} from '../services/hourReviewActions'

type ActiveReviewMode = 'correct' | 'incident' | 'exclude' | null

function buildMonthStateMap(
  months: string[],
  getPayrollMonthState: ReturnType<typeof getRepositories>['payroll']['getPayrollMonthState'],
) {
  return Object.fromEntries(months.map((month) => [month, getPayrollMonthState(month)]))
}

export function HoursReviewPage() {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState<string | null>(null)
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<ActiveReviewMode>(null)
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const months = [...new Set(services.map((service) => service.date.slice(0, 7)))]
  const payrollStates = buildMonthStateMap(months, repositories.payroll.getPayrollMonthState)
  const entries = buildHourEntries(services, workers, clients, properties, payrollStates)
  const selectedMonth = searchParams.get('month')
  const selectedWorkerId = searchParams.get('workerId')
  const scopedEntries = entries.filter(
    (entry) =>
      (!selectedMonth || entry.payrollMonth === selectedMonth) &&
      (!selectedWorkerId || entry.workerId === selectedWorkerId),
  )
  const pendingEntries = scopedEntries.filter((entry) => entry.hourStatus === 'pending_review')
  const issueEntries = scopedEntries.filter((entry) => entry.hourStatus === 'issue')
  const excludedEntries = scopedEntries.filter((entry) => entry.hourStatus === 'excluded')
  const lockedEntries = scopedEntries.filter((entry) => entry.hourStatus === 'locked')
  const activeEntry = activeEntryId ? scopedEntries.find((entry) => entry.id === activeEntryId) : null
  const totalPendingHours = pendingEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0)
  const totalPendingPay = pendingEntries.reduce((sum, entry) => sum + entry.totalPay, 0)

  const runAction = (result: { success: boolean; error: string | null }) => {
    setMessage(result.error ?? 'Cambio aplicado correctamente.')
    if (result.success) {
      setActiveEntryId(null)
      setActiveMode(null)
    }
  }

  const renderGroup = (title: string, items: typeof entries) => {
    if (items.length === 0) {
      return null
    }

    return (
      <section className="page-stack">
        <div className="section-header__content">
          <h3>{title}</h3>
          <p>{items.length} entradas en esta seccion.</p>
        </div>
        <div className="stack-list">
          {items.map((entry) => {
            const payrollState = payrollStates[entry.payrollMonth]
            return (
              <HourEntryCard
                key={entry.id}
                entry={entry}
                action={
                  <HourReviewActions
                    entry={entry}
                    confirmPolicy={canConfirmHourEntry(entry, payrollState)}
                    correctPolicy={canCorrectHourEntry(entry, payrollState)}
                    incidentPolicy={canMarkIncident(entry, payrollState)}
                    excludePolicy={canExcludeHourEntry(entry, payrollState)}
                    restorePolicy={canRestoreHourEntry(entry, payrollState)}
                    onConfirm={() => runAction(confirmHourEntry(entry.id))}
                    onCorrect={() => {
                      setActiveEntryId(entry.id)
                      setActiveMode('correct')
                    }}
                    onIncident={() => {
                      setActiveEntryId(entry.id)
                      setActiveMode('incident')
                    }}
                    onExclude={() => {
                      setActiveEntryId(entry.id)
                      setActiveMode('exclude')
                    }}
                    onRestore={() => runAction(restoreHourEntry(entry.id))}
                  />
                }
              />
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Horas"
        title="Revision de horas"
        description="Zona segura para confirmar, corregir o excluir horas antes de cerrar el mes."
        primaryAction={
          <Link className="button button--primary" to="/quick-entry">
            Registrar horas
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to="/hours">
            Volver al control
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Resultado de la revision" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      {selectedMonth || selectedWorkerId ? (
        <WarningBanner title="Revision filtrada" tone="info">
          {selectedMonth ? `Mes: ${selectedMonth}. ` : ''}
          {selectedWorkerId
            ? `Trabajador filtrado: ${workers.find((worker) => worker.id === selectedWorkerId)?.name ?? selectedWorkerId}.`
            : 'Mostrando todos los trabajadores del filtro actual.'}
        </WarningBanner>
      ) : null}

      <WarningBanner title="Orden recomendado" tone="info">
        Empieza por pendientes, resuelve incidencias y deja las exclusiones solo para casos que no deben entrar al cierre.
      </WarningBanner>

      <MetricGrid columns={4}>
        <StatCard label="Horas pendientes" value={`${totalPendingHours.toFixed(1)} h`} hint="Horas aun sin confirmar para cierre." tone="warning" />
        <StatCard label="Pago pendiente" value={formatMoney(totalPendingPay)} hint="Importe asociado a entradas pendientes de revisar." tone="info" />
        <StatCard label="Incidencias" value={issueEntries.length.toString()} hint="Entradas con problema operativo o de tarifa." tone="danger" />
        <StatCard label="Excluidas" value={excludedEntries.length.toString()} hint="Entradas apartadas del payroll hasta restaurarlas." tone="neutral" />
      </MetricGrid>

      {activeEntry && activeMode === 'correct' ? (
        <HourCorrectionFlow
          entry={activeEntry}
          onCancel={() => {
            setActiveEntryId(null)
            setActiveMode(null)
          }}
          onSave={(patch) => runAction(correctHourEntry(activeEntry.id, patch))}
        />
      ) : null}

      {activeEntry && activeMode === 'incident' ? (
        <HourIncidentDialog
          onCancel={() => {
            setActiveEntryId(null)
            setActiveMode(null)
          }}
          onSave={(note) => runAction(markHourEntryIncident(activeEntry.id, note))}
        />
      ) : null}

      {activeEntry && activeMode === 'exclude' ? (
        <HourExcludeDialog
          onCancel={() => {
            setActiveEntryId(null)
            setActiveMode(null)
          }}
          onSave={(reason) => runAction(excludeHourEntry(activeEntry.id, reason))}
        />
      ) : null}

      {pendingEntries.length === 0 &&
      issueEntries.length === 0 &&
      excludedEntries.length === 0 &&
      lockedEntries.length === 0 ? (
        <HoursEmptyState
          title="Sin horas pendientes de revision"
          description="No hay entradas con incidencias, exclusiones o confirmaciones pendientes en los datos actuales."
          action={
            <Link className="button button--secondary button--sm" to="/hours">
              Ver control completo
            </Link>
          }
        />
      ) : (
        <>
          {renderGroup('Pendientes de revisar', pendingEntries)}
          {renderGroup('Con incidencia', issueEntries)}
          {renderGroup('Excluidas', excludedEntries)}
          {renderGroup('Bloqueadas', lockedEntries)}
        </>
      )}
    </div>
  )
}
