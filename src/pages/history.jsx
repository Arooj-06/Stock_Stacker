import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Verify this path matches your project

export default function History() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trade_history') // Matches the new TABLE we created
      .select('*')
      .order('sell_date', { ascending: false });

    if (error) {
      console.error("Error fetching history:", error.message);
    } else {
      setTrades(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading trades...</div>;

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Trade History</h2>
      
      {trades.length === 0 ? (
        <p className="text-gray-400">No closed positions found.</p>
      ) : (
        <div className="overflow-x-auto bg-[#1a1a1a] rounded-lg border border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-[#262626] text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">Stock</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Buy Price</th>
                <th className="p-4">Sell Price</th>
                <th className="p-4">P&L</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-white/5">
                  <td className="p-4 font-bold">{trade.symbol}</td>
                  <td className="p-4">{trade.quantity}</td>
                  <td className="p-4">PKR {trade.buy_price}</td>
                  <td className="p-4">PKR {trade.sell_price}</td>
                  <td className={`p-4 font-bold ${trade.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    PKR {trade.profit_loss}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(trade.sell_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}