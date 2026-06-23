import { lazy, Suspense, type ComponentType } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'

const DashboardPage = lazy(async () =>
  import('../modules/dashboard/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const QuickWorkEntryPage = lazy(async () =>
  import('../modules/services/pages/QuickWorkEntryPage').then((module) => ({
    default: module.QuickWorkEntryPage,
  })),
)
const HoursPage = lazy(async () =>
  import('../modules/hours/pages/HoursPage').then((module) => ({ default: module.HoursPage })),
)
const HoursReviewPage = lazy(async () =>
  import('../modules/hours/pages/HoursReviewPage').then((module) => ({ default: module.HoursReviewPage })),
)
const WorkerHoursPage = lazy(async () =>
  import('../modules/hours/pages/WorkerHoursPage').then((module) => ({ default: module.WorkerHoursPage })),
)
const PropertyHoursPage = lazy(async () =>
  import('../modules/hours/pages/PropertyHoursPage').then((module) => ({
    default: module.PropertyHoursPage,
  })),
)
const WorkersPage = lazy(async () =>
  import('../modules/workers/pages/WorkersPage').then((module) => ({ default: module.WorkersPage })),
)
const NewWorkerPage = lazy(async () =>
  import('../modules/workers/pages/NewWorkerPage').then((module) => ({ default: module.NewWorkerPage })),
)
const WorkerDetailPage = lazy(async () =>
  import('../modules/workers/pages/WorkerDetailPage').then((module) => ({
    default: module.WorkerDetailPage,
  })),
)
const EditWorkerPage = lazy(async () =>
  import('../modules/workers/pages/EditWorkerPage').then((module) => ({ default: module.EditWorkerPage })),
)
const PropertiesPage = lazy(async () =>
  import('../modules/properties/pages/PropertiesPage').then((module) => ({
    default: module.PropertiesPage,
  })),
)
const NewPropertyPage = lazy(async () =>
  import('../modules/properties/pages/NewPropertyPage').then((module) => ({
    default: module.NewPropertyPage,
  })),
)
const PropertyDetailPage = lazy(async () =>
  import('../modules/properties/pages/PropertyDetailPage').then((module) => ({
    default: module.PropertyDetailPage,
  })),
)
const EditPropertyPage = lazy(async () =>
  import('../modules/properties/pages/EditPropertyPage').then((module) => ({
    default: module.EditPropertyPage,
  })),
)
const ClientsPage = lazy(async () =>
  import('../modules/clients/pages/ClientsPage').then((module) => ({ default: module.ClientsPage })),
)
const NewClientPage = lazy(async () =>
  import('../modules/clients/pages/NewClientPage').then((module) => ({ default: module.NewClientPage })),
)
const ClientDetailPage = lazy(async () =>
  import('../modules/clients/pages/ClientDetailPage').then((module) => ({ default: module.ClientDetailPage })),
)
const EditClientPage = lazy(async () =>
  import('../modules/clients/pages/EditClientPage').then((module) => ({ default: module.EditClientPage })),
)
const ServicesPage = lazy(async () =>
  import('../modules/services/pages/ServicesPage').then((module) => ({ default: module.ServicesPage })),
)
const NewServicePage = lazy(async () =>
  import('../modules/services/pages/NewServicePage').then((module) => ({ default: module.NewServicePage })),
)
const ServiceDetailPage = lazy(async () =>
  import('../modules/services/pages/ServiceDetailPage').then((module) => ({
    default: module.ServiceDetailPage,
  })),
)
const EditServicePage = lazy(async () =>
  import('../modules/services/pages/EditServicePage').then((module) => ({ default: module.EditServicePage })),
)
const PayrollPage = lazy(async () =>
  import('../modules/payroll/pages/PayrollPage').then((module) => ({ default: module.PayrollPage })),
)
const PayrollMonthDetailPage = lazy(async () =>
  import('../modules/payroll/pages/PayrollMonthDetailPage').then((module) => ({
    default: module.PayrollMonthDetailPage,
  })),
)
const WorkerMonthlyClosurePage = lazy(async () =>
  import('../modules/payroll/pages/WorkerMonthlyClosurePage').then((module) => ({
    default: module.WorkerMonthlyClosurePage,
  })),
)
const SettingsPage = lazy(async () =>
  import('../modules/settings/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)

function RouteLoadingFallback() {
  return (
    <div className="page-stack">
      <section className="card">
        <div className="card__body">
          <strong>Cargando vista...</strong>
          <p className="muted-caption">
            Preparando el modulo solicitado en el runtime local de TeamGest.
          </p>
        </div>
      </section>
    </div>
  )
}

function renderLazyPage(Page: ComponentType) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Page />
    </Suspense>
  )
}

export function AppRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: renderLazyPage(DashboardPage) },
        { path: 'quick-entry', element: renderLazyPage(QuickWorkEntryPage) },
        { path: 'hours', element: renderLazyPage(HoursPage) },
        { path: 'hours/review', element: renderLazyPage(HoursReviewPage) },
        { path: 'hours/workers/:workerId', element: renderLazyPage(WorkerHoursPage) },
        { path: 'hours/properties/:propertyId', element: renderLazyPage(PropertyHoursPage) },
        { path: 'workers', element: renderLazyPage(WorkersPage) },
        { path: 'workers/new', element: renderLazyPage(NewWorkerPage) },
        { path: 'workers/:id', element: renderLazyPage(WorkerDetailPage) },
        { path: 'workers/:id/edit', element: renderLazyPage(EditWorkerPage) },
        { path: 'properties', element: renderLazyPage(PropertiesPage) },
        { path: 'properties/new', element: renderLazyPage(NewPropertyPage) },
        { path: 'properties/:id', element: renderLazyPage(PropertyDetailPage) },
        { path: 'properties/:id/edit', element: renderLazyPage(EditPropertyPage) },
        { path: 'clients', element: renderLazyPage(ClientsPage) },
        { path: 'clients/new', element: renderLazyPage(NewClientPage) },
        { path: 'clients/:id', element: renderLazyPage(ClientDetailPage) },
        { path: 'clients/:id/edit', element: renderLazyPage(EditClientPage) },
        { path: 'services', element: renderLazyPage(ServicesPage) },
        { path: 'services/new', element: renderLazyPage(NewServicePage) },
        { path: 'services/:id', element: renderLazyPage(ServiceDetailPage) },
        { path: 'services/:id/edit', element: renderLazyPage(EditServicePage) },
        { path: 'payroll', element: renderLazyPage(PayrollPage) },
        { path: 'payroll/:month', element: renderLazyPage(PayrollMonthDetailPage) },
        { path: 'payroll/:month/workers/:workerId', element: renderLazyPage(WorkerMonthlyClosurePage) },
        { path: 'settings', element: renderLazyPage(SettingsPage) },
        { path: '*', element: <Navigate to="/dashboard" replace /> },
      ],
    },
  ])
}
