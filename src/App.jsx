import { useEffect, useState } from 'react'
import { AuthForms } from './components/AuthForms'
import { SyllabusForm } from './components/SyllabusForm'
import { SyllabusList } from './components/SyllabusList'
import { AIForm } from './components/AIForm'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setSession({ token })
  }, [])

  const logout = () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const token = localStorage.getItem('token')
    fetch(baseUrl + '/auth/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } })
    localStorage.removeItem('token')
    setSession(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="sticky top-0 backdrop-blur border-b bg-white/60">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <div className="font-bold">Syllabus SaaS</div>
          <nav className="flex items-center gap-3 text-sm">
            {session ? (
              <>
                <span className="text-gray-600 hidden sm:inline">Logged in</span>
                <button onClick={logout} className="px-3 py-1 bg-gray-100 rounded">Logout</button>
              </>
            ) : (
              <span className="text-gray-500">Please login</span>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 grid gap-6 md:grid-cols-2">
        {!session && (
          <div className="md:col-span-2 flex justify-center">
            <AuthForms onAuthed={() => setSession({ token: localStorage.getItem('token') })} />
          </div>
        )}

        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-3">Create a syllabus</h2>
          <SyllabusForm onCreated={() => {}} />
        </section>

        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-3">Your syllabuses</h2>
          <SyllabusList />
        </section>

        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-3">AI assistant</h2>
          <AIForm />
        </section>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">Built with ❤️</footer>
    </div>
  )
}

export default App
