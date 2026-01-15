import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface MagicLinkEmailProps {
  link: string
}

export const MagicLinkEmail = ({ link }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Access your resume on TidyResume</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Access your resume</Heading>
        <Text style={text}>
          Click the link below to edit your resume on this device. This link will expire in 15 minutes.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={link}>
            Edit Resume
          </Button>
        </Section>
        <Text style={text}>
          If the button doesn&apos;t work, copy and paste this URL into your browser:
        </Text>
        <Link href={link} style={linkText}>
          {link}
        </Link>
        <Text style={footer}>
          This email was sent because you requested a magic link for your resume on TidyResume. If you didn&apos;t request this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

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
  backgroundColor: '#000000',
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

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '30px',
  lineHeight: '16px',
}
