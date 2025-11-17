import { useState } from 'react'

export function AIForm() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const [courseTitle, setCourseTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [goals, setGoals] = useState('')
  const [constraints, setConstraints] = useState('')
  const [loading, setLoading] = useState(false)
  const [resp, setResp] = useState(null)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResp(null)
    try {
      const payload = {
        course_title: courseTitle,
        subject: subject || null,
        level: level || null,
        goals: goals ? goals.split('\n').map(s=>s.trim()).filter(Boolean) : [],
        constraints: constraints || null
      }
      const res = await fetch(baseUrl + '/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setResp(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) return <div className="bg-white shadow rounded-lg p-6">Login to use the AI assistant.</div>

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Course title</label>
          <input className="w-full border rounded p-2" value={courseTitle} onChange={e=>setCourseTitle(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input className="w-full border rounded p-2" value={subject} onChange={e=>setSubject(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Level</label>
            <input className="w-full border rounded p-2" value={level} onChange={e=>setLevel(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Goals (one per line)</label>
          <textarea className="w-full border rounded p-2" rows={4} value={goals} onChange={e=>setGoals(e.target.value)} placeholder="Understand fundamentals\nBuild a project\nPrepare for exam" />
        </div>
        <div>
          <label className="block text-sm font-medium">Constraints</label>
          <input className="w-full border rounded p-2" value={constraints} onChange={e=>setConstraints(e.target.value)} placeholder="e.g., 8 weeks, 2h/week" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded p-2 disabled:opacity-50">{loading? 'Thinking...' : 'Generate outline'}</button>
      </form>

      {resp && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Composed prompt</h3>
          <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded border text-sm">{resp.prompt}</pre>
          <h3 className="text-lg font-semibold mt-4 mb-2">Suggested outline</h3>
          <ol className="list-decimal pl-6 space-y-1">
            {resp.outline.map((t, idx) => <li key={idx}>{t}</li>)}
          </ol>
        </div>
      )}
    </div>
  )
}
