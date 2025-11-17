import { useState } from 'react'

export function SyllabusForm({ onCreated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')

  const [title, setTitle] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [description, setDescription] = useState('')
  const [objectives, setObjectives] = useState('')
  const [level, setLevel] = useState('')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState(12)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        title,
        course_code: courseCode || null,
        description: description || null,
        objectives: objectives ? objectives.split('\n').map(s=>s.trim()).filter(Boolean) : [],
        level: level || null,
        subject: subject || null,
        duration_weeks: Number(duration) || null,
        weeks: []
      }
      const res = await fetch(baseUrl + '/syllabi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to save')
      onCreated(data)
      setTitle(''); setCourseCode(''); setDescription(''); setObjectives(''); setLevel(''); setSubject(''); setDuration(12)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-3">
      <div>
        <label className="block text-sm font-medium">Course title</label>
        <input className="w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Course code</label>
          <input className="w-full border rounded p-2" value={courseCode} onChange={e=>setCourseCode(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Level</label>
          <input className="w-full border rounded p-2" value={level} onChange={e=>setLevel(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Subject</label>
          <input className="w-full border rounded p-2" value={subject} onChange={e=>setSubject(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration (weeks)</label>
          <input type="number" className="w-full border rounded p-2" value={duration} onChange={e=>setDuration(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="w-full border rounded p-2" rows={3} value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Objectives (one per line)</label>
        <textarea className="w-full border rounded p-2" rows={4} value={objectives} onChange={e=>setObjectives(e.target.value)} placeholder="Understand X\nApply Y\nBuild Z" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button disabled={saving} className="w-full bg-emerald-600 text-white rounded p-2 disabled:opacity-50">{saving? 'Saving...' : 'Save syllabus'}</button>
    </form>
  )
}
