import { getLastWeekCommits } from './github'
import { filterCommits } from './filter'
import { generateDrafts } from './claude'
import { sendDraftsEmail } from './email'

interface User {
  github_username: string
  github_email: string
  access_token: string
}

export interface SourceCommit {
  repo: string
  message: string
  additions: number
  deletions: number
}

export interface DraftResult {
  status: 'ok' | 'no_commits' | 'no_drafts' | 'error'
  drafts?: string[]
  commits?: SourceCommit[]
  error?: string
}

/** Generates drafts from the user's recent commits. Does NOT send email. */
export async function getDraftsForUser(user: User): Promise<DraftResult> {
  try {
    const commitGroups = await getLastWeekCommits(user.access_token, user.github_username)

    const filtered = commitGroups
      .map(({ repo, commits }) => ({ repo, commits: filterCommits(commits) }))
      .filter(({ commits }) => commits.length > 0)

    if (filtered.length === 0) return { status: 'no_commits' }

    const drafts = await generateDrafts(filtered)
    if (drafts.length === 0) return { status: 'no_drafts' }

    const commits: SourceCommit[] = filtered.flatMap(({ repo, commits }) =>
      commits.map(c => ({
        repo,
        message: c.message.split('\n')[0],
        additions: c.additions,
        deletions: c.deletions,
      }))
    )

    return { status: 'ok', drafts, commits }
  } catch (err) {
    return { status: 'error', error: String(err) }
  }
}

/** Generates drafts AND emails them (used by the weekly cron). */
export async function runPipeline(user: User): Promise<DraftResult & { sent?: boolean }> {
  const result = await getDraftsForUser(user)
  if (result.status === 'ok' && result.drafts) {
    await sendDraftsEmail(user.github_email, user.github_username, result.drafts)
    return { ...result, sent: true }
  }
  return result
}
