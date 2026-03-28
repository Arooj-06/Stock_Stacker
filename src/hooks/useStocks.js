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

  return { stocks, loading, addStock, updateStock, deleteStock, summary, refetch: fetchStocks }
}
