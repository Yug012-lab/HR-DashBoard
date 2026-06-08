import { useState } from 'react'
import toast from 'react-hot-toast'

const mockPayroll = [
  { id: 1, name: 'Priya Rajan',  dept: 'Engineering', month: 'May 2025', basic: 80000, hra: 32000, pf: 9600,  tax: 8000, net: 94400, status: 'paid' },
  { id: 2, name: 'Amit Kumar',   dept: 'Design',       month: 'May 2025', basic: 60000, hra: 24000, pf: 7200,  tax: 5500, net: 71300, status: 'paid' },
  { id: 3, name: 'Sneha Verma',  dept: 'HR',           month: 'May 2025', basic: 70000, hra: 28000, pf: 8400,  tax: 7000, net: 82600, status: 'paid' },
  { id: 4, name: 'Rahul Das',    dept: 'Engineering', month: 'May 2025', basic: 120000, hra: 48000, pf: 14400, tax: 15000, net: 138600, status: 'paid' },
  { id: 5, name: 'Kiran Mehta',  dept: 'Finance',      month: 'May 2025', basic: 55000, hra: 22000, pf: 6600,  tax: 4500, net: 65900, status: 'processing' },
]

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function PayrollPage() {
  const [payroll] = useState(mockPayroll)
  const [month, setMonth] = useState('May 2025')

  const totalNet = payroll.reduce((s, p) => s + p.net, 0)
  const totalPF  = payroll.reduce((s, p) => s + p.pf, 0)
  const totalTax = payroll.reduce((s, p) => s + p.tax, 0)

  const handleDownload = (id: number) => {
    toast.success(`Payslip downloaded for record ${id}`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-500 mt-0.5">Salary processing and payslip management</p>
        </div>
        <div className="flex gap-2">
          <select className="input max-w-xs text-sm" value={month} onChange={(e) => setMonth(e.target.value)}>
            {['May 2025', 'Apr 2025', 'Mar 2025'].map((m) => <option key={m}>{m}</option>)}
          </select>
          <button className="btn-primary" onClick={() => toast.success('Payroll generated!')}>
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Payout',  value: fmt(totalNet),  color: 'text-[#1e3a5f]' },
          { label: 'Total PF',      value: fmt(totalPF),   color: 'text-orange-600' },
          { label: 'Total Tax',     value: fmt(totalTax),  color: 'text-red-600' },
          { label: 'Employees',     value: payroll.length, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={`text-xl font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">{month} — Payroll Details</h3>
          <button className="btn-secondary text-xs px-3 py-1.5">Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Employee', 'Dept', 'Basic', 'HRA', 'PF Deduct', 'Tax', 'Net Pay', 'Status', 'Payslip'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payroll.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.dept}</td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{fmt(p.basic)}</td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{fmt(p.hra)}</td>
                  <td className="px-4 py-3 text-red-600 font-mono text-xs">−{fmt(p.pf)}</td>
                  <td className="px-4 py-3 text-red-600 font-mono text-xs">−{fmt(p.tax)}</td>
                  <td className="px-4 py-3 text-[#1e3a5f] font-semibold font-mono text-xs">{fmt(p.net)}</td>
                  <td className="px-4 py-3">
                    <span className={p.status === 'paid' ? 'badge-present' : 'badge-late'}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDownload(p.id)} className="text-xs text-blue-600 hover:underline">
                      ↓ Download
                    </button>
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
