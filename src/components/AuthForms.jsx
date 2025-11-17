import { useState } from 'react'

export function AuthForms({ onAuthed }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const res = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')
      localStorage.setItem('token', data.token)
      onAuthed(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('login')} className={`px-3 py-1 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-gray-100'}`}>Login</button>
        <button onClick={() => setMode('register')} className={`px-3 py-1 rounded ${mode==='register'?'bg-blue-600 text-white':'bg-gray-100'}`}>Register</button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
        )}
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded p-2 disabled:opacity-50">{loading? 'Please wait...' : (mode==='login'?'Login':'Create account')}</button>
      </form>
    </div>
  )
}
