'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

function SubKittLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20">
        <path
          d="M47 19 C47 13 38 11 30 13 C20 15.5 17 23 27 27.5 C41 33 44 39 37 46.5 C31 53 21 51.5 17 45"
          fill="none" stroke="white" strokeWidth="7.5" strokeLinecap="round"
        />
      </svg>
      <span className="font-semibold text-white tracking-tight text-[15px]">SubKitt</span>
    </div>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function DemoCard() {
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] overflow-hidden h-full">

      {/* Commit input */}
      <div className="border-b border-white/[0.07]">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
          </div>
          <span className="text-[11px] text-neutral-600 font-mono ml-1">git log — last 7 days</span>
        </div>
        <div className="px-5 py-4 font-mono space-y-4">
          <div>
            <p className="text-[10px] text-neutral-700 mb-1">commit a1b2c3d · 2 days ago</p>
            <p className="text-[13px] text-green-400">feat: add OAuth flow to settings page</p>
            <p className="text-[10px] text-neutral-600 mt-1">+847 −12 · 6 files</p>
          </div>
          <div className="border-t border-white/[0.05] pt-4">
            <p className="text-[10px] text-neutral-700 mb-1">commit f8e7d6c · 4 days ago</p>
            <p className="text-[13px] text-green-400">feat: launch stripe billing</p>
            <p className="text-[10px] text-neutral-600 mt-1">+1,203 −88 · 11 files</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-5 py-2.5">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[10px] text-neutral-700 uppercase tracking-widest">SubKitt</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Tweet output */}
      <div className="border-t border-white/[0.07]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
          <span className="text-[11px] text-neutral-600">Monday drafts</span>
          <span className="text-[10px] bg-white/[0.06] text-neutral-500 px-2 py-0.5 rounded-full italic">example</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {[
            { n: 1, text: "Just shipped OAuth into SubKitt. If you've ever fought GitHub's token refresh flow on a Tuesday, this one's for you." },
            { n: 2, text: "Stripe billing is live. Took longer than expected — mostly because I kept second-guessing the subscription logic. Shipped it anyway." },
          ].map(({ n, text }) => (
            <div key={n} className="px-5 py-3.5">
              <span className="text-[10px] text-neutral-700 font-mono block mb-1.5">{n} / 5</span>
              <p className="text-[13px] text-neutral-200 leading-relaxed">{text}</p>
            </div>
          ))}
          <div className="px-5 py-2.5 text-[11px] text-neutral-700">+ 3 more drafts in your inbox</div>
        </div>
      </div>

    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Autopilot Video Demo Simulator State
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [copiedDraft, setCopiedDraft] = useState(false);

  const startDemo = () => {
    setDemoActive(true);
    setDemoStep(1);
    setCursorPos({ x: 80, y: 80 });
    setCopiedDraft(false);

    // Timeline:
    // 1. Move cursor to "Connect GitHub" (top-right inside simulator)
    setTimeout(() => {
      setCursorPos({ x: 91, y: 11 });
    }, 500);

    // 2. Click button (redirect to GitHub authorization loader)
    setTimeout(() => {
      setDemoStep(2);
    }, 2500);

    // 3. Transition to Dashboard and start commit scanning
    setTimeout(() => {
      setDemoStep(3);
    }, 4500);

    // 4. Reveal mock commits and drafts
    setTimeout(() => {
      setDemoStep(4);
    }, 9000);

    // 5. Move cursor to "Copy" button of the first card
    setTimeout(() => {
      setCursorPos({ x: 38, y: 52 });
    }, 11000);

    // 6. Click Copy (show checkmark success)
    setTimeout(() => {
      setCopiedDraft(true);
    }, 12500);

    // 7. Complete: Enable replay controls
    setTimeout(() => {
      setDemoStep(5);
    }, 14000);
  };

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
        <div className="absolute -top-40 left-1/4 w-[700px] h-[600px] rounded-full bg-white/[0.02] blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.07] bg-[#080808]/75 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SubKittLogo />
            <span 
              onClick={startDemo} 
              title="Click for Autopilot Recording Demo"
              className="text-[10px] bg-white/[0.08] text-neutral-400 px-2 py-0.5 rounded-full cursor-pointer hover:bg-white/[0.15] transition-colors select-none"
            >
              beta
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm text-neutral-500 hover:text-white transition-colors">How it works</a>
            <a href="#founder" className="text-sm text-neutral-500 hover:text-white transition-colors">About</a>
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

      <div className="relative z-10 max-w-7xl mx-auto px-8">

        {/* Hero — two column */}
        <section className="pt-32 pb-24 grid lg:grid-cols-[1fr_520px] gap-16 items-center min-h-[90vh]">

          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2.5 border border-white/[0.1] bg-white/[0.04] rounded-full px-4 py-1.5 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              <span className="text-xs text-neutral-400 tracking-wide">Now in beta · free to start</span>
            </div>

            <h1 className="text-[56px] lg:text-[72px] xl:text-[80px] font-bold tracking-[-0.03em] leading-[1.04] mb-7">
              <span className="bg-gradient-to-b from-white via-white to-neutral-600 bg-clip-text text-transparent">
                You ship.<br />
                Your work turns<br />
                into inbound.
              </span>
            </h1>

            <p className="text-[17px] text-neutral-400 max-w-md mb-3 leading-relaxed">
              Connect GitHub and SubKitt turns your real commits into <span className="text-white">5 ready-to-post tweets — in 60 seconds.</span>
            </p>
            <p className="text-[15px] text-neutral-600 max-w-md mb-10 leading-relaxed">
              Then a fresh batch lands in your inbox every Monday. You stay in the code; your audience still grows.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <a
                href="/api/auth/github"
                className="flex items-center gap-2.5 bg-white text-[#080808] font-semibold px-6 py-3 rounded-xl text-sm hover:bg-neutral-100 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]"
              >
                <GitHubIcon className="w-4 h-4" />
                Try it free — connect GitHub
              </a>

              {status === 'success' ? (
                <span className="text-sm text-green-400">You&apos;re on the list.</span>
              ) : (
                <form onSubmit={handleSubmit} className="flex items-center gap-1">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Or join the waitlist"
                    required
                    disabled={status === 'loading'}
                    className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/[0.25] w-48 disabled:opacity-50 transition-colors"
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

            {status === 'error' && <p className="text-red-400 text-xs mb-3">{errorMsg}</p>}
            <p className="text-xs text-neutral-600">
              See 5 drafts from your real commits in 60 seconds. Free during beta.
            </p>
            <p className="text-xs text-neutral-700 mt-1.5">
              Read-only access. We only read commit metadata, never your code.
            </p>
          </div>

          {/* Right: demo card */}
          <div className="hidden lg:block">
            <DemoCard />
          </div>
        </section>

        {/* Who it's for */}
        <section className="pb-24">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-10 py-10">
            <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-600 block mb-5">Who it&apos;s for</span>
            <p className="text-xl lg:text-2xl text-neutral-300 leading-relaxed font-medium max-w-3xl">
              Solo technical founders building SaaS. You ship often but your X timeline is a ghost town. You know building in public is the cheat code — but you&apos;d rather stay in the codebase.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="pb-24">
          <div className="flex items-center justify-between mb-12">
            <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-600">How it works</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '01', title: 'Connect GitHub', body: 'One click, read-only. SubKitt tracks what you actually ship — features, releases, big commits. Not noise.' },
              { n: '02', title: 'See drafts instantly', body: 'In 60 seconds, 5 tweet drafts from your real last-7-days commits appear on screen. No prompts, no blank page.' },
              { n: '03', title: 'Post in one click', body: 'Edit if you want, then hit Post on X. Or copy it. Your whole week of work, shared in under a minute.' },
              { n: '04', title: 'Every Monday, on autopilot', body: 'A fresh batch lands in your inbox each Monday — so building in public becomes a habit you never have to think about.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                <span className="text-[11px] font-mono text-neutral-700 block mb-8">{n}</span>
                <h3 className="font-semibold text-white mb-3 text-[15px]">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="pb-24 max-w-3xl">
          <p className="text-2xl lg:text-[28px] text-neutral-300 leading-[1.5] font-medium mb-5">
            Technical founders ship more than they post. The work is there — the audience isn&apos;t, because turning code into content is a second job nobody has time for.
          </p>
          <p className="text-lg text-neutral-600 leading-relaxed">
            You tried to become a creator and it killed your velocity. You&apos;re not a creator — you&apos;re a builder.{' '}
            <span className="text-neutral-400">Stay in the code. SubKitt handles the distribution.</span>
          </p>
        </section>

        {/* CTA block */}
        <section className="pb-24">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] px-12 py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-[400px] h-[300px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-[-0.02em] mb-3">
                  Stop building in silence.
                </h2>
                <p className="text-neutral-500 text-[16px]">
                  Connect GitHub in 30 seconds.
                </p>
              </div>
              <a
                href="/api/auth/github"
                className="flex items-center gap-2.5 bg-white text-[#080808] font-semibold px-7 py-3.5 rounded-xl text-sm hover:bg-neutral-100 transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] shrink-0"
              >
                <GitHubIcon className="w-4 h-4" />
                Try it free — connect GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="pb-24">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-10 py-10">
            <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-600 block mb-8">Pricing</span>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-white font-semibold mb-1">Free to start</p>
                <p className="text-sm text-neutral-500 leading-relaxed">Connect GitHub and get your first Monday drafts free. No card required.</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">$19 / month</p>
                <p className="text-sm text-neutral-500 leading-relaxed">After your first week. Cancel anytime.</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">$9.50 / month — early access</p>
                <p className="text-sm text-neutral-500 leading-relaxed">First 50 users locked in at 50% off, forever. <span className="text-neutral-400">No price hikes.</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder note */}
        <section id="founder" className="pb-20 pt-10 border-t border-white/[0.06]">
          <div className="flex gap-4 items-start max-w-lg">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] shrink-0 flex items-center justify-center text-sm font-semibold text-neutral-400">C</div>
            <div>
              <p className="text-neutral-300 leading-relaxed mb-2">
                We&apos;re Hassan and Muhammad Saad. 16, self-taught, building in public.
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed mb-5">
                We got tired of shipping code nobody saw, and refused to waste build time on growth hacks. So we built the tool we needed.
              </p>
              <div className="space-y-2 mt-4">
                <div className="flex gap-x-3 gap-y-1 flex-wrap text-sm text-neutral-500">
                  <span className="text-neutral-400 font-medium">Hassan:</span>
                  <a href="https://x.com/CheemaEdu" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">X →</a>
                  <span className="text-neutral-700">•</span>
                  <a href="https://www.instagram.com/hassan_cheema_2010_/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Instagram →</a>
                  <span className="text-neutral-700">•</span>
                  <a href="https://github.com/Hassan-Cheema" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">GitHub →</a>
                </div>
                <div className="flex gap-x-3 gap-y-1 flex-wrap text-sm text-neutral-500">
                  <span className="text-neutral-400 font-medium">Saad:</span>
                  <a href="https://x.com/cheema_muh41643" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">X →</a>
                  <span className="text-neutral-700">•</span>
                  <a href="https://www.instagram.com/saadcheema.6242/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Instagram →</a>
                  <span className="text-neutral-700">•</span>
                  <a href="https://github.com/saadcheema-6242" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">GitHub →</a>
                </div>
                <div className="flex gap-x-3 gap-y-1 flex-wrap text-sm text-neutral-500 pt-2 border-t border-white/[0.04]">
                  <span className="text-neutral-400 font-medium">SubKitt:</span>
                  <a href="https://x.com/subkitt_ai" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Official X →</a>
                  <span className="text-neutral-700">•</span>
                  <a href="https://www.instagram.com/_subkitt/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Official Instagram →</a>
                  <span className="text-neutral-700">•</span>
                  <a href="https://github.com/Hassan-Cheema/subkitt" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">GitHub Repo →</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Autopilot Demo Simulator Overlay */}
      {demoActive && (
        <div className="fixed inset-0 z-50 bg-[#080808]/96 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          {/* Simulated Browser Frame */}
          <div className="w-full max-w-4xl h-[650px] bg-[#0c0c0c] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col relative shadow-[0_0_80px_rgba(0,0,0,0.8)] select-none">
            
            {/* Window controls */}
            <div className="h-11 bg-[#121212] border-b border-white/[0.05] flex items-center px-4 justify-between shrink-0">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="bg-[#1c1c1c] text-[11px] text-neutral-500 px-10 py-1 rounded-md border border-white/[0.04] font-mono">
                subkitt.com{demoStep >= 3 ? '/dashboard' : ''}
              </div>
              <div className="w-14" />
            </div>

            {/* Simulated Mouse Cursor */}
            <div 
              className="absolute pointer-events-none z-50 transition-all duration-[1500ms] ease-out flex flex-col items-start"
              style={{ 
                left: `${cursorPos.x}%`, 
                top: `${cursorPos.y}%`,
                transitionProperty: 'left, top'
              }}
            >
              <svg className="w-5 h-5 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 3v15.3l4.3-4.3 3.6 7.4 2.8-1.4-3.6-7.3 5.4-.3z" stroke="black" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Step 1: Landing Page inside Browser */}
            {demoStep <= 1 && (
              <div className="flex-1 overflow-y-auto p-8 relative">
                {/* Navbar inside Browser */}
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20">
                      <path d="M47 19 C47 13 38 11 30 13 C20 15.5 17 23 27 27.5 C41 33 44 39 37 46.5 C31 53 21 51.5 17 45" fill="none" stroke="white" strokeWidth="7.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-semibold text-sm">SubKitt</span>
                  </div>
                  <div className="bg-white text-[#080808] text-xs font-semibold px-4 py-2 rounded-lg border border-white/[0.1]">
                    Connect GitHub
                  </div>
                </div>

                {/* Hero Inside Browser */}
                <div className="max-w-md mt-10">
                  <div className="inline-flex items-center gap-2 border border-white/[0.1] bg-white/[0.04] rounded-full px-3 py-1 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-neutral-400">Now in beta · free to start</span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
                    You ship.<br />Your work turns<br />into inbound.
                  </h1>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    Connect GitHub and SubKitt turns your real commits into 5 ready-to-post tweets — in 60 seconds.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white text-[#080808] font-semibold px-5 py-2.5 rounded-xl text-xs">
                    Connect GitHub →
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: GitHub Simulated Auth Loader */}
            {demoStep === 2 && (
              <div className="flex-1 flex flex-col items-center justify-center bg-[#090909]">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 animate-pulse">
                  <svg className="w-8 h-8 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-neutral-200 animate-pulse">Authorizing SubKitt with GitHub...</p>
                <p className="text-xs text-neutral-500 mt-2">Checking read-only metadata permissions</p>
              </div>
            )}

            {/* Step 3 & 4: Simulated Dashboard */}
            {demoStep >= 3 && (
              <div className="flex-1 flex flex-col overflow-hidden bg-[#080808]">
                {/* Dashboard Header */}
                <header className="border-b border-white/[0.05] h-12 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="16" height="16">
                      <path d="M47 19 C47 13 38 11 30 13 C20 15.5 17 23 27 27.5 C41 33 44 39 37 46.5 C31 53 21 51.5 17 45" fill="none" stroke="white" strokeWidth="7.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-semibold text-xs">SubKitt</span>
                    <span className="text-[9px] bg-white/[0.06] text-neutral-400 px-1.5 py-0.2 rounded-full">beta</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    @saadcheema-6242
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto w-full">
                  <div className="mb-6">
                    <h2 className="text-base font-bold text-white mb-1">Your drafts, @saadcheema-6242</h2>
                    <p className="text-xs text-neutral-500">Generated live from your last 7 days of commits.</p>
                  </div>

                  {/* Loading screen for Dashboard */}
                  {demoStep === 3 && (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-12 text-center mt-4">
                      <div className="flex justify-center gap-1 mb-4">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-neutral-300">Writing your drafts...</p>
                      <p className="text-[10px] text-neutral-500 mt-1">Reading 14 commits across 2 repositories</p>
                    </div>
                  )}

                  {/* Loaded State */}
                  {demoStep >= 4 && (
                    <div className="space-y-4">
                      {/* Commits box */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-4">
                        <p className="text-[9px] uppercase tracking-wider text-neutral-600 mb-2 font-mono">Written from commits this week</p>
                        <div className="space-y-1 text-[10px] font-mono text-green-400/80">
                          <div>[subkitt] Redesigned premium product landing page (+420/-12 lines)</div>
                          <div>[subkitt] Configured Gemini 3.5 Flash generator engine (+50/-0 lines)</div>
                        </div>
                      </div>

                      {/* Social cards */}
                      <div className="space-y-2.5">
                        {[
                          "Redesigned the entire landing page for SubKitt. Hardcoded obsidian theme, clean selection highlights, and styled scrollbars. Feels incredibly premium.",
                          "Switched SubKitt generation engine to Gemini 3.5 Flash. Draft generation is now under 3 seconds with absolute precision. Commits -> posts on autopilot.",
                        ].map((draft, idx) => (
                          <div key={idx} className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-4">
                            <div className="flex justify-between items-center text-[9px] text-neutral-600 mb-2">
                              <span>{idx + 1} / 2</span>
                              <span>{draft.length} / 280</span>
                            </div>
                            <p className="text-xs text-neutral-200 leading-relaxed mb-3">{draft}</p>
                            <div className="flex gap-2">
                              <span className="bg-white text-[#080808] text-[10px] font-bold px-3 py-1.5 rounded-md">Post on X</span>
                              <span className="text-[10px] text-neutral-400 border border-white/[0.08] px-3 py-1.5 rounded-md font-medium">
                                {idx === 0 && copiedDraft ? '✓ Copied' : 'Copy'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls for Recording */}
            <div className="absolute bottom-4 right-4 z-50 flex gap-2">
              <button 
                onClick={() => setDemoActive(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-4 py-2 rounded-lg border border-white/[0.08] transition-colors shadow-lg"
              >
                Close Simulator
              </button>
              {demoStep === 5 && (
                <button 
                  onClick={startDemo}
                  className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg"
                >
                  Replay Demo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
