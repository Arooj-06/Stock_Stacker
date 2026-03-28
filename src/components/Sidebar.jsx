import { LayoutDashboard, TrendingUp, History, BarChart2, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',      Icon: LayoutDashboard },
  { id: 'portfolio',    label: 'My Portfolio',    Icon: TrendingUp },
  { id: 'history',      label: 'Trade History',   Icon: History },
  { id: 'weeklyreport', label: 'Weekly Report',   Icon: BarChart2 },
  { id: 'settings',     label: 'Settings',        Icon: Settings },
]

export default function Sidebar({ activePage, setActivePage, isOpen, onClose }) {
  const { user, signOut } = useAuth()

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-logo">
        <div className="brand">Stock <span>Stacker</span></div>
        <div className="tagline">PSX · KSE 100 Tracker</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item${activePage === id ? ' active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.email?.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{user?.email?.split('@')[0]}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={signOut}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  )
}