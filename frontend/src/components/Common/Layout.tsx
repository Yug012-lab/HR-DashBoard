import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { label: 'Dashboard',    to: '/dashboard',   icon: '⊞' },
  { label: 'Attendance',   to: '/attendance',  icon: '⏱' },
  { label: 'Employees',    to: '/employees',   icon: '👥' },
  { label: 'Leave',        to: '/leave',       icon: '📅' },
  { label: 'Payroll',      to: '/payroll',     icon: '💰' },
  { label: 'Analytics',    to: '/analytics',   icon: '📊' },
  { label: 'Performance',  to: '/performance', icon: '🎯' },
  { label: 'Recruitment',  to: '/recruitment', icon: '🧑‍💼' },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-[#1e3a5f] text-white">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="text-base font-semibold tracking-tight">HR Dashboard</div>
          <div className="text-xs text-white/40 mt-0.5">Enterprise v1.0</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-white/15 text-white font-medium border-l-2 border-blue-400'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/10 transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-blue-400/30 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-white/40 truncate">{user?.role}</div>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-1 text-xs text-white/40 hover:text-white py-1.5 px-2 rounded-lg hover:bg-white/10 transition text-left"
          >
            → Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="text-sm text-gray-500">
            Welcome back, <span className="font-medium text-gray-900">{user?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
              ● System Online
            </span>
            <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-semibold">
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
