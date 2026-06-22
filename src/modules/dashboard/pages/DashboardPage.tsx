import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatusPill } from '../../../components/ui/StatusPill'
import { listAuditEntries } from '../../../infrastructure/audit/auditRepository'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { buildHourEntries } from '../../hours/services/hourEntryBuilder'
import { calculateHourEntrySummary } from '../../hours/services/hourCalculations'
import { ActivityFeed } from '../components/ActivityFeed'
import { DashboardStats } from '../components/DashboardStats'
import { DashboardWarnings } from '../components/DashboardWarnings'
import { OperationalFocus } from '../components/OperationalFocus'
import { QuickActions } from '../components/QuickActions'
import { QuickEntryPriorityCard } from '../components/QuickEntryPriorityCard'
import { TodayServices } from '../components/TodayServices'
import {
  calculateDashboardStats,
  getCurrentMonthKey,
  getCurrentMonthLabel,
  getDashboardWarnings,
  getOperationalFocus,
  getRecentActivity,
  getRecentQuickEntryServices,
  getTodayServices,
} from '../services/dashboardCalculations'

export function DashboardPage() {
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const month = getCurrentMonthKey()
  const stats = calculateDashboardStats(workers, clients, properties, services, month)
  const warnings = getDashboardWarnings(workers, clients, properties, services, month)
  const focusItems = getOperationalFocus(workers, clients, properties, services, month)
  const recentActivity = getRecentActivity(workers, clients, properties, services)
  const recentQuickEntries = getRecentQuickEntryServices(services, listAuditEntries())
  const todayServices = getTodayServices(services).filter(
    (service) => service.status === 'scheduled' || service.status === 'completed',
  )
  const payrollStates = Object.fromEntries(
    [...new Set(services.map((service) => service.date.slice(0, 7)))].map((item) => [
      item,
      repositories.payroll.getPayrollMonthState(item),
    ]),
  )
  const hoursSummary = calculateHourEntrySummary(
    buildHourEntries(services, workers, clients, properties, payrollStates).filter(
      (entry) => entry.payrollMonth === month,
    ),
  )

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Dashboard"
        title="Panel operativo"
        description="Estado actual de la operacion, control de horas y actividad reciente para coordinar trabajo y cierres desde una sola vista."
        meta={<StatusPill tone="info">{getCurrentMonthLabel()}</StatusPill>}
        primaryAction={
          <Link className="button button--primary" to="/quick-entry">
            Registrar horas
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to="/hours">
            Ver control de horas
          </Link>
        }
      />

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <QuickEntryPriorityCard
          clients={clients}
          properties={properties}
          services={recentQuickEntries}
        />
        <Card
          title="Control de horas"
          description="Seguimiento mensual centrado en horas confirmadas, revision e incidencias."
          action={
            <Link className="button button--secondary button--sm" to="/hours">
              Ver control
            </Link>
          }
        >
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Horas este mes</span>
              <strong>{hoursSummary.totalHours.toFixed(1)} h</strong>
            </div>
            <div>
              <span className="muted-caption">Pendientes</span>
              <strong>{hoursSummary.pendingReviewCount}</strong>
            </div>
            <div>
              <span className="muted-caption">Incidencias</span>
              <strong>{hoursSummary.issueCount}</strong>
            </div>
          </div>
          <p className="muted-caption">
            Quick Entry sigue siendo la entrada principal para registrar trabajo realizado.
          </p>
        </Card>
      </section>

      <section className="dashboard-grid">
        <OperationalFocus items={focusItems} />
        <TodayServices clients={clients} properties={properties} services={todayServices} />
      </section>

      <section className="dashboard-grid">
        <DashboardWarnings warnings={warnings} />
        <ActivityFeed items={recentActivity} />
        <QuickActions />
      </section>
    </div>
  )
}
