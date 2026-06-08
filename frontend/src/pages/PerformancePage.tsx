export default function PerformancePage() {
  const data = [
    { name: 'Priya Rajan',  attendance: 96, productivity: 92, kpi: 88, overall: 92 },
    { name: 'Amit Kumar',   attendance: 88, productivity: 85, kpi: 90, overall: 88 },
    { name: 'Sneha Verma',  attendance: 91, productivity: 89, kpi: 94, overall: 91 },
    { name: 'Rahul Das',    attendance: 95, productivity: 96, kpi: 95, overall: 95 },
    { name: 'Kiran Mehta',  attendance: 84, productivity: 80, kpi: 82, overall: 82 },
  ]

  const bar = (val: number) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className="bg-[#1e3a5f] h-1.5 rounded-full" style={{ width: `${val}%` }} />
      </div>
      <span className="text-xs text-gray-600 w-8 text-right">{val}%</span>
    </div>
  )

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">Performance</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Employee', 'Attendance Score', 'Productivity', 'KPI Achievement', 'Overall'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((d) => (
                <tr key={d.name} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-900">{d.name}</td>
                  <td className="px-4 py-4 w-40">{bar(d.attendance)}</td>
                  <td className="px-4 py-4 w-40">{bar(d.productivity)}</td>
                  <td className="px-4 py-4 w-40">{bar(d.kpi)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      d.overall >= 90 ? 'bg-green-100 text-green-800' :
                      d.overall >= 80 ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                    }`}>{d.overall}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
