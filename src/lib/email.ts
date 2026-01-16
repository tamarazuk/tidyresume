import { Resend } from 'resend'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { render } from '@react-email/render'
import MagicLinkEmail from '@/emails/magic-link'

const LOG_SEPARATOR = '----------------------------------------'

const logMagicLink = (label: string, link: string) => {
  console.log(LOG_SEPARATOR)
  console.log(`[${label}] Magic Link dispatched`)
  console.log(`Link: ${link}`)
  console.log(LOG_SEPARATOR)
}

const resolveFlag = (
  localValue: string | undefined,
  remoteValue: string | undefined
) => (localValue ?? remoteValue)?.toLowerCase() === 'true'

type CloudflareEnvRecord = Record<string, string | undefined>

export async function sendMagicLinkEmail(email: string, link: string) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  let cloudflareEnv: CloudflareEnvRecord = {}

  try {
    const { env } = await getCloudflareContext({ async: true })
    cloudflareEnv = (env ?? {}) as unknown as CloudflareEnvRecord
  } catch (error) {
    if (!isDevelopment) {
      console.warn('Cloudflare env unavailable when sending magic link.', error)
    }
  }

  const outboundEmailsDisabled = resolveFlag(
    process.env.DISABLE_OUTBOUND_EMAILS,
    cloudflareEnv.DISABLE_OUTBOUND_EMAILS
  )
  const legacyMagicLinkDisabled = resolveFlag(
    process.env.DISABLE_MAGIC_LINK_EMAILS,
    cloudflareEnv.DISABLE_MAGIC_LINK_EMAILS
  )
  const emailsDisabled = outboundEmailsDisabled || legacyMagicLinkDisabled

  if (emailsDisabled) {
    logMagicLink('Emails Disabled', link)
    return
  }

  const apiKey =
    (isDevelopment
      ? (process.env.RESEND_DEV_API_KEY ?? cloudflareEnv.RESEND_DEV_API_KEY)
      : undefined) ??
    process.env.RESEND_API_KEY ??
    cloudflareEnv.RESEND_API_KEY

  if (isDevelopment) {
    logMagicLink('Dev Mode', link)
  }

  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    throw new Error('Email service configuration missing')
  }

  const resend = new Resend(apiKey)

  try {
    const emailHtml = await render(MagicLinkEmail({ link }))

    const { data, error } = await resend.emails.send({
      from: 'TidyResume <noreply@tidyresume.tzuk.app>', // Update this with your verified domain
      to: email,
      subject: 'Access your resume',
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(error.message)
    }

    console.log(`Email sent to ${email}, ID: ${data?.id}`)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
