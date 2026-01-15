import { Resend } from 'resend'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { render } from '@react-email/render'
import MagicLinkEmail from '@/emails/magic-link'

export async function sendMagicLinkEmail(email: string, link: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('----------------------------------------')
    console.log(`[Dev Mode] Sending Magic Link to ${email}`)
    console.log(`Link: ${link}`)
    console.log('----------------------------------------')
    return
  }

  const { env } = await getCloudflareContext({ async: true })
  const apiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY

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
