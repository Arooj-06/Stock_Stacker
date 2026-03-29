import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getLivePrice } from '../lib/marketService';

export function useStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalInvested: 0, totalCurrent: 0, totalPL: 0 });

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStocks(data);
      calculateSummary(data);
    }
    setLoading(false);
  }, []);

  const calculateSummary = (data) => {
    const active = data.filter(s => s.status !== 'sold');
    const invested = active.reduce((acc, s) => acc + (Number(s.buy_price) * Number(s.quantity)), 0);
    const current = active.reduce((acc, s) => acc + (Number(s.current_price) * Number(s.quantity)), 0);
    setSummary({
      totalInvested: invested,
      totalCurrent: current,
      totalPL: current - invested
    });
  };

  // NEW: Function to sync database with live market prices
  const syncPrices = async () => {
    const activeStocks = stocks.filter(s => s.status !== 'sold');
    if (activeStocks.length === 0) return;

    for (const stock of activeStocks) {
      const livePrice = await getLivePrice(stock.symbol);
      if (livePrice && livePrice !== stock.current_price) {
        await supabase
          .from('stocks')
          .update({ current_price: livePrice })
          .eq('id', stock.id);
      }
    }
    await fetchStocks(); // Refresh UI after updates
  };

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return { stocks, loading, summary, syncPrices, refetch: fetchStocks };
}