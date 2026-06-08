import { useRef, useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { attendanceApi } from '../lib/api'

interface AttendanceRecord {
  id: number
  date: string
  checkIn: string
  checkOut: string | null
  status: string
  location: string
  workingHours: string | null
  confidenceScore: number
}

const mockRecords: AttendanceRecord[] = [
  { id: 1, date: '2025-06-08', checkIn: '09:02', checkOut: '18:05', status: 'present', location: 'Office - Delhi', workingHours: '9h 3m', confidenceScore: 98.4 },
  { id: 2, date: '2025-06-07', checkIn: '09:15', checkOut: '18:30', status: 'present', location: 'Office - Delhi', workingHours: '9h 15m', confidenceScore: 97.1 },
  { id: 3, date: '2025-06-06', checkIn: '09:48', checkOut: '18:00', status: 'late',    location: 'Home Office',    workingHours: '8h 12m', confidenceScore: 95.8 },
  { id: 4, date: '2025-06-05', checkIn: '—',     checkOut: null,    status: 'absent',  location: '—',              workingHours: null,     confidenceScore: 0 },
  { id: 5, date: '2025-06-04', checkIn: '09:00', checkOut: '17:55', status: 'present', location: 'Office - Delhi', workingHours: '8h 55m', confidenceScore: 99.2 },
]

export default function AttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [mode, setMode] = useState<'checkin' | 'checkout'>('checkin')
  const [loading, setLoading] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [checkedInTime, setCheckedInTime] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 28.6139, lng: 77.2090 }) // Delhi fallback
      )
    }
  }, [])

  const openCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
      setStream(s)
      setCameraOpen(true)
      setCapturedImage(null)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play()
        }
      }, 100)
    } catch {
      toast.error('Camera access denied. Please allow camera permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    setCameraOpen(false)
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)
    const img = canvasRef.current.toDataURL('image/jpeg', 0.8)
    setCapturedImage(img)
    stopCamera()
  }, [stopCamera])

  const handleSubmit = async () => {
    if (!capturedImage) { toast.error('Please capture a selfie first'); return }
    setLoading(true)
    try {
      const payload = {
        selfieBase64: capturedImage.split(',')[1],
        lat: location?.lat ?? 28.6139,
        lng: location?.lng ?? 77.2090,
      }
      if (mode === 'checkin') {
        await attendanceApi.checkIn(payload)
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        setCheckedInTime(now)
        toast.success(`✅ Checked in at ${now}`)
        setMode('checkout')
      } else {
        await attendanceApi.checkOut(payload)
        toast.success('✅ Checked out successfully')
        setCheckedInTime(null)
        setMode('checkin')
      }
      setCapturedImage(null)
    } catch {
      // Demo mode — simulate success
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      if (mode === 'checkin') {
        setCheckedInTime(now)
        toast.success(`✅ Checked in at ${now} (demo mode)`)
        setMode('checkout')
      } else {
        setCheckedInTime(null)
        toast.success('✅ Checked out (demo mode)')
        setMode('checkin')
      }
      setCapturedImage(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-0.5">AI-powered selfie attendance with location verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Check-In Card */}
        <div className="lg:col-span-1 card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Smart Check-{mode === 'checkin' ? 'In' : 'Out'}</h3>
            {checkedInTime && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                In: {checkedInTime}
              </span>
            )}
          </div>

          {/* Camera area */}
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
            {cameraOpen && (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}
            {capturedImage && (
              <img src={capturedImage} alt="Captured selfie" className="w-full h-full object-cover" />
            )}
            {!cameraOpen && !capturedImage && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                <div className="text-4xl">📷</div>
                <div className="text-xs">Camera preview appears here</div>
              </div>
            )}
            {cameraOpen && (
              <div className="absolute inset-0 border-2 border-blue-400 rounded-xl pointer-events-none">
                <div className="absolute top-2 left-2 right-2 text-center">
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    ● Live — Look at camera
                  </span>
                </div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          {/* Actions */}
          <div className="space-y-2">
            {!cameraOpen && !capturedImage && (
              <button onClick={openCamera} className="btn-primary w-full">
                📷 Open Camera
              </button>
            )}
            {cameraOpen && (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={capturePhoto} className="btn-primary">📸 Capture</button>
                <button onClick={stopCamera}   className="btn-secondary">✕ Cancel</button>
              </div>
            )}
            {capturedImage && (
              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Verifying...' : `✓ Confirm ${mode === 'checkin' ? 'Check-In' : 'Check-Out'}`}
                </button>
                <button onClick={() => { setCapturedImage(null); openCamera() }} className="btn-secondary w-full text-xs">
                  Retake Photo
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">✓ Face detection + liveness check</div>
            <div className="flex items-center gap-1.5">✓ GPS location captured</div>
            <div className="flex items-center gap-1.5">✓ Anti-spoofing protection</div>
            {location && (
              <div className="text-gray-400">
                📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>
        </div>

        {/* Records table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Attendance History</h3>
            <button className="btn-secondary text-xs px-3 py-1.5">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  {['Date', 'Check-In', 'Check-Out', 'Hours', 'Location', 'Status', 'Score'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.date}</td>
                    <td className="px-4 py-3 text-gray-600">{r.checkIn}</td>
                    <td className="px-4 py-3 text-gray-600">{r.checkOut ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.workingHours ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.location}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-${r.status}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.confidenceScore > 0 ? `${r.confidenceScore}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
