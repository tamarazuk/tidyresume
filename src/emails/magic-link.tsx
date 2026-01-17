import { Button, Heading, Link, Section, Text } from '@react-email/components'
import * as React from 'react'
import { Layout } from './components/layout'
import { getBaseUrl } from '@/lib/constants'

interface MagicLinkEmailProps {
  link: string
  iconUrl?: string
}

export const MagicLinkEmail = ({ link, iconUrl }: MagicLinkEmailProps) => (
  <Layout previewText="Access your resume on TidyResume" iconUrl={iconUrl}>
    <Heading style={h1}>Access your resume</Heading>
    <Text style={text}>
      Click the link below to edit your resume on this device. This link will
      expire in 15 minutes.
    </Text>
    <Section style={buttonContainer}>
      <Button style={button} href={link}>
        Edit Resume
      </Button>
    </Section>
    <Text style={text}>
      If the button doesn&apos;t work, copy and paste this URL into your
      browser:
    </Text>
    <Link href={link} style={linkText}>
      {link}
    </Link>
  </Layout>
)

export default MagicLinkEmail

const h1 = {
  fontSize: '24px',
  fontWeight: '600',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  margin: '16px 0',
  padding: '0',
  color: '#484848',
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}

const buttonContainer = {
  padding: '27px 0 27px',
}

const button = {
  backgroundColor: '#6366F1',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
}

const linkText = {
  color: '#067df7',
  textDecoration: 'none',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
}

MagicLinkEmail.PreviewProps = {
  link: `${getBaseUrl()}/edit?token=preview-token`,
  iconUrl: `${getBaseUrl()}/logo-icon.png`,
} as MagicLinkEmailProps
