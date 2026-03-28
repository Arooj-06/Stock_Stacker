import { useState } from 'react'
import { Plus, Pencil, Trash2, RefreshCw, CheckCircle } from 'lucide-react'
import { useStocks } from '../hooks/useStocks'
import { useToast } from '../hooks/useToast'
import StockModal from '../components/StockModal'

const fmt = (n) => Number(n).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Portfolio() {
  // ADDED: handleSell was pulled from the useStocks hook
  const { stocks, loading, addStock, updateStock, deleteStock, handleSell, refetch } = useStocks()
  const { toast, toasts } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editStock, setEditStock] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // FILTER: Only show active stocks (History page handles the rest now)
  const activeStocks = stocks.filter(s => s.status !== 'sold')

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

  // UPDATED: Now calls the centralized handleSell from useStocks hook
  const onSellClick = async (stock) => {
    const qtyInput = window.prompt(`Sell how many shares of ${stock.symbol}?`, stock.quantity)
    const qtyToSell = Number(qtyInput)
    
    if (!qtyInput || qtyToSell <= 0 || qtyToSell > stock.quantity) {
      toast("Invalid quantity", "error")
      return
    }

    const priceInput = window.prompt(`Selling price for ${stock.symbol}?`, stock.current_price)
    const sellPrice = Number(priceInput)
    
    if (!priceInput || sellPrice <= 0) {
      toast("Invalid price", "error")
      return
    }

    // This triggers the database move to the trade_history table
    const result = await handleSell(stock, qtyToSell, sellPrice)
    
    if (result.success) {
      toast(`Successfully sold ${qtyToSell} shares of ${stock.symbol}! ✨`, 'success')
    } else {
      toast("Sale failed. Check console.", "error")
    }
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
            <Plus size(15) /> Add Stock
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
                  <th>Avg. Price</th>
                  <th>Current</th>
                  <th>P&L</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeStocks.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">No active stocks in portfolio.</td></tr>
                ) : (
                  activeStocks.map(stock => (
                    <tr key={stock.id}>
                      <td className="stock-symbol">{stock.symbol}</td>
                      <td>{stock.quantity}</td>
                      <td>{fmt(stock.buy_price)}</td>
                      <td>{fmt(stock.current_price)}</td>
                      <td className={stock.current_price >= stock.buy_price ? 'profit-cell' : 'loss-cell'}>
                        {fmt((stock.current_price - stock.buy_price) * stock.quantity)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setEditStock(stock); setShowModal(true) }}><Pencil size={12} /></button>
                          <button className="btn btn-emerald btn-sm" onClick={() => onSellClick(stock)}><CheckCircle size={12} /> Sell</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(stock.id, stock.symbol)} disabled={deleting === stock.id}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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