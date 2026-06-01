import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import DraftStudio from './draft-studio'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  if (!userId) redirect('/')

  const supabase = createServerClient()
  const { data: user } = await supabase
    .from('users')
    .select('github_username, github_email')
    .eq('id', userId)
    .single()

  if (!user) redirect('/')

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Top bar */}
      <header className="border-b border-white/[0.07]">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="18" height="18">
              <path d="M47 19 C47 13 38 11 30 13 C20 15.5 17 23 27 27.5 C41 33 44 39 37 46.5 C31 53 21 51.5 17 45" fill="none" stroke="white" strokeWidth="7.5" strokeLinecap="round" />
            </svg>
            <span className="font-semibold text-[15px] tracking-tight">SubKitt</span>
            <span className="text-[10px] bg-white/[0.08] text-neutral-400 px-2 py-0.5 rounded-full ml-1">beta</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            @{user.github_username}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">
            Your drafts, @{user.github_username}
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Generated live from your last 7 days of commits. Post one now, or get a fresh batch in your inbox every Monday at{' '}
            <span className="text-neutral-300">{user.github_email}</span>.
          </p>
        </div>

        <DraftStudio username={user.github_username} />

      </div>
    </main>
  )
}
