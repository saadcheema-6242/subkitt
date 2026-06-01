import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { sendDraftsEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })
  }

  const { drafts } = await req.json()
  if (!Array.isArray(drafts) || drafts.length === 0) {
    return NextResponse.json({ ok: false, error: 'No drafts provided' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('github_username, github_email')
    .eq('id', userId)
    .single()

  if (error || !user || !user.github_email) {
    return NextResponse.json({ ok: false, error: 'No email on file' }, { status: 404 })
  }

  await sendDraftsEmail(user.github_email, user.github_username, drafts.slice(0, 5))
  return NextResponse.json({ ok: true, email: user.github_email })
}
