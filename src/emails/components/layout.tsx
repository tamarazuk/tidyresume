import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { getBaseUrl, APP_VERSION } from '@/lib/constants'

interface LayoutProps {
  children: React.ReactNode
  previewText: string
  iconUrl?: string
}

/**
 * A reusable layout component for all TidyResume emails.
 * Handles the standard HTML structure, head tags, branding header, and footer.
 */
export const Layout = ({
  children,
  previewText,
  iconUrl = `${getBaseUrl()}/logo-icon.png?v=${APP_VERSION}`,
}: LayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Brand Header */}
          <Section style={brandSection}>
            <Img
              src={iconUrl}
              width="40"
              height="40"
              alt="TidyResume"
              style={logo}
            />
            <Text style={brandText}>TidyResume</Text>
          </Section>

          {/* Main Content */}
          {children}

          {/* Standard Footer */}
          <Text style={footer}>
            This email was sent because you are using TidyResume. If you did not
            request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const brandSection = {
  marginBottom: '40px',
}

const logo = {
  borderRadius: '10px',
  display: 'inline-block',
  verticalAlign: 'middle',
}

const brandText = {
  color: '#484848',
  fontSize: '20px',
  fontWeight: '700',
  display: 'inline-block',
  verticalAlign: 'middle',
  margin: '0 0 0 12px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '30px',
  lineHeight: '16px',
}
