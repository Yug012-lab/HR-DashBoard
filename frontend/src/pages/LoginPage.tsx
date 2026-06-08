import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authApi } from '../lib/api'
import { useAuthStore } from '../store/authStore'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true)
      const res = await authApi.login(data.email, data.password)
      setAuth(res.data.token, res.data.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1e3a5f] text-white p-12">
        <div>
          <div className="text-xl font-semibold">HR Dashboard</div>
          <div className="text-sm text-white/50 mt-1">Enterprise HR Management</div>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-snug mb-4">
            Manage your workforce<br />smarter with AI
          </h2>
          <div className="space-y-3 text-sm text-white/70">
            {['AI Selfie Attendance', 'Location Verification', 'Payroll & Leave Management', 'Real-time Analytics'].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span className="text-green-400">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-white/30">© 2025 HR Dashboard. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="text-2xl font-bold text-[#1e3a5f]">HR Dashboard</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="admin@hrdashboard.com"
                className="input"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="••••••••"
                className="input"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">Default credentials</p>
            <p className="text-xs text-blue-600 mt-0.5">admin@hrdashboard.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
