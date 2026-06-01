'use client'

import { useEffect, useRef, useState } from 'react'

interface SourceCommit {
  repo: string
  message: string
  additions: number
  deletions: number
}

type Phase = 'loading' | 'ready' | 'no_commits' | 'no_drafts' | 'error'

const LOADING_STEPS = [
  'Reading your commits…',
  'Filtering out the noise…',
  'Finding the story in your week…',
  'Writing your drafts…',
]

function xIntent(text: string) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export default function DraftStudio({ username }: { username: string }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [drafts, setDrafts] = useState<string[]>([])
  const [commits, setCommits] = useState<SourceCommit[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState<number | null>(null)
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [loadingStep, setLoadingStep] = useState(0)
  const started = useRef(false)

  async function fetchDrafts() {
    setPhase('loading')
    setLoadingStep(0)
    setEmailState('idle')
    try {
      const res = await fetch('/api/drafts')
      const data = await res.json()
      if (data.status === 'ok') {
        setDrafts(data.drafts)
        setCommits(data.commits ?? [])
        setPhase('ready')
      } else if (data.status === 'no_commits') {
        setPhase('no_commits')
      } else if (data.status === 'no_drafts') {
        setPhase('no_drafts')
      } else {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setPhase('error')
      }
    } catch {
      setErrorMsg('Could not reach the server. Try again.')
      setPhase('error')
    }
  }

  // Generate on first load.
  useEffect(() => {
    if (started.current) return
    started.current = true
    fetchDrafts()
  }, [])

  // Cycle loading messages.
  useEffect(() => {
    if (phase !== 'loading') return
    const id = setInterval(() => {
      setLoadingStep(s => (s < LOADING_STEPS.length - 1 ? s + 1 : s))
    }, 2600)
    return () => clearInterval(id)
  }, [phase])

  function updateDraft(i: number, value: string) {
    setDrafts(prev => prev.map((d, idx) => (idx === i ? value : d)))
  }

  async function copyDraft(i: number) {
    await navigator.clipboard.writeText(drafts[i])
    setCopied(i)
    setTimeout(() => setCopied(c => (c === i ? null : c)), 1500)
  }

  async function emailDrafts() {
    setEmailState('sending')
    const res = await fetch('/api/email-drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drafts }),
    })
    setEmailState(res.ok ? 'sent' : 'idle')
  }

  // ---- Loading ----
  if (phase === 'loading') {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] py-20 px-8 text-center">
        <div className="flex justify-center gap-1.5 mb-6">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-neutral-300 text-sm font-medium">{LOADING_STEPS[loadingStep]}</p>
        <p className="text-neutral-600 text-xs mt-2">This takes a few seconds — we&apos;re reading real commits.</p>
      </div>
    )
  }

  // ---- Empty / error states ----
  if (phase === 'no_commits') {
    return (
      <EmptyState
        title="No substantial commits this week"
        body="SubKitt found nothing worth posting in your last 7 days — or your commits were all merges, typos, and tiny changes (we filter those out). Ship something, then come back."
        onRetry={fetchDrafts}
      />
    )
  }
  if (phase === 'no_drafts') {
    return (
      <EmptyState
        title="Couldn't write drafts this time"
        body="The generator came back empty. This is usually a hiccup — try again."
        onRetry={fetchDrafts}
      />
    )
  }
  if (phase === 'error') {
    return <EmptyState title="Something broke" body={errorMsg} onRetry={fetchDrafts} />
  }

  // ---- Ready ----
  return (
    <div>
      {/* Source commits — the proof */}
      {commits.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 mb-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-600 mb-3">
            Written from {commits.length} commit{commits.length > 1 ? 's' : ''} this week
          </p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {commits.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-mono">
                <span className="text-green-400/80 truncate flex-1">{c.message}</span>
                <span className="text-neutral-600 shrink-0">+{c.additions} −{c.deletions}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-neutral-300">5 drafts, ready to post</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={emailDrafts}
            disabled={emailState !== 'idle'}
            className="text-xs text-neutral-500 hover:text-white border border-white/[0.1] rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            {emailState === 'sent' ? '✓ Emailed' : emailState === 'sending' ? 'Sending…' : 'Email these to me'}
          </button>
          <button
            onClick={fetchDrafts}
            className="text-xs text-neutral-500 hover:text-white border border-white/[0.1] rounded-lg px-3 py-1.5 transition-colors"
          >
            ↻ Regenerate
          </button>
        </div>
      </div>

      {/* Draft cards */}
      <div className="space-y-3">
        {drafts.map((draft, i) => {
          const over = draft.length > 280
          return (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-white/[0.14] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-neutral-700">{i + 1} / {drafts.length}</span>
                <span className={`text-[11px] font-mono ${over ? 'text-red-400' : 'text-neutral-600'}`}>
                  {draft.length} / 280
                </span>
              </div>

              <textarea
                value={draft}
                onChange={e => updateDraft(i, e.target.value)}
                rows={3}
                className="w-full bg-transparent text-[15px] text-neutral-100 leading-relaxed resize-none focus:outline-none placeholder:text-neutral-700 mb-4"
              />

              <div className="flex items-center gap-2">
                <a
                  href={xIntent(draft)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-[#080808] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post on X
                </a>
                <button
                  onClick={() => copyDraft(i)}
                  className="text-sm text-neutral-400 hover:text-white border border-white/[0.1] rounded-lg px-4 py-2 transition-colors"
                >
                  {copied === i ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-neutral-700 mt-6 text-center">
        Edit any draft above before posting. These same drafts land in your inbox every Monday.
      </p>
    </div>
  )
}

function EmptyState({ title, body, onRetry }: { title: string; body: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] py-16 px-8 text-center">
      <h2 className="text-lg font-semibold text-neutral-200 mb-2">{title}</h2>
      <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6 leading-relaxed">{body}</p>
      <button
        onClick={onRetry}
        className="bg-white text-[#080808] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-neutral-200 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
