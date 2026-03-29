import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { useStocks } from '../hooks/useStocks';

const fmt = (n) => 'PKR ' + Number(n).toLocaleString('en-PK', { minimumFractionDigits: 0 });
const COLORS = ['#C8A84B', '#1B6B4A', '#B03A2E', '#5B4A3A', '#7D6B4E', '#2E7D6B'];

export default function Dashboard({ setActivePage }) {
  const { stocks, loading, summary, syncPrices } = useStocks();
  const [lastSync, setLastSync] = useState('Never');

  useEffect(() => {
    // Sync prices immediately when dashboard opens
    const performSync = async () => {
      await syncPrices();
      setLastSync(new Date().toLocaleTimeString());
    };
    
    performSync();

    // Auto-refresh every 5 minutes during market hours
    const interval = setInterval(performSync, 300000);
    return () => clearInterval(interval);
  }, []);

  const pieData = stocks.filter(s => s.status !== 'sold').map(s => ({
    name: s.symbol,
    value: Number(s.buy_price) * Number(s.quantity),
  }));

  if (loading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="text-gray-400 text-sm">Last Market Sync: {lastSync}</p>
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
        <div className={`summary-card ${summary.totalPL >= 0 ? 'emerald' : 'ruby'}`}>
          <div className="summary-label">Total P&L</div>
          <div className="summary-value">{summary.totalPL >= 0 ? '+' : ''}{fmt(summary.totalPL)}</div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header"><h2>Portfolio Allocation</h2></div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => [fmt(v), 'Value']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}