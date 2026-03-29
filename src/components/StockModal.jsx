import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PSX_STOCKS = [
  'ENGRO', 'LUCK', 'HBL', 'MCB', 'UBL', 'NBP', 'PPL', 'OGDC', 'PSO', 'HUBC',
  'EFERT', 'FFC', 'FFBL', 'FATIMA', 'SEARL', 'SHEL', 'SNGP', 'SSGC', 'KAPCO',
  'PKOL', 'AKBL', 'BAFL', 'BAHL', 'MEBL', 'FABL', 'JSBL', 'SILK', 'UNITY',
  'DGKC', 'MLCF', 'PIOC', 'CHCC', 'FCCL', 'KOHC', 'ACPL', 'POWER', 'MARI',
  'POL', 'ATRL', 'NRL', 'PRL', 'HASCOL', 'GHNI', 'ILP', 'TRG', 'SYS', 'NETSOL',
  'AVN', 'PAEL', 'AGTL', 'INDU', 'PSMC', 'GHNL', 'COLG', 'NESTLE', 'UNILEVER',
]

export default function StockModal({ onClose, onSave, editStock }) {
  const [form, setForm] = useState({
    symbol: '',
    company_name: '',
    quantity: '',
    buy_price: '',
    current_price: '',
    purchase_date: new Date().toISOString().split('T')[0], // Default to today
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editStock) {
      setForm({
        symbol: editStock.symbol || '',
        company_name: editStock.company_name || '',
        quantity: editStock.quantity || '',
        buy_price: editStock.buy_price || '',
        current_price: editStock.current_price || '',
        purchase_date: editStock.purchase_date || new Date().toISOString().split('T')[0],
        notes: editStock.notes || '',
      })
    }
  }, [editStock])

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const totalInvested = form.quantity && form.buy_price
    ? (Number(form.quantity) * Number(form.buy_price)).toFixed(2)
    : null

  const pl = form.quantity && form.buy_price && form.current_price
    ? ((Number(form.current_price) - Number(form.buy_price)) * Number(form.quantity)).toFixed(2)
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSave({
      symbol: form.symbol.toUpperCase().trim(),
      company_name: form.company_name.trim(),
      quantity: Number(form.quantity),
      buy_price: Number(form.buy_price),
      current_price: Number(form.current_price),
      purchase_date: form.purchase_date,
      notes: form.notes.trim(),
    })
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{editStock ? 'Edit Stock' : 'Add New Stock'}</h3>
          <button className="modal-close" onClick={onClose}><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">PSX Symbol *</label>
              <input
                className="form-input"
                list="psx-symbols"
                placeholder="e.g. ENGRO"
                value={form.symbol}
                onChange={e => set('symbol', e.target.value.toUpperCase())}
                required
              />
              <datalist id="psx-symbols">
                {PSX_STOCKS.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Purchase Date *</label>
              <input
                className="form-input"
                type="date"
                value={form.purchase_date}
                onChange={e => set('purchase_date', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity (Shares) *</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="any"
                placeholder="500"
                value={form.quantity}
                onChange={e => set('quantity', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Buy Price (PKR) *</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="any"
                placeholder="320.50"
                value={form.buy_price}
                onChange={e => set('buy_price', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Price (PKR) *</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="any"
                placeholder="350.00"
                value={form.current_price}
                onChange={e => set('current_price', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preview</label>
              <div style={{
                background: 'var(--cream)',
                border: '1.5px solid var(--cream-dark)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 13px',
                fontSize: 12,
                lineHeight: 1.8,
              }}>
                {totalInvested && (
                  <div>Invested: <strong>PKR {Number(totalInvested).toLocaleString()}</strong></div>
                )}
                {pl !== null && (
                  <div style={{ color: Number(pl) >= 0 ? 'var(--emerald)' : 'var(--ruby)', fontWeight: 600 }}>
                    P&L: PKR {Number(pl) >= 0 ? '+' : ''}{Number(pl).toLocaleString()}
                  </div>
                )}
                {!totalInvested && <span style={{ opacity: 0.4 }}>Fill fields to preview</span>}
              </div>
            </div>

            <div className="form-group full">
              <label className="form-label">Company Name (optional)</label>
              <input
                className="form-input"
                placeholder="e.g. Engro Corporation"
                value={form.company_name}
                onChange={e => set('company_name', e.target.value)}
              />
            </div>
            
            <div className="form-group full">
              <label className="form-label">Notes (optional)</label>
              <input
                className="form-input"
                placeholder="Any notes about this stock..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : editStock ? 'Update Stock' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}