import { useState } from 'react'
import toast from 'react-hot-toast'

interface Employee {
  id: number; name: string; email: string; department: string; role: string;
  status: 'active' | 'inactive'; joinDate: string; phone: string; manager: string;
}

const mockEmployees: Employee[] = [
  { id: 1, name: 'Priya Rajan',   email: 'priya@hr.com',  department: 'Engineering', role: 'Senior Developer',  status: 'active',   joinDate: '2022-03-15', phone: '+91 98765 43210', manager: 'Rahul Das' },
  { id: 2, name: 'Amit Kumar',    email: 'amit@hr.com',   department: 'Design',       role: 'UI/UX Designer',    status: 'active',   joinDate: '2021-07-01', phone: '+91 98765 43211', manager: 'Sneha Verma' },
  { id: 3, name: 'Sneha Verma',   email: 'sneha@hr.com',  department: 'HR',           role: 'HR Manager',        status: 'active',   joinDate: '2020-01-10', phone: '+91 98765 43212', manager: 'Admin' },
  { id: 4, name: 'Rahul Das',     email: 'rahul@hr.com',  department: 'Engineering',  role: 'Engineering Head',  status: 'active',   joinDate: '2019-06-20', phone: '+91 98765 43213', manager: 'Admin' },
  { id: 5, name: 'Kiran Mehta',   email: 'kiran@hr.com',  department: 'Finance',      role: 'Finance Analyst',   status: 'active',   joinDate: '2023-02-14', phone: '+91 98765 43214', manager: 'Sneha Verma' },
  { id: 6, name: 'Anita Singh',   email: 'anita@hr.com',  department: 'Sales',        role: 'Sales Manager',     status: 'active',   joinDate: '2021-09-01', phone: '+91 98765 43215', manager: 'Admin' },
  { id: 7, name: 'Dev Sharma',    email: 'dev@hr.com',    department: 'Engineering',  role: 'Backend Developer', status: 'inactive', joinDate: '2022-11-15', phone: '+91 98765 43216', manager: 'Rahul Das' },
]

const depts = ['All', 'Engineering', 'Design', 'HR', 'Finance', 'Sales']

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', department: 'Engineering', role: '', phone: '', manager: '' })

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.includes(search)
    const matchDept = dept === 'All' || e.department === dept
    return matchSearch && matchDept
  })

  const handleAdd = () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return }
    setEmployees((prev) => [...prev, { ...form, id: prev.length + 1, status: 'active', joinDate: new Date().toISOString().slice(0, 10) }])
    toast.success('Employee added successfully')
    setShowModal(false)
    setForm({ name: '', email: '', department: 'Engineering', role: '', phone: '', manager: '' })
  }

  const handleDelete = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
    toast.success('Employee removed')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-0.5">{employees.filter((e) => e.status === 'active').length} active employees</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Employee</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input max-w-xs"
        />
        <div className="flex gap-1.5">
          {depts.map((d) => (
            <button key={d} onClick={() => setDept(d)}
              className={`px-3 py-1.5 text-xs rounded-full border transition ${dept === d ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Employee', 'Department', 'Role', 'Phone', 'Join Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {e.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{e.name}</div>
                        <div className="text-xs text-gray-500">{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.department}</td>
                  <td className="px-4 py-3 text-gray-600">{e.role}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{e.phone}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{e.joinDate}</td>
                  <td className="px-4 py-3">
                    <span className={e.status === 'active' ? 'badge-present' : 'badge-absent'}>
                      {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(e.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">Add New Employee</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              {['name', 'email', 'role', 'phone', 'manager'].map((f) => (
                <div key={f}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{f}</label>
                  <input
                    className="input"
                    value={(form as Record<string, string>)[f]}
                    onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))}
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <select className="input" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}>
                  {depts.filter((d) => d !== 'All').map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleAdd} className="btn-primary flex-1">Add Employee</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
