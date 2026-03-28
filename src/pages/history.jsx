import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const fmt = (n) => 'PKR ' + Number(n).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function History() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    setLoading(true)

    // Get the currently logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('trade_history')
      .select('*')
      .eq('user_id', user.id)          // ← KEY FIX: filter by logged-in user
      .order('sell_date', { ascending: false })

    if (error) {
      console.error('Error fetching history:', error.message)
    } else {
      setTrades(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  if (loading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <h1>Trade History</h1>
        <p>All your closed positions</p>
      </div>

      <div className="section-card">
        {trades.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No closed positions yet</h3>
            <p>When you sell a stock from your portfolio, it will appear here.</p>
          </div>
        ) : (
          <div className="stocks-table-wrap">
            <table className="stocks-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                  <th>P&amp;L</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td><span className="stock-symbol">{trade.symbol}</span></td>
                    <td>{trade.quantity}</td>
                    <td>{fmt(trade.buy_price)}</td>
                    <td>{fmt(trade.sell_price)}</td>
                    <td className={trade.profit_loss >= 0 ? 'profit-cell' : 'loss-cell'}>
                      {trade.profit_loss >= 0 ? '+' : ''}{fmt(trade.profit_loss)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>
                      {new Date(trade.sell_date).toLocaleDateString('en-PK', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}