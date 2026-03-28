
import { useAuth } from '../hooks/useAuth'
// Make sure 'History' and 'FileText' are here!
import { LayoutDashboard, TrendingUp, Settings, LogOut, History, FileText } from 'lucide-react'

export default function Sidebar({ activePage, setActivePage }) {
  const { user, signOut } = useAuth()

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'SS'

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="brand">Stock <span>Stacker</span></div>
        <div className="tagline">PSX · KSE 100 Tracker</div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
        
        <button
          className={`nav-item ${activePage === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActivePage('portfolio')}
        >
          <TrendingUp size={16} />
          My Portfolio
        </button>

        {/* New: Trade History Section */}
        <button
          className={`nav-item ${activePage === 'history' ? 'active' : ''}`}
          onClick={() => setActivePage('history')}
        >
          <History size={16} />
          Trade History
        </button>

        {/* New: Weekly Report Section */}
     {/* Change 'reports' to 'weeklyreport' so it matches your App.jsx condition */}
<button
  className={`nav-item ${activePage === 'weeklyreport' ? 'active' : ''}`}
  onClick={() => setActivePage('weeklyreport')}
>
  <FileText size={16} />
  Weekly Report
</button>
        
        <button
          className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
          onClick={() => setActivePage('settings')}
        >
          <Settings size={16} />
          Settings
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--cream)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
              {user?.email?.split('@')[0]}
            </div>
            <div className="user-email" style={{ fontSize: 10 }}>{user?.email}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={signOut}>
          <LogOut size={13} style={{ display: 'inline', marginRight: 6 }} />
          Sign Out
        </button>
      </div>
    </div>
  )
}