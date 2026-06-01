import type { Commit } from './filter'

// Bound total commit-detail fetches so an interactive dashboard load stays fast.
const MAX_DETAIL_FETCHES = 40

async function ghFetch(path: string, token: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    next: { revalidate: 0 },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getLastWeekCommits(
  accessToken: string,
  username: string
): Promise<{ repo: string; commits: Commit[] }[]> {
  const since = new Date()
  since.setDate(since.getDate() - 7)
  const sinceMs = since.getTime()
  const sinceISO = since.toISOString()

  // Repos come back sorted by most-recently-pushed first.
  const repos = await ghFetch(
    `/user/repos?sort=pushed&per_page=50&affiliation=owner`,
    accessToken
  )
  if (!repos) return []

  const results: { repo: string; commits: Commit[] }[] = []
  let detailBudget = MAX_DETAIL_FETCHES

  for (const repo of repos) {
    // Once we hit a repo not touched in the last 7 days, every repo after it is
    // older too (list is sorted by pushed) — stop early.
    if (repo.pushed_at && new Date(repo.pushed_at).getTime() < sinceMs) break
    if (detailBudget <= 0) break

    const commitList = await ghFetch(
      `/repos/${repo.full_name}/commits?since=${sinceISO}&author=${username}&per_page=50`,
      accessToken
    )
    if (!commitList || commitList.length === 0) continue

    const commits: Commit[] = []

    for (const c of commitList) {
      if (detailBudget <= 0) break
      detailBudget--

      const detail = await ghFetch(
        `/repos/${repo.full_name}/commits/${c.sha}`,
        accessToken
      )
      if (!detail) continue

      commits.push({
        sha: c.sha,
        message: c.commit.message,
        date: c.commit.author.date,
        additions: detail.stats?.additions ?? 0,
        deletions: detail.stats?.deletions ?? 0,
        filesChanged: (detail.files ?? []).map((f: { filename: string }) => f.filename),
      })
    }

    if (commits.length > 0) {
      results.push({ repo: repo.full_name, commits })
    }
  }

  return results
}
