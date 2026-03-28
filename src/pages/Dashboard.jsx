import { useState, useEffect } from 'react' // Fixed: Added missing imports
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts'
import { BarChart2, Plus } from 'lucide-react'
import { useStocks } from '../hooks/useStocks'

const fmt = (n) => 'PKR ' + Number(n).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fmtPL = (n) => (n >= 0 ? '+' : '') + 'PKR ' + Number(n).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const COLORS = ['#C8A84B', '#1B6B4A', '#B03A2E', '#5B4A3A', '#7D6B4E', '#2E7D6B', '#8B4513', '#4A6B8A']

export default function Dashboard({ setActivePage }) {
  const { stocks, loading, summary } = useStocks()
  const [liveIndex, setLiveIndex] = useState(151707.52)

  // Simulate a small fluctuation every 5 seconds for visual effect
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 10
      setLiveIndex(prev => prev + fluctuation)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const portfolioGrowth = summary.totalInvested > 0
    ? ((summary.totalCurrent - summary.totalInvested) / summary.totalInvested) * 100
    : 0

  const kseWeeklyChange = -0.79 
  const isProfit = summary.totalPL >= 0

  const pieData = stocks.filter(s => s.status !== 'sold').map(s => ({
    name: s.symbol,
    value: Number(s.buy_price) * Number(s.quantity),
  }))

  const comparisonData = [
    {
      name: 'Weekly Growth %',
      portfolio: Number(portfolioGrowth.toFixed(2)),
      market: kseWeeklyChange,
    }
  ]

  if (loading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your portfolio at a glance</p>
      </div>

      <div className="kse-banner">
        <div>
          <div className="kse-label">KSE-100 Index (Live Simulation)</div>
          <div className="kse-value" style={{ color: kseWeeklyChange >= 0 ? 'var(--emerald)' : 'var(--ruby)' }}>
            {liveIndex.toLocaleString(undefined, { maximumFractionDigits: 2 })} {kseWeeklyChange >= 0 ? '↗' : '↘'}
          </div>
          <div className="kse-note">Market Status: {kseWeeklyChange >= 0 ? 'Bullish' : 'Bearish'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="kse-label">Active Stocks</div>
          <div className="kse-value" style={{ fontSize: 28 }}>{stocks.filter(s => s.status !== 'sold').length}</div>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card gold">
          <div className="summary-label">Total Invested</div>
          <div className="summary-value">{fmt(summary.totalInvested)}</div>
        </div>
        <div className="summary-card neutral">
          <div className="summary-label">Current Value</div>
          <div className="summary-value">{fmt(summary.totalCurrent)}</div>
        </div>
        <div className={`summary-card ${isProfit ? 'emerald' : 'ruby'}`}>
          <div className="summary-label">Total P&L</div>
          <div className="summary-value">{fmtPL(summary.totalPL)}</div>
        </div>
      </div>

      {stocks.length === 0 ? (
        <div className="section-card">
          <div className="empty-state">
            <h3>No stocks yet</h3>
            <button className="btn btn-primary" onClick={() => setActivePage('portfolio')}>Add Stock</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="section-card">
            <div className="section-card-header"><h2>Portfolio Allocation</h2></div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [fmt(v), 'Invested']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="section-card">
            <div className="section-card-header"><h2>Portfolio vs Market (%)</h2></div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip formatter={(v) => [v + '%', 'Growth']} />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="portfolio" name="My Portfolio" fill="#C8A84B" />
                <Bar dataKey="market" name="KSE-100" fill="#1B6B4A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}