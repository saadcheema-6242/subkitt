import { Resend } from 'resend'

export async function sendDraftsEmail(
  to: string,
  username: string,
  drafts: string[]
): Promise<void> {
  const draftBlocks = drafts
    .map(
      (draft, i) => `
      <div style="margin-bottom:20px;padding:18px 20px;background:#f9f9f9;border:1px solid #eee;border-radius:10px;">
        <p style="margin:0 0 8px 0;font-size:11px;color:#999;font-family:monospace;text-transform:uppercase;letter-spacing:.05em;">${i + 1} / ${drafts.length}</p>
        <p style="margin:0 0 14px 0;font-size:16px;line-height:1.6;color:#111;">${draft}</p>
        <a href="https://x.com/intent/tweet?text=${encodeURIComponent(draft)}" style="display:inline-block;background:#000;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:8px 16px;border-radius:8px;">Post on X →</a>
        <span style="font-size:11px;color:#bbb;margin-left:12px;">${draft.length} / 280</span>
      </div>`
    )
    .join('')

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'SubKitt <drafts@subkitt.com>',
    to,
    subject: 'Your Monday SubKitt drafts',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#000;background:#fff;">
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">Your Monday SubKitt drafts</h1>
  <p style="color:#666;margin:0 0 28px 0;font-size:15px;">5 tweets from what you shipped this week, @${username}. Tap <b>Post on X</b> to send one in two clicks.</p>
  ${draftBlocks}
  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
  <p style="font-size:13px;color:#888;margin:0 0 6px 0;">Want to edit them first or regenerate? <a href="https://subkitt.com/dashboard" style="color:#000;font-weight:600;">Open your dashboard →</a></p>
  <p style="font-size:12px;color:#bbb;margin-top:16px;">SubKitt (beta) · built by <a href="https://x.com/CheemaEdu" style="color:#999;">@CheemaEdu</a></p>
</body>
</html>`,
  })
}
