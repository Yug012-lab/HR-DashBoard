import toast from 'react-hot-toast'

export default function SettingsPage() {
  const sections = [
    { title: 'Attendance Rules', items: ['Work start time: 9:00 AM', 'Late threshold: 15 minutes', 'Overtime threshold: after 9 hours'] },
    { title: 'Leave Policies', items: ['Annual casual leave: 12 days', 'Annual sick leave: 10 days', 'Annual earned leave: 15 days'] },
    { title: 'Payroll Settings', items: ['PF rate: 12% of basic', 'ESI: 0.75% of gross', 'Tax: per slab'] },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      {sections.map((s) => (
        <div key={s.title} className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">{s.title}</h2>
          <div className="space-y-2">
            {s.items.map((item) => (
              <div key={item} className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-600">{item}</span>
                <button onClick={() => toast.success('Edit mode coming soon')} className="text-xs text-blue-600 hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Notifications</h2>
        {['Email notifications', 'Check-in reminders', 'Leave approval alerts', 'Payroll release alerts'].map((n) => (
          <div key={n} className="flex items-center justify-between py-2.5 border-b border-gray-50 text-sm">
            <span className="text-gray-600">{n}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[#1e3a5f] rounded-full peer transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform" />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
