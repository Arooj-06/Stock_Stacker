export default function WeeklyReport() {
  // Static example for now - you can connect this to the performance_history table later
  const reports = [
    { date: 'Mar 27, 2026', myGrowth: '+5.2%', kseGrowth: '-0.79%', status: 'Beating Market' }
  ]

  return (
    <div>
      <div className="page-header">
        <h1>Weekly Report</h1>
        <p>Compare your portfolio growth against the KSE-100 Index</p>
      </div>
      <div className="section-card">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>Week Ending</th>
              <th>My Growth</th>
              <th>KSE-100</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td className="profit-cell">{r.myGrowth}</td>
                <td className="loss-cell">{r.kseGrowth}</td>
                <td style={{ fontWeight: 600, color: 'var(--emerald)' }}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}