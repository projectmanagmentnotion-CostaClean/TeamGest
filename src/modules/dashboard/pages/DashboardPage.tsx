import { Link } from 'react-router-dom'
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
      <section className="hero-panel">
        <div className="hero-panel__content">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Panel operativo</h1>
            <p className="page-description">
              Estado actual de la operación, focos críticos y actividad reciente para coordinar
              servicios y cierres desde una sola vista.
            </p>
          </div>
          <span className="hero-panel__month">{getCurrentMonthLabel()}</span>
        </div>
        <div className="hero-panel__actions">
          <Link className="button button--primary" to="/services/new">
            Nuevo servicio
          </Link>
          <Link className="button button--secondary" to="/payroll">
            Ver cierres
          </Link>
        </div>
      </section>

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
