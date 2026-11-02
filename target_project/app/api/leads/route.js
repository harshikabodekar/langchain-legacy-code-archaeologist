import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateLead } from '@/lib/validateLead'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { valid, errors, clean } = validateLead(body)
  if (!valid) {
    return NextResponse.json({ error: 'Validation failed.', fieldErrors: errors }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase.from('leads').insert({
    name: clean.name,
    email: clean.email,
    budget_range: clean.budget_range,
    message: clean.message,
    status: 'New',
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Could not save lead. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
