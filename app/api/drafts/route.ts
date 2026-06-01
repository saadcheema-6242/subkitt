import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getDraftsForUser } from '@/lib/pipeline'

// Generating drafts fetches commits + calls the LLM; give it room.
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ status: 'error', error: 'Not authenticated' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('github_username, github_email, access_token')
    .eq('id', userId)
    .single()

  if (error || !user) {
    return NextResponse.json({ status: 'error', error: 'User not found' }, { status: 404 })
  }

  const result = await getDraftsForUser(user)
  return NextResponse.json(result)
}
