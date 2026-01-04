import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WaitlistWelcomeEmailProps {
  email: string;
}

export function WaitlistWelcomeEmail({ email }: WaitlistWelcomeEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getshift.co';
  const logoUrl = `${siteUrl}/logo.png`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to Shift! You're on the list.</Preview>
      <Body style={main}>
        {/* Header Logo */}
        <Section style={headerSection}>
          <Img
            src={logoUrl}
            width="32"
            height="32"
            alt="Shift"
            style={headerLogo}
          />
        </Section>

        {/* Main Card */}
        <Container style={card}>
          <Section style={content}>
            <Heading style={heading}>Welcome to Shift!</Heading>
            <Heading as="h2" style={subheading}>You're on the list! 🎯</Heading>

            <Text style={paragraph}>
              Thanks for joining the Shift waitlist. You'll be among the first to discover
              careers you're already qualified for.
            </Text>

            <Text style={sectionTitle}>
              What happens next?
            </Text>

            <Text style={listItem}>• We'll notify you the moment Shift launches</Text>
            <Text style={listItem}>• Early access members get exclusive pricing</Text>
            <Text style={listItem}>• You'll receive occasional updates on our progress</Text>

            <Text style={sectionTitle}>
              In the meantime...
            </Text>

            <Text style={paragraph}>
              Start thinking about where you want to be. Shift analyzes your real experience
              to find careers that match your skills — not just your job title.
            </Text>

            <Text style={paragraph}>
              Your next career isn't hiding. It's waiting for you to claim it.
            </Text>
          </Section>
        </Container>

        {/* Footer */}
        <Section style={footer}>
          <Img
            src={logoUrl}
            width="24"
            height="24"
            alt="Shift"
            style={footerLogo}
          />
          <Text style={footerText}>
            © {new Date().getFullYear()} WhatMatters / Shift. All Rights Reserved.
          </Text>
          <Text style={footerText}>
            5900 Balcones Drive, STE 100, Austin, TX, 78731, US
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#FEF7F5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: '40px 20px',
};

const headerSection = {
  textAlign: 'center' as const,
  padding: '0 0 32px',
};

const headerLogo = {
  margin: '0 auto',
};

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '600px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
};

const content = {
  padding: '48px',
};

const heading = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.2',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const subheading = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '400',
  lineHeight: '1.3',
  margin: '0 0 32px',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const sectionTitle = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '1.6',
  margin: '24px 0 12px',
};

const listItem = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0',
  paddingLeft: '8px',
};

const footer = {
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const footerLogo = {
  margin: '0 auto 16px',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 4px',
  textAlign: 'center' as const,
};

export default WaitlistWelcomeEmail;
