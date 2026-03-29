import { useState, useEffect } from 'react';
import { getLivePrice } from '../lib/marketService'; // Import your live service

export default function StockModal({ onClose, onSave, editStock }) {
  const [formData, setFormData] = useState(editStock || {
    symbol: '',
    quantity: '',
    buy_price: '',
    current_price: '',
  });
  const [isFetching, setIsFetching] = useState(false);

  // Effect to fetch price when a symbol is entered
  const handleFetchPrice = async () => {
    if (!formData.symbol) return;
    setIsFetching(true);
    const price = await getLivePrice(formData.symbol);
    if (price) {
      setFormData(prev => ({ ...prev, current_price: price }));
    }
    setIsFetching(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editStock ? 'Edit Stock' : 'Add New Stock'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Stock Symbol (e.g. ENGRO.KA)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="form-input"
                value={formData.symbol}
                onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="SYMBOL.KA"
                required
              />
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={handleFetchPrice}
                disabled={isFetching}
              >
                {isFetching ? '...' : 'Fetch'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              className="form-input"
              type="number"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Buy Price (Avg)</label>
            <input
              className="form-input"
              type="number"
              value={formData.buy_price}
              onChange={e => setFormData({ ...formData, buy_price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Current Market Price</label>
            <input
              className="form-input"
              type="number"
              value={formData.current_price}
              onChange={e => setFormData({ ...formData, current_price: e.target.value })}
              placeholder={isFetching ? "Fetching..." : "Live price will appear here"}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
}