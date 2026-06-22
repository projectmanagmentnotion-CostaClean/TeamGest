import { Navigate, useRoutes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ClientDetailPage } from '../modules/clients/pages/ClientDetailPage'
import { ClientsPage } from '../modules/clients/pages/ClientsPage'
import { EditClientPage } from '../modules/clients/pages/EditClientPage'
import { NewClientPage } from '../modules/clients/pages/NewClientPage'
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage'
import { HoursPage } from '../modules/hours/pages/HoursPage'
import { HoursReviewPage } from '../modules/hours/pages/HoursReviewPage'
import { PropertyHoursPage } from '../modules/hours/pages/PropertyHoursPage'
import { WorkerHoursPage } from '../modules/hours/pages/WorkerHoursPage'
import { PayrollMonthDetailPage } from '../modules/payroll/pages/PayrollMonthDetailPage'
import { PayrollPage } from '../modules/payroll/pages/PayrollPage'
import { EditPropertyPage } from '../modules/properties/pages/EditPropertyPage'
import { NewPropertyPage } from '../modules/properties/pages/NewPropertyPage'
import { PropertiesPage } from '../modules/properties/pages/PropertiesPage'
import { PropertyDetailPage } from '../modules/properties/pages/PropertyDetailPage'
import { EditServicePage } from '../modules/services/pages/EditServicePage'
import { NewServicePage } from '../modules/services/pages/NewServicePage'
import { QuickWorkEntryPage } from '../modules/services/pages/QuickWorkEntryPage'
import { ServiceDetailPage } from '../modules/services/pages/ServiceDetailPage'
import { ServicesPage } from '../modules/services/pages/ServicesPage'
import { SettingsPage } from '../modules/settings/pages/SettingsPage'
import { EditWorkerPage } from '../modules/workers/pages/EditWorkerPage'
import { NewWorkerPage } from '../modules/workers/pages/NewWorkerPage'
import { WorkerDetailPage } from '../modules/workers/pages/WorkerDetailPage'
import { WorkersPage } from '../modules/workers/pages/WorkersPage'

export function AppRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'quick-entry', element: <QuickWorkEntryPage /> },
        { path: 'hours', element: <HoursPage /> },
        { path: 'hours/review', element: <HoursReviewPage /> },
        { path: 'hours/workers/:workerId', element: <WorkerHoursPage /> },
        { path: 'hours/properties/:propertyId', element: <PropertyHoursPage /> },
        { path: 'workers', element: <WorkersPage /> },
        { path: 'workers/new', element: <NewWorkerPage /> },
        { path: 'workers/:id', element: <WorkerDetailPage /> },
        { path: 'workers/:id/edit', element: <EditWorkerPage /> },
        { path: 'properties', element: <PropertiesPage /> },
        { path: 'properties/new', element: <NewPropertyPage /> },
        { path: 'properties/:id', element: <PropertyDetailPage /> },
        { path: 'properties/:id/edit', element: <EditPropertyPage /> },
        { path: 'clients', element: <ClientsPage /> },
        { path: 'clients/new', element: <NewClientPage /> },
        { path: 'clients/:id', element: <ClientDetailPage /> },
        { path: 'clients/:id/edit', element: <EditClientPage /> },
        { path: 'services', element: <ServicesPage /> },
        { path: 'services/new', element: <NewServicePage /> },
        { path: 'services/:id', element: <ServiceDetailPage /> },
        { path: 'services/:id/edit', element: <EditServicePage /> },
        { path: 'payroll', element: <PayrollPage /> },
        { path: 'payroll/:month', element: <PayrollMonthDetailPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: '*', element: <Navigate to="/dashboard" replace /> },
      ],
    },
  ])
}
