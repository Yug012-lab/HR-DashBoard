import { useState } from 'react'
import toast from 'react-hot-toast'

const mockJobs = [
  { id: 1, title: 'Senior React Developer', dept: 'Engineering', openings: 2, applications: 28, status: 'active' },
  { id: 2, title: 'UI/UX Designer',         dept: 'Design',       openings: 1, applications: 15, status: 'active' },
  { id: 3, title: 'HR Business Partner',    dept: 'HR',           openings: 1, applications: 9,  status: 'active' },
  { id: 4, title: 'Finance Analyst',        dept: 'Finance',      openings: 1, applications: 22, status: 'closed' },
]

const mockCandidates = [
  { id: 1, name: 'Arjun Nair',    job: 'Senior React Developer', stage: 'Technical Interview', score: 88, applied: '2025-05-20' },
  { id: 2, name: 'Meera Pillai',  job: 'UI/UX Designer',         stage: 'Portfolio Review',    score: 82, applied: '2025-05-22' },
  { id: 3, name: 'Vikram Rao',    job: 'Senior React Developer', stage: 'HR Round',            score: 91, applied: '2025-05-18' },
  { id: 4, name: 'Preethi Kumar', job: 'Finance Analyst',        stage: 'Offer Extended',      score: 87, applied: '2025-05-15' },
]

const STAGES = ['Applied', 'Screening', 'Portfolio Review', 'Technical Interview', 'HR Round', 'Offer Extended', 'Hired']

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState(mockCandidates)

  const advance = (id: number) => {
    setCandidates((prev) => prev.map((c) => {
      if (c.id !== id) return c
      const idx = STAGES.indexOf(c.stage)
      if (idx < STAGES.length - 1) { toast.success('Stage advanced'); return { ...c, stage: STAGES[idx + 1] } }
      return c
    }))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Recruitment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Hiring pipeline and candidate tracking</p>
        </div>
        <button className="btn-primary" onClick={() => toast.success('Job posting form coming soon')}>+ Post Job</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {mockJobs.map((j) => (
          <div key={j.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900 leading-snug">{j.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${j.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {j.status}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-3">{j.dept} · {j.openings} opening{j.openings > 1 ? 's' : ''}</div>
            <div className="text-2xl font-semibold text-[#1e3a5f]">{j.applications}</div>
            <div className="text-xs text-gray-500">applications</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700">Candidate Pipeline</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Candidate', 'Applied For', 'Current Stage', 'AI Score', 'Applied', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center text-xs font-semibold">
                        {c.name.slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.job}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{c.stage}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold text-sm ${c.score >= 90 ? 'text-green-600' : c.score >= 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {c.score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.applied}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => advance(c.id)} className="text-xs text-[#1e3a5f] hover:underline font-medium">
                      Advance Stage →
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
