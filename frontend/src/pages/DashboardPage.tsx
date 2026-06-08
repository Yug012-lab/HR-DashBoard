import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { analyticsApi } from '../lib/api'

const COLORS = ['#1e3a5f', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const mockStats = {
  totalEmployees: 248, presentToday: 201, onLeave: 18, lateArrivals: 12,
  attendanceRate: 81, newJoinees: 3,
}

const mockTrend = [
  { month: 'Jan', present: 220, absent: 28 },
  { month: 'Feb', present: 215, absent: 33 },
  { month: 'Mar', present: 230, absent: 18 },
  { month: 'Apr', present: 225, absent: 23 },
  { month: 'May', present: 235, absent: 13 },
  { month: 'Jun', present: 201, absent: 47 },
]

const mockDept = [
  { name: 'Engineering', value: 92 },
  { name: 'Design', value: 85 },
  { name: 'Sales', value: 78 },
  { name: 'Finance', value: 88 },
  { name: 'HR', value: 95 },
]

const mockActivity = [
  { name: 'Priya Rajan',    time: '9:02 AM', action: 'Checked In',  status: 'present' },
  { name: 'Amit Kumar',     time: '9:15 AM', action: 'Checked In',  status: 'present' },
  { name: 'Sneha Verma',    time: '9:48 AM', action: 'Late Check-In', status: 'late' },
  { name: 'Rahul Das',      time: '—',       action: 'Absent',       status: 'absent' },
  { name: 'Kiran Mehta',    time: '9:01 AM', action: 'Checked In',  status: 'present' },
]

function StatCard({ label, value, sub, color = 'blue' }: { label: string; value: string | number; sub?: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-800', green: 'bg-green-50 text-green-800',
    yellow: 'bg-yellow-50 text-yellow-800', red: 'bg-red-50 text-red-800',
  }
  return (
    <div className="card p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {sub && <div className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full inline-block ${colors[color]}`}>{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const [stats] = useState(mockStats)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of today's workforce status</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Employees" value={stats.totalEmployees} sub={`+${stats.newJoinees} this month`} color="blue" />
        <StatCard label="Present Today"   value={stats.presentToday}   sub={`${stats.attendanceRate}% rate`}     color="green" />
        <StatCard label="On Leave"        value={stats.onLeave}        sub="Approved"                            color="yellow" />
        <StatCard label="Late Arrivals"   value={stats.lateArrivals}   sub="+2 from yesterday"                   color="red" />
        <StatCard label="Absent"          value={248 - 201 - 18 - 12}  sub="No check-in"                         color="red" />
        <StatCard label="Attendance Rate" value={`${stats.attendanceRate}%`} sub="This month"                    color="green" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance trend */}
        <div className="card p-4 lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-4">6-Month Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockTrend} barSize={24} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" name="Present" fill="#1e3a5f" radius={[3,3,0,0]} />
              <Bar dataKey="absent"  name="Absent"  fill="#bfdbfe" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dept attendance */}
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Dept Attendance %</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={mockDept} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                {mockDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity table */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700">Today's Activity</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {mockActivity.map((row, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center text-xs font-semibold">
                  {row.name.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{row.name}</div>
                  <div className="text-xs text-gray-500">{row.action}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{row.time}</span>
                <span className={`badge-${row.status}`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
