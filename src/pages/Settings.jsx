import { useAuth } from '../hooks/useAuth'

export default function Settings() {
  const { user, signOut } = useAuth()

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="section-card" style={{ maxWidth: 520 }}>
        <div className="section-card-header"><h2>Account</h2></div>
        <div style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 52, height: 52,
              background: 'var(--gold)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: 'var(--ink)',
              fontFamily: 'var(--font-display)',
            }}>
              {user?.email?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{user?.email?.split('@')[0]}</div>
              <div style={{ fontSize: 13, opacity: 0.6 }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)', marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.5, marginBottom: 4 }}>User ID</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7, wordBreak: 'break-all' }}>{user?.id}</div>
          </div>

          <div style={{ padding: '14px 16px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.5, marginBottom: 4 }}>Last Sign In</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.7 }}>
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('en-PK') : 'N/A'}
            </div>
          </div>

          <button className="btn-logout" style={{ width: 'auto', padding: '10px 20px' }} onClick={signOut}>
            Sign Out of Stock Stacker
          </button>
        </div>
      </div>

      <div className="section-card" style={{ maxWidth: 520, marginTop: 20 }}>
        <div className="section-card-header"><h2>About</h2></div>
        <div style={{ padding: '18px 24px', fontSize: 13, lineHeight: 1.8, opacity: 0.7 }}>
          <p><strong>Stock Stacker</strong> is a personal PSX portfolio tracker built with React and Supabase.</p>
          <br />
          <p>Your data is private — stored securely in your own account using Row Level Security (RLS). No other user can see your portfolio.</p>
          <br />
        </div>
      </div>
    </div>
  )
}
