'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

function SubKittLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20">
        <path
          d="M47 19 C47 13 38 11 30 13 C20 15.5 17 23 27 27.5 C41 33 44 39 37 46.5 C31 53 21 51.5 17 45"
          fill="none"
          stroke="white"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-semibold text-white tracking-tight text-[15px]">SubKitt</span>
    </div>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const { error } = await supabase.from('waitlist').insert({
      email: email.toLowerCase().trim(),
      referrer: typeof document !== 'undefined' ? document.referrer : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
    if (error) {
      if (error.code === '23505') setStatus('success');
      else { setStatus('error'); setErrorMsg(error.message); }
    } else {
      setStatus('success');
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-white/[0.025] blur-[130px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.07] bg-[#080808]/70 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <SubKittLogo />
          <nav className="hidden md:flex items-center gap-7">
            <a href="#how" className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors">How it works</a>
            <a href="#founder" className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors">About</a>
          </nav>
          <a
            href="/api/auth/github"
            className="flex items-center gap-2 bg-white text-[#080808] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <GitHubIcon className="w-4 h-4" />
            Connect GitHub
          </a>
        </div>
      </header>

      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-36 pb-24 text-center">

          <a
            href="https://x.com/CheemaEdu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-white/[0.1] bg-white/[0.04] rounded-full px-4 py-1.5 mb-12 hover:bg-white/[0.07] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-xs text-neutral-400 tracking-wide">Early access · 50% off for first 50</span>
          </a>

          <h1 className="text-[60px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] mb-7">
            <span className="bg-gradient-to-b from-white via-white to-neutral-600 bg-clip-text text-transparent">
              You ship.<br />
              Your work turns<br />
              into inbound.
            </span>
          </h1>

          <p className="text-[17px] md:text-[19px] text-neutral-500 max-w-lg mx-auto mb-12 leading-relaxed">
            SubKitt reads your commits and writes 5 ready-to-post tweet drafts — delivered to your inbox every Monday morning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <a
              href="/api/auth/github"
              className="flex items-center gap-2.5 bg-white text-[#080808] font-semibold px-6 py-3 rounded-xl text-sm hover:bg-neutral-100 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]"
            >
              <GitHubIcon className="w-4 h-4" />
              Connect GitHub — it&apos;s free
            </a>

            {status === 'success' ? (
              <span className="text-sm text-green-400 px-2">You&apos;re on the list.</span>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Or join the waitlist"
                  required
                  disabled={status === 'loading'}
                  className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/[0.25] w-52 disabled:opacity-50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="text-neutral-500 hover:text-white transition-colors px-3 py-3 text-sm disabled:opacity-40"
                >
                  {status === 'loading' ? '···' : '→'}
                </button>
              </form>
            )}
          </div>

          {status === 'error' && <p className="text-red-400 text-xs mb-4">{errorMsg}</p>}
          <p className="text-xs text-neutral-700">No card required. No spam. Unsubscribe anytime.</p>
        </section>

        {/* Commit → Tweet demo */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="grid md:grid-cols-[1fr_64px_1fr] gap-0 items-center">

            {/* Input card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                </div>
                <span className="text-[11px] text-neutral-600 font-mono ml-2">git log — last 7 days</span>
              </div>
              <div className="p-6 font-mono space-y-3">
                <div>
                  <p className="text-[11px] text-neutral-700 mb-1">commit a1b2c3d · 2 days ago</p>
                  <p className="text-sm text-green-400 leading-relaxed">feat: add OAuth flow to settings page</p>
                  <p className="text-[11px] text-neutral-600 mt-1.5">+847 −12 · 6 files changed</p>
                </div>
                <div className="border-t border-white/[0.05] pt-3">
                  <p className="text-[11px] text-neutral-700 mb-1">commit f8e7d6c · 4 days ago</p>
                  <p className="text-sm text-green-400 leading-relaxed">feat: launch stripe billing integration</p>
                  <p className="text-[11px] text-neutral-600 mt-1.5">+1,203 −88 · 11 files changed</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center gap-2 py-6 md:py-0">
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/[0.15] to-transparent md:hidden" />
              <div className="hidden md:flex flex-col items-center gap-2">
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/[0.1] to-transparent" />
                <div className="text-neutral-700">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[9px] text-neutral-700 uppercase tracking-[0.12em] rotate-90 mt-2">SubKitt</span>
              </div>
            </div>

            {/* Output card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <span className="text-[11px] text-neutral-600">Monday drafts · 5 ready to post</span>
                <span className="text-[10px] text-neutral-700 uppercase tracking-wider">Inbox</span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {[
                  "Just shipped OAuth into SubKitt. If you've ever fought GitHub's token refresh flow for a Tuesday, this one's for you.",
                  "Stripe billing is live. Took longer than expected — mostly because I kept second-guessing the subscription logic. Shipped it anyway.",
                ].map((tweet, i) => (
                  <div key={i} className="px-6 py-4">
                    <span className="text-[10px] text-neutral-700 font-mono block mb-2">{i + 1} / 5</span>
                    <p className="text-sm text-neutral-200 leading-relaxed">{tweet}</p>
                    <p className="text-[10px] text-neutral-700 mt-2">{tweet.length} chars</p>
                  </div>
                ))}
                <div className="px-6 py-3 text-[11px] text-neutral-700 text-center">+ 3 more drafts</div>
              </div>
            </div>

          </div>
          <p className="text-center text-xs text-neutral-700 mt-6">One week of commits. Five drafts. Zero time spent writing.</p>
        </section>

        {/* Who it's for */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-8 md:px-12 py-10">
            <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-600 block mb-5">Who it&apos;s for</span>
            <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-medium">
              Solo technical founders building SaaS. You ship often but your X timeline is a ghost town. You know building in public is the cheat code — but you&apos;d rather stay in the codebase.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-14">
            <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-600">How it works</span>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                n: '01',
                title: 'Connect GitHub',
                body: 'SubKitt watches your repos and tracks what you ship — features, releases, big commits. Not noise.',
              },
              {
                n: '02',
                title: 'Get drafts Monday',
                body: 'Every Monday morning, 5 tweet drafts hit your inbox. No prompts, no blank page — just your work, packaged.',
              },
              {
                n: '03',
                title: 'Post in 30 seconds',
                body: 'Pick a draft, tweak it if you want, post it. Your whole week of work, shared in under a minute.',
              },
            ].map(({ n, title, body }) => (
              <div
                key={n}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
              >
                <span className="text-[11px] font-mono text-neutral-700 block mb-6">{n}</span>
                <h3 className="font-semibold text-white mb-2.5 tracking-tight">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
          <p className="text-2xl md:text-[28px] text-neutral-300 leading-[1.5] font-medium mb-5">
            Technical founders ship more than they post. The work is there — the audience isn&apos;t, because turning code into content is a second job nobody has time for.
          </p>
          <p className="text-lg text-neutral-600 leading-relaxed">
            You tried to become a creator and it killed your velocity. You&apos;re not a creator — you&apos;re a builder.{' '}
            <span className="text-neutral-400">Stay in the code. SubKitt handles the distribution.</span>
          </p>
        </section>

        {/* CTA block */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] px-10 py-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-white/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] mb-4">
                Stop building in silence.
              </h2>
              <p className="text-neutral-500 mb-10 text-[16px]">
                Connect GitHub in 30 seconds. First 50 users get 50% off for life.
              </p>
              <a
                href="/api/auth/github"
                className="inline-flex items-center gap-2.5 bg-white text-[#080808] font-semibold px-7 py-3.5 rounded-xl text-sm hover:bg-neutral-100 transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
              >
                <GitHubIcon className="w-4 h-4" />
                Connect GitHub — it&apos;s free
              </a>
            </div>
          </div>
        </section>

        {/* Founder note */}
        <section id="founder" className="max-w-5xl mx-auto px-6 pb-20 pt-10 border-t border-white/[0.06]">
          <div className="flex gap-4 items-start max-w-md">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] shrink-0 flex items-center justify-center text-sm font-semibold text-neutral-400">
              H
            </div>
            <div>
              <p className="text-neutral-300 leading-relaxed mb-2">
                I&apos;m Hassan. Solo, technical, broke student, building in public.
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed mb-5">
                I got tired of shipping code nobody saw. I refused to waste build time on Twitter growth hacks. So I built the tool I needed.
              </p>
              <div className="flex gap-5">
                <a href="https://x.com/CheemaEdu" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors">
                  @CheemaEdu on X →
                </a>
                <a href="https://github.com/Hassan-Cheema/subkitt" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors">
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
