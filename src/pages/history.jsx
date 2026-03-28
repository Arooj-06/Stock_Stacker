import { useStocks } from '../hooks/useStocks'

const fmt = (n) => Number(n).toLocaleString('en-PK', { minimumFractionDigits: 2 })

export default function History() {
  const { stocks, loading } = useStocks()
  const soldStocks = stocks.filter(s => s.status === 'sold')

  return (
    <div>
      <div className="page-header">
        <h1>Trade History</h1>
        <p>A record of your closed positions and realized P&L</p>
      </div>

      <div className="section-card">
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="stocks-table-wrap">
            <table className="stocks-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Qty Sold</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                  <th>Profit/Loss</th>
                  <th>Sell Date</th>
                </tr>
              </thead>
              <tbody>
                {soldStocks.map(stock => {
                  const profit = (Number(stock.sell_price) - Number(stock.buy_price)) * Number(stock.quantity)
                  return (
                    <tr key={stock.id}>
                      <td className="stock-symbol">{stock.symbol}</td>
                      <td>{Number(stock.quantity).toLocaleString()}</td>
                      <td>{fmt(stock.buy_price)}</td>
                      <td>{fmt(stock.sell_price)}</td>
                      <td className={profit >= 0 ? 'profit-cell' : 'loss-cell'}>
                        {profit >= 0 ? '+' : ''}{fmt(profit)}
                      </td>
                      <td>{new Date(stock.sell_date).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}