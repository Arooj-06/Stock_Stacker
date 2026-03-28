import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useStocks() {
  const { user } = useAuth()
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStocks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setStocks(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchStocks() }, [fetchStocks])

  const addStock = async (stockData) => {
    const { data, error } = await supabase
      .from('stocks')
      .insert([{ ...stockData, user_id: user.id }])
      .select()
      .single()
    if (!error) setStocks(prev => [data, ...prev])
    return { data, error }
  }

  const updateStock = async (id, stockData) => {
    const { data, error } = await supabase
      .from('stocks')
      .update(stockData)
      .eq('id', id)
      .select()
      .single()
    if (!error) setStocks(prev => prev.map(s => s.id === id ? data : s))
    return { data, error }
  }

  const deleteStock = async (id) => {
    const { error } = await supabase
      .from('stocks')
      .delete()
      .eq('id', id)
    if (!error) setStocks(prev => prev.filter(s => s.id !== id))
    return { error }
  }

  // --- NEW: handleSell Function ---
  const handleSell = async (stock, sellQty, sellPrice) => {
    try {
      const profitLoss = (Number(sellPrice) - Number(stock.buy_price)) * Number(sellQty);

      // 1. Record the sale in trade_history table
      const { error: historyError } = await supabase
        .from('trade_history')
        .insert([{
          user_id: user.id,
          symbol: stock.symbol,
          quantity: Number(sellQty),
          buy_price: Number(stock.buy_price),
          sell_price: Number(sellPrice),
          profit_loss: profitLoss,
          sell_date: new Date().toISOString()
        }]);

      if (historyError) throw historyError;

      // 2. Update the active stocks table
      if (Number(sellQty) >= Number(stock.quantity)) {
        await deleteStock(stock.id);
      } else {
        await updateStock(stock.id, { quantity: Number(stock.quantity) - Number(sellQty) });
      }

      return { success: true };
    } catch (error) {
      console.error("Sale failed:", error.message);
      return { success: false, error };
    }
  }

  // Computed summary
  const summary = stocks.reduce((acc, s) => {
    const invested = Number(s.buy_price) * Number(s.quantity)
    const current = Number(s.current_price) * Number(s.quantity)
    const pl = current - invested
    acc.totalInvested += invested
    acc.totalCurrent += current
    acc.totalPL += pl
    return acc
  }, { totalInvested: 0, totalCurrent: 0, totalPL: 0 })

  // Added handleSell to the return object so other pages can use it
  return { stocks, loading, addStock, updateStock, deleteStock, handleSell, summary, refetch: fetchStocks }
}