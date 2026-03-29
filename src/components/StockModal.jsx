import { useState, useEffect } from 'react';
import { getLivePrice } from '../lib/marketService';

export default function StockModal({ onClose, onSave, editStock }) {
  const [formData, setFormData] = useState(editStock || {
    symbol: '',
    quantity: '',
    buy_price: '',
    current_price: '',
  });
  const [isFetching, setIsFetching] = useState(false);

  // Automatic Fetching Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.symbol.length >= 3) {
        setIsFetching(true);
        const price = await getLivePrice(formData.symbol);
        if (price) {
          setFormData(prev => ({ ...prev, current_price: price }));
        }
        setIsFetching(false);
      }
    }, 1000); // Waits for 1 second after you stop typing

    return () => clearTimeout(timer);
  }, [formData.symbol]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '20px' }}>{editStock ? 'Edit Stock' : 'Add New Stock'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Stock Symbol</label>
            <input
              className="form-input"
              value={formData.symbol}
              onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              placeholder="e.g. ENGRO.KA"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              className="form-input"
              type="number"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Buy Price (Avg)</label>
            <input
              className="form-input"
              type="number"
              value={formData.buy_price}
              onChange={e => setFormData({ ...formData, buy_price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Market Price</label>
            <input
              className="form-input"
              type="number"
              value={formData.current_price}
              onChange={e => setFormData({ ...formData, current_price: e.target.value })}
              placeholder={isFetching ? "Fetching latest price..." : "Price will update automatically"}
              required
            />
          </div>

          <div className="modal-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Save Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}