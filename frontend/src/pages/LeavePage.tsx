import { useState } from 'react'
import toast from 'react-hot-toast'

const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave']

const mockBalance = [
  { type: 'Casual Leave',  total: 12, used: 4, remaining: 8 },
  { type: 'Sick Leave',    total: 10, used: 2, remaining: 8 },
  { type: 'Earned Leave',  total: 15, used: 5, remaining: 10 },
]

const mockRequests = [
  { id: 1, name: 'Priya Rajan',  type: 'Casual Leave',  from: '2025-06-10', to: '2025-06-12', days: 3, reason: 'Family function', status: 'pending' },
  { id: 2, name: 'Amit Kumar',   type: 'Sick Leave',    from: '2025-06-05', to: '2025-06-06', days: 2, reason: 'Fever',           status: 'approved' },
  { id: 3, name: 'Sneha Verma',  type: 'Earned Leave',  from: '2025-06-20', to: '2025-06-25', days: 6, reason: 'Vacation',        status: 'pending' },
  { id: 4, name: 'Kiran Mehta',  type: 'Casual Leave',  from: '2025-05-30', to: '2025-05-30', days: 1, reason: 'Personal work',   status: 'rejected' },
]

export default function LeavePage() {
  const [requests, setRequests] = useState(mockRequests)
  const [showApply, setShowApply] = useState(false)
  const [form, setForm] = useState({ type: LEAVE_TYPES[0], from: '', to: '', reason: '' })
  const [tab, setTab] = useState<'my' | 'all'>('all')

  const handleApply = () => {
    if (!form.from || !form.to || !form.reason) { toast.error('All fields required'); return }
    const newReq = {
      id: requests.length + 1, name: 'Admin User', type: form.type,
      from: form.from, to: form.to, reason: form.reason,
      days: Math.ceil((new Date(form.to).getTime() - new Date(form.from).getTime()) / 86400000) + 1,
      status: 'pending',
    }
    setRequests((p) => [newReq, ...p])
    toast.success('Leave request submitted')
    setShowApply(false)
    setForm({ type: LEAVE_TYPES[0], from: '', to: '', reason: '' })
  }

  const handleApprove = (id: number) => {
    setRequests((p) => p.map((r) => r.id === id ? { ...r, status: 'approved' } : r))
    toast.success('Leave approved')
  }

  const handleReject = (id: number) => {
    setRequests((p) => p.map((r) => r.id === id ? { ...r, status: 'rejected' } : r))
    toast.error('Leave rejected')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage employee leave requests</p>
        </div>
        <button onClick={() => setShowApply(true)} className="btn-primary">+ Apply Leave</button>
      </div>

      {/* Leave balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {mockBalance.map((b) => (
          <div key={b.type} className="card p-4">
            <div className="text-xs text-gray-500 mb-2">{b.type}</div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-semibold text-gray-900">{b.remaining}</span>
              <span className="text-xs text-gray-400">/ {b.total} days</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-[#1e3a5f] h-1.5 rounded-full"
                style={{ width: `${(b.remaining / b.total) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">{b.used} used</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {(['all', 'my'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm rounded-lg transition ${tab === t ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            {t === 'all' ? 'All Requests' : 'My Requests'}
          </button>
        ))}
      </div>

      {/* Requests table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Employee', 'Leave Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.type}</td>
                  <td className="px-4 py-3 text-gray-600">{r.from}</td>
                  <td className="px-4 py-3 text-gray-600">{r.to}</td>
                  <td className="px-4 py-3 text-gray-600">{r.days}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className={
                      r.status === 'approved' ? 'badge-present' :
                      r.status === 'rejected' ? 'badge-absent' : 'badge-late'
                    }>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(r.id)} className="text-xs text-green-600 hover:underline font-medium">Approve</button>
                        <button onClick={() => handleReject(r.id)} className="text-xs text-red-500 hover:underline">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">Apply for Leave</h2>
              <button onClick={() => setShowApply(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Leave Type</label>
                <select className="input" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                  {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                  <input type="date" className="input" value={form.from} onChange={(e) => setForm((p) => ({ ...p, from: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                  <input type="date" className="input" value={form.to} onChange={(e) => setForm((p) => ({ ...p, to: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
                <textarea className="input resize-none" rows={3} value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Reason for leave..." />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleApply} className="btn-primary flex-1">Submit Request</button>
              <button onClick={() => setShowApply(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
