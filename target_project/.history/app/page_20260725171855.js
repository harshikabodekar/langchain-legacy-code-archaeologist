'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Footer from '@/components/Footer'
import { validateLead, BUDGET_RANGES } from '@/lib/validateLead'
import { InView } from '@/components/core/in-view'

const CREAM = '#EDEBE5'
const SAGE = '#6B9B7F'
const SAGE_DARK = '#4E7A61'
const CHARCOAL = '#1A1A1A'

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', budget_range: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState('')

  const pageRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] })
  // watermark travels further/faster than the actual scroll distance — the "alive" parallax feel
  const watermarkY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerMessage('')

    const { valid, errors: fieldErrors } = validateLead(form)
    setErrors(fieldErrors)
    if (!valid) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setServerMessage(data.error || 'Something went wrong.')
        if (data.fieldErrors) setErrors(data.fieldErrors)
        return
      }

      setStatus('success')
      setForm({ name: '', email: '', budget_range: '', message: '' })
    } catch {
      setStatus('error')
      setServerMessage('Network error. Please try again.')
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: CREAM }}>
      {/* decorative blurred orbs, css only */}
      <div
        className="pointer-events-none absolute -right-24 top-10 h-105 w-105 rounded-full opacity-70"
        style={{ background: `radial-gradient(circle at 30% 30%, ${SAGE} 0%, ${SAGE_DARK} 55%, transparent 75%)`, filter: 'blur(40px)' }}
      />
      <div
        className="pointer-events-none absolute right-10 bottom-0 h-64 w-64 rounded-full opacity-40"
        style={{ background: `radial-gradient(circle at 40% 40%, #8a6a4f 0%, transparent 70%)`, filter: 'blur(30px)' }}
      />

      {/* watermark type — parallax scrolls at a different rate than the page for a "moving" feel */}
      <motion.div
        className="hidden lg:flex absolute left-0 top-[-20%] h-[140%] w-32 select-none pointer-events-none flex-col justify-around items-center overflow-hidden"
        style={{ color: `${CHARCOAL}12`, y: watermarkY }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="text-[7rem] font-black tracking-tighter whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            LEADDESK
          </span>
        ))}
      </motion.div>

      <header className="relative max-w-6xl mx-auto w-full px-6 pt-8 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight" style={{ color: CHARCOAL }}>
          LeadDesk
        </span>
        <div className="flex items-center gap-4">
          <a
          href="/admin"
            className="text-xs font-mono tracking-wide underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: CHARCOAL + '66' }}
          >
            admin &rarr;
          </a>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono tracking-wide backdrop-blur-sm"
            style={{ border: `1px solid ${CHARCOAL}22`, color: `${CHARCOAL}99`, background: `${CREAM}88` }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full"
                style={{ background: SAGE, animation: 'pulse-dot 2s ease-in-out infinite' }}
              />
            </span>
            status: receiving submissions
          </div>
        </div>
      </header>

      {/* hero: split left / right */}
      <main className="relative flex-1 max-w-6xl mx-auto w-full px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* left: typography */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[0.95]">
            <span style={{ color: SAGE }}>STOP LOSING</span>
            <br />
            <span style={{ color: CHARCOAL }}>GREAT LEADS.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed max-w-md" style={{ color: `${CHARCOAL}b3` }}>
            <span className="float-left text-6xl italic font-serif leading-[0.8] pr-2" style={{ color: SAGE }}>
              N
            </span>
            o inbox digging, no lost spreadsheet rows. Every inquiry lands in
            one place the moment someone hits send — and stays tracked from{' '}
            <em>New</em> to <em>Closed</em>.
          </p>

          <dl className="mt-10 space-y-3 font-mono text-sm">
            <div className="flex gap-4" style={{ color: `${CHARCOAL}99` }}>
              <dt style={{ color: SAGE }}>§ 01</dt>
              <dd>you send the brief</dd>
            </div>
            <div className="flex gap-4" style={{ color: `${CHARCOAL}99` }}>
              <dt style={{ color: SAGE }}>§ 02</dt>
              <dd>it lands with the team, instantly</dd>
            </div>
            <div className="flex gap-4" style={{ color: `${CHARCOAL}99` }}>
              <dt style={{ color: SAGE }}>§ 03</dt>
              <dd>we reply within one business day</dd>
            </div>
          </dl>
        </div>

        {/* right: glassmorphic form */}
        <div
          className="relative z-10 rounded-2xl p-6 sm:p-8"
          style={{
            background: 'rgba(255,255,255,0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid rgba(255,255,255,0.6)`,
            boxShadow: '0 20px 60px -20px rgba(26,26,26,0.25)',
          }}
        >
          {status === 'success' ? (
            <div className="py-8">
              <p className="font-mono text-xs tracking-wide" style={{ color: SAGE }}>
                § received
              </p>
              <p className="mt-3 text-xl font-medium" style={{ color: CHARCOAL }}>
                You&apos;re in the queue.
              </p>
              <p className="mt-2 text-sm" style={{ color: `${CHARCOAL}99` }}>
                We&apos;ll reach out at the email you gave us, within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field label="Name" error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle(errors.name)}
                  placeholder="Jane Doe"
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle(errors.email)}
                  placeholder="jane@company.com"
                />
              </Field>

              <Field label="Budget range" error={errors.budget_range}>
                <select
                  name="budget_range"
                  value={form.budget_range}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle(errors.budget_range)}
                >
                  <option value="">Select a range</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message" error={errors.message}>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                  style={inputStyle(errors.message)}
                  placeholder="What are you looking to build?"
                />
              </Field>

              {serverMessage && (
                <p className="text-sm" style={{ color: '#B3453A' }}>
                  {serverMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-md py-2.5 font-medium transition-all active:scale-[0.98] disabled:opacity-50 hover:brightness-110"
                style={{ background: SAGE, color: '#FBFAF8' }}
              >
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* scroll-reveal section */}
      <section className="relative max-w-6xl mx-auto w-full px-6 py-20">
        <InView
          variants={{
            hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewOptions={{ margin: '0px 0px -150px 0px' }}
        >
          <p className="font-mono text-sm tracking-wide" style={{ color: SAGE }}>
            § why leaddesk
          </p>
          <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-2xl leading-[1.05]" style={{ color: CHARCOAL }}>
            Built for teams that hate letting a good lead go cold.
          </h2>
        </InView>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <InView
            as="div"
            variants={{ hidden: { opacity: 0, y: 70, scale: 0.85, filter: 'blur(6px)' }, visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewOptions={{ margin: '0px 0px -120px 0px' }}
          >
            <Card
              tag="§ 01"
              title="Nothing slips through."
              body="Every submission is written straight to the database the moment it's sent — validated twice, stored once, visible instantly."
            />
          </InView>
          <InView
            as="div"
            variants={{ hidden: { opacity: 0, x: 140, filter: 'blur(6px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
            viewOptions={{ margin: '0px 0px -120px 0px' }}
          >
            <Card
              tag="§ 02"
              title="One glance, full picture."
              body="Search by name, email, or message. Every lead's status — New, Contacted, Closed — updates the moment you click, no page reload."
            />
          </InView>
          <InView
            as="div"
            variants={{ hidden: { opacity: 0, scale: 1.25, filter: 'blur(8px)' }, visible: { opacity: 1, scale: 1, filter: 'blur(0px)' } }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.24 }}
            viewOptions={{ margin: '0px 0px -120px 0px' }}
          >
            <Card
              tag="§ 03"
              title="Locked down, properly."
              body="The admin desk sits behind real authentication, not a shared password — and the database itself refuses to hand over a single row to anyone who isn't signed in."
            />
          </InView>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Card({ tag, title, body }) {
  return (
    <div
      className="rounded-xl p-7 h-full"
      style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${CHARCOAL}12`, backdropFilter: 'blur(8px)' }}
    >
      <p className="font-mono text-xs" style={{ color: SAGE }}>{tag}</p>
      <p className="mt-3 text-xl font-semibold" style={{ color: CHARCOAL }}>{title}</p>
      <p className="mt-2.5 text-base leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{body}</p>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span
        className="block text-xs font-mono uppercase tracking-wide mb-1.5"
        style={{ color: `${CHARCOAL}80` }}
      >
        {label}
      </span>
      {children}
      {error && (
        <span className="block text-sm mt-1" style={{ color: '#B3453A' }}>
          {error}
        </span>
      )}
    </label>
  )
}

const inputClass = 'w-full rounded-md px-3 py-2 outline-none transition-colors'

function inputStyle(error) {
  return {
    background: 'rgba(255,255,255,0.6)',
    color: CHARCOAL,
    border: `1px solid ${error ? '#B3453A99' : 'rgba(26,26,26,0.15)'}`,
  }
}