'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Footer from '@/components/Footer'

const CREAM = '#E8E6E1'
const SAGE = '#6B9B7F'
const CHARCOAL = '#1A1A1A'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError('Invalid email or password.')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: CREAM }}>
      <main className="flex-1 flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-lg p-8"
          style={{ background: '#FBFAF8', border: `1px solid ${CHARCOAL}14` }}
        >
          <h1 className="text-xl font-semibold" style={{ color: SAGE }}>Admin login</h1>
          <p className="text-sm mt-1" style={{ color: `${CHARCOAL}99` }}>Sign in to manage leads.</p>

          <label className="block mt-6">
            <span className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: `${CHARCOAL}80` }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md px-3 py-2 outline-none"
              style={{ background: '#FFFFFF', color: CHARCOAL, border: `1px solid ${CHARCOAL}22` }}
            />
          </label>

          <label className="block mt-4">
            <span className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: `${CHARCOAL}80` }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md px-3 py-2 outline-none"
              style={{ background: '#FFFFFF', color: CHARCOAL, border: `1px solid ${CHARCOAL}22` }}
            />
          </label>

          {error && <p className="text-sm mt-3" style={{ color: '#B3453A' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-md py-2.5 font-medium transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: SAGE, color: '#FBFAF8' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
