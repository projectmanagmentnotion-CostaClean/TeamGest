import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatusPill } from '../../../components/ui/StatusPill'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { ActivityFeed } from '../components/ActivityFeed'
import { DashboardStats } from '../components/DashboardStats'
import { DashboardWarnings } from '../components/DashboardWarnings'
import { OperationalFocus } from '../components/OperationalFocus'
import { QuickActions } from '../components/QuickActions'
import { TodayServices } from '../components/TodayServices'
import {
  calculateDashboardStats,
  getCurrentMonthKey,
  getCurrentMonthLabel,
  getDashboardWarnings,
  getOperationalFocus,
  getRecentActivity,
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
  const todayServices = getTodayServices(services).filter(
    (service) => service.status === 'scheduled' || service.status === 'completed',
  )

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Dashboard"
        title="Panel operativo"
        description="Estado actual de la operacion, focos criticos y actividad reciente para coordinar servicios y cierres desde una sola vista."
        meta={<StatusPill tone="info">{getCurrentMonthLabel()}</StatusPill>}
        primaryAction={
          <Link className="button button--primary" to="/services/new">
            Nuevo servicio
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary" to="/payroll">
            Ver cierres
          </Link>
        }
      />

      <DashboardStats stats={stats} />
      <OperationalFocus items={focusItems} />

      <section className="dashboard-grid">
        <TodayServices clients={clients} properties={properties} services={todayServices} />
        <DashboardWarnings warnings={warnings} />
      </section>

      <section className="dashboard-grid">
        <ActivityFeed items={recentActivity} />
        <QuickActions />
      </section>
    </div>
  )
}
