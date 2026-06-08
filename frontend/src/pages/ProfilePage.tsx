import { useAuthStore } from '../store/authStore'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#1e3a5f] text-white text-xl font-semibold flex items-center justify-center">
          {user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{user?.name}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1 inline-block">{user?.role}</span>
        </div>
      </div>
      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Account Details</h2>
        {[['Full Name', user?.name], ['Email', user?.email], ['Role', user?.role], ['Department', user?.department || 'Not assigned']].map(([label, val]) => (
          <div key={label as string} className="flex justify-between text-sm border-b border-gray-50 pb-3">
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-900 font-medium">{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
