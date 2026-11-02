'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const STATUSES = ['New', 'Contacted', 'Closed']
const STATUS_STYLES = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  Closed: 'bg-emerald-100 text-emerald-700',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  async function loadLeads() {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Could not load leads.')
    } else {
      setLeads(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    let active = true

    async function initialLoad() {
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return

      if (fetchError) {
        setError('Could not load leads.')
      } else {
        setLeads(data)
      }
      setLoading(false)
    }

    void initialLoad()

    return () => {
      active = false
    }
  }, [])

  async function updateStatus(id, status) {
    // optimistic update
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    const { error: updateError } = await supabase.from('leads').update({ status }).eq('id', id)
    if (updateError) {
      setError('Could not update status, refresh and try again.')
      loadLeads()
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return leads
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
    )
  }, [leads, search])

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, email, or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            onClick={handleSignOut}
            className="rounded-md px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {loading ? (
        <p className="text-slate-500 mt-8">Loading leads…</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-500 mt-8">No leads found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="px-4 py-3 text-slate-900 whitespace-nowrap">{lead.name}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{lead.email}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{lead.budget_range}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs">{lead.message}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-slate-400 ${STATUS_STYLES[lead.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}