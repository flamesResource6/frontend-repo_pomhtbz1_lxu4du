import { useEffect, useState } from 'react'

export function SyllabusList() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(baseUrl + '/syllabi', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load')
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (!token) return <div className="text-sm text-gray-500">Login to view your syllabuses.</div>

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Your syllabuses</h3>
        <button onClick={load} className="text-sm px-3 py-1 bg-gray-100 rounded">Refresh</button>
      </div>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <ul className="space-y-3">
        {items.map(it => (
          <li key={it.id} className="border rounded p-3">
            <div className="font-semibold">{it.title} {it.course_code && <span className="text-gray-500 text-sm">({it.course_code})</span>}</div>
            <div className="text-sm text-gray-600">{it.subject || 'General'} • {it.level || 'Mixed'} • {it.duration_weeks ? `${it.duration_weeks} weeks` : 'N/A'}</div>
            {it.objectives && it.objectives.length > 0 && (
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                {it.objectives.slice(0,3).map((o,idx)=> <li key={idx}>{o}</li>)}
              </ul>
            )}
          </li>
        ))}
        {(!loading && items.length === 0) && <li className="text-gray-500 text-sm">No syllabuses yet.</li>}
      </ul>
    </div>
  )
}
