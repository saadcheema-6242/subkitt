import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Commit } from './filter'

export async function generateDrafts(
  commitGroups: { repo: string; commits: Commit[] }[]
): Promise<string[]> {
  const commitSummary = commitGroups
    .flatMap(({ repo, commits }) =>
      commits.map(c => {
        const msg = c.message.split('\n')[0]
        return `[${repo}] ${msg} (+${c.additions}/-${c.deletions} lines, ${c.filesChanged.length} files)`
      })
    )
    .join('\n')

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

  const result = await model.generateContent(
    `You are a ghostwriter for a technical founder building in public.

Here are their commits from this week:
${commitSummary}

Write exactly 5 tweet drafts, each from a genuinely different angle:
1. What was technically hard about this week's work
2. What this means for the user/customer (benefit-focused)
3. A raw honest moment from the build process
4. What you'd do differently if starting over
5. An opinion or hot take related to what you built

Rules:
- Each tweet under 280 characters
- No hashtags
- No emojis unless the founder uses them
- Sound like a person, not a press release
- Be specific — use the actual commit details
- Each tweet must feel meaningfully different from the others

Return ONLY the 5 tweets, numbered 1-5, one per line. No preamble, no explanation.`
  )

  return result.response.text()
    .split('\n')
    .filter(line => /^\d+\./.test(line.trim()))
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 5)
}
