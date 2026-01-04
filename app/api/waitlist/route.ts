import { getDb } from '@/lib/db';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { WaitlistWelcomeEmail } from '@/emails/waitlist-welcome';

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'footer' } = await request.json();

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Get request metadata
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get database connection
    const sql = getDb();

    // Insert into waitlist (ON CONFLICT handles duplicates gracefully)
    const result = await sql`
      INSERT INTO waitlist (email, source, ip_address, user_agent)
      VALUES (${email.toLowerCase()}, ${source}, ${ip}, ${userAgent})
      ON CONFLICT (email) DO UPDATE SET
        source = COALESCE(waitlist.source, EXCLUDED.source)
      RETURNING id, email, created_at
    `;

    const isNewSignup = result.length > 0;

    // Send welcome email for new signups
    const resend = getResend();
    if (isNewSignup && resend) {
      try {
        await resend.emails.send({
          from: 'Shift <hello@getshift.co>',
          to: email,
          subject: "You're on the list!",
          react: WaitlistWelcomeEmail({ email }),
        });
      } catch (emailError) {
        // Log but don't fail the request if email fails
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: isNewSignup
          ? "You're on the list! Check your email for confirmation."
          : "You're already on the list. We'll be in touch soon!"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// GET endpoint to check waitlist stats (protected, for internal use)
export async function GET(request: NextRequest) {
  // Simple auth check - in production, use proper authentication
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sql = getDb();
  const stats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      COUNT(CASE WHEN converted_at IS NOT NULL THEN 1 END) as converted,
      COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h
    FROM waitlist
  `;

  return NextResponse.json(stats[0]);
}
