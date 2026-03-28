import { useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Settings from './pages/Settings'
import Sidebar from './components/Sidebar'
import History from './pages/history'
import WeeklyReport from './pages/weeklyreport'

function AppInner() {
  const { user, loading } = useAuth()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sidebar-bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: 18 }}>
            Loading…
          </div>
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  const handlePageChange = (page) => {
    setActivePage(page)
    setSidebarOpen(false) // close sidebar on mobile after navigation
  }

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span /><span /><span />
        </button>
        <div className="mobile-brand">Stock <span>Stacker</span></div>
      </div>

      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {activePage === 'dashboard'    && <Dashboard setActivePage={handlePageChange} />}
        {activePage === 'portfolio'    && <Portfolio />}
        {activePage === 'history'      && <History />}
        {activePage === 'weeklyreport' && <WeeklyReport />}
        {activePage === 'settings'     && <Settings />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}