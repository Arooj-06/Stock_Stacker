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
          <div style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--gold)',
            fontSize: 18,
          }}></div>
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {activePage === 'dashboard' && <Dashboard setActivePage={setActivePage} />}
        {activePage === 'portfolio' && <Portfolio />}
        
        {/* 2. Add these two lines to show the new pages */}
        {activePage === 'history' && <History />}
        {activePage === 'weeklyreport' && <WeeklyReport />}
        
        {activePage === 'settings' && <Settings />}
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