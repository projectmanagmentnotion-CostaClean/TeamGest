import { Navigate, useRoutes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ClientDetailPage } from '../modules/clients/pages/ClientDetailPage'
import { ClientsPage } from '../modules/clients/pages/ClientsPage'
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage'
import { PayrollMonthDetailPage } from '../modules/payroll/pages/PayrollMonthDetailPage'
import { PayrollPage } from '../modules/payroll/pages/PayrollPage'
import { PropertiesPage } from '../modules/properties/pages/PropertiesPage'
import { PropertyDetailPage } from '../modules/properties/pages/PropertyDetailPage'
import { ServiceDetailPage } from '../modules/services/pages/ServiceDetailPage'
import { NewServicePage } from '../modules/services/pages/NewServicePage'
import { ServicesPage } from '../modules/services/pages/ServicesPage'
import { SettingsPage } from '../modules/settings/pages/SettingsPage'
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
        { path: 'workers', element: <WorkersPage /> },
        { path: 'workers/:id', element: <WorkerDetailPage /> },
        { path: 'properties', element: <PropertiesPage /> },
        { path: 'properties/:id', element: <PropertyDetailPage /> },
        { path: 'clients', element: <ClientsPage /> },
        { path: 'clients/:id', element: <ClientDetailPage /> },
        { path: 'services', element: <ServicesPage /> },
        { path: 'services/new', element: <NewServicePage /> },
        { path: 'services/:id', element: <ServiceDetailPage /> },
        { path: 'payroll', element: <PayrollPage /> },
        { path: 'payroll/:month', element: <PayrollMonthDetailPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: '*', element: <Navigate to="/dashboard" replace /> },
      ],
    },
  ])
}
