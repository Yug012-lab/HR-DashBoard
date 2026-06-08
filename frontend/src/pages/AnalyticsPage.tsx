import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'

const trend = [
  { month: 'Jan', attendance: 88, satisfaction: 72, productivity: 80 },
  { month: 'Feb', attendance: 85, satisfaction: 74, productivity: 78 },
  { month: 'Mar', attendance: 91, satisfaction: 78, productivity: 85 },
  { month: 'Apr', attendance: 89, satisfaction: 75, productivity: 82 },
  { month: 'May', attendance: 93, satisfaction: 80, productivity: 88 },
  { month: 'Jun', attendance: 81, satisfaction: 76, productivity: 84 },
]

const deptPerf = [
  { dept: 'Engineering', score: 92, employees: 85 },
  { dept: 'Design',      score: 87, employees: 30 },
  { dept: 'Sales',       score: 78, employees: 65 },
  { dept: 'Finance',     score: 89, employees: 28 },
  { dept: 'HR',          score: 95, employees: 20 },
  { dept: 'Operations',  score: 82, employees: 20 },
]

const leaveBreakdown = [
  { name: 'Casual Leave', value: 34 },
  { name: 'Sick Leave',   value: 22 },
  { name: 'Earned Leave', value: 28 },
  { name: 'Other',        value: 16 },
]

const COLORS = ['#1e3a5f', '#3b82f6', '#10b981', '#f59e0b']

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Workforce insights and performance metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg Attendance Rate', value: '88%',  change: '+3%',  up: true  },
          { label: 'Attrition Rate',      value: '4.2%', change: '-0.8%', up: true  },
          { label: 'Avg Satisfaction',    value: '76%',  change: '+4%',  up: true  },
          { label: 'Productivity Score',  value: '83%',  change: '+2%',  up: true  },
        ].map((k) => (
          <div key={k.label} className="card p-4">
            <div className="text-xs text-gray-500 mb-1">{k.label}</div>
            <div className="text-2xl font-semibold text-gray-900">{k.value}</div>
            <div className={`text-xs font-medium mt-1 ${k.up ? 'text-green-600' : 'text-red-500'}`}>{k.change} vs last month</div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="card p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">6-Month Workforce Trends</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="attendance"   name="Attendance %"   stroke="#1e3a5f" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="satisfaction" name="Satisfaction %"  stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="productivity" name="Productivity %"  stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dept performance */}
        <div className="card p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Department Performance Score</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptPerf} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11 }} width={75} />
              <Tooltip />
              <Bar dataKey="score" name="Score" fill="#1e3a5f" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Leave Type Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leaveBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {leaveBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">🤖 AI Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: 'Attendance Anomaly', desc: 'Engineering dept showed 15% drop on Mondays. Possible flex-work pattern.', type: 'warning' },
            { title: 'High Attrition Risk', desc: '3 employees have not taken any leave in 6+ months — burnout risk.', type: 'danger' },
            { title: 'Productivity Spike',  desc: 'HR dept shows highest productivity improvement — 12% above average.', type: 'success' },
          ].map((insight) => (
            <div key={insight.title} className={`rounded-lg p-4 border ${
              insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              insight.type === 'danger'  ? 'bg-red-50 border-red-200' :
                                           'bg-green-50 border-green-200'
            }`}>
              <div className={`text-xs font-semibold mb-1 ${
                insight.type === 'warning' ? 'text-yellow-800' :
                insight.type === 'danger'  ? 'text-red-800' :
                                              'text-green-800'
              }`}>{insight.title}</div>
              <div className="text-xs text-gray-600">{insight.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
