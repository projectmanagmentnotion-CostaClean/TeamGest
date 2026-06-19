import { Outlet } from 'react-router-dom'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="shell-content">
        <TopBar />
        <main className="shell-main">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
