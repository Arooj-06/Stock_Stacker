import { useState } from 'react'
import { Plus, Pencil, Trash2, RefreshCw, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react'
import { useStocks } from '../hooks/useStocks'
import { useToast } from '../hooks/useToast'
import StockModal from '../components/StockModal'

const fmt = (n) => Number(n).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Portfolio() {
  const { stocks, loading, addStock, updateStock, deleteStock, summary, refetch } = useStocks()
  const { toast, toasts } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editStock, setEditStock] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [kse100, setKse100] = useState('')
  const [activeTab, setActiveTab] = useState('active')

  const activeStocks = stocks.filter(s => s.status !== 'sold')
  const soldStocks = stocks.filter(s => s.status === 'sold')

  const isProfit = summary.totalPL >= 0
  const plPct = summary.totalInvested > 0 ? ((summary.totalPL / summary.totalInvested) * 100).toFixed(2) : '0.00'

  const handleSave = async (data) => {
    if (editStock) {
      await updateStock(editStock.id, data)
      toast('Stock updated!', 'success')
    } else {
      await addStock({ ...data, status: 'active' })
      toast('Stock added!', 'success')
    }
    setShowModal(false)
    setEditStock(null)
  }

  const handleSell = async (stock) => {
    const qtyInput = window.prompt(`Sell how many shares of ${stock.symbol}?`, stock.quantity)
    const qtyToSell = Number(qtyInput)
    if (!qtyInput || qtyToSell <= 0 || qtyToSell > stock.quantity) return

    const sellPrice = Number(window.prompt(`Selling price for ${stock.symbol}?`, stock.current_price))
    if (!sellPrice) return

    if (qtyToSell === stock.quantity) {
      await updateStock(stock.id, { status: 'sold', sell_price: sellPrice, sell_date: new Date().toISOString() })
    } else {
      await updateStock(stock.id, { quantity: stock.quantity - qtyToSell })
      await addStock({ ...stock, id: undefined, quantity: qtyToSell, sell_price: sellPrice, status: 'sold', sell_date: new Date().toISOString() })
    }
    toast(`Sold ${qtyToSell} shares of ${stock.symbol}`, 'success')
  }

  const handleDelete = async (id, symbol) => {
    if (!window.confirm(`Delete ${symbol}?`)) return
    setDeleting(id)
    await deleteStock(id)
    toast(`${symbol} deleted.`, 'success')
    setDeleting(null)
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Portfolio</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={refetch}><RefreshCw size={13} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => { setEditStock(null); setShowModal(true) }}>
            <Plus size={15} /> Add Stock
          </button>
        </div>
      </div>

      <div className="section-card">
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="stocks-table-wrap">
            <table className="stocks-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Current</th>
                  <th>P&L</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeStocks.map(stock => (
                  <tr key={stock.id}>
                    <td className="stock-symbol">{stock.symbol}</td>
                    <td>{stock.quantity}</td>
                    <td>{fmt(stock.current_price)}</td>
                    <td className={stock.current_price >= stock.buy_price ? 'profit-cell' : 'loss-cell'}>
                      {fmt((stock.current_price - stock.buy_price) * stock.quantity)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditStock(stock); setShowModal(true) }}><Pencil size={12} /></button>
                        <button className="btn btn-emerald btn-sm" onClick={() => handleSell(stock)}><CheckCircle size={12} /> Sell</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(stock.id, stock.symbol)} disabled={deleting === stock.id}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <StockModal onClose={() => setShowModal(false)} onSave={handleSave} editStock={editStock} />}
      <div className="toast-wrap">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}</div>
    </div>
  )
}