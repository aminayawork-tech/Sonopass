import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'SonoPass <onboarding@sonopass.com>',
      to: email,
      subject: 'Verify your SonoPass email address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, #3abc83 0%, #2ea674 100%);">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          Sono<span style="color: #ffffff;">Pass</span>
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Verify Your Email Address</h2>
                        <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                          Thank you for signing up for SonoPass! To complete your registration and start studying for your registry exam, please verify your email address by clicking the button below:
                        </p>

                        <!-- Button -->
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="border-radius: 6px; background-color: #3abc83;">
                              <a href="${confirmLink}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                          Or copy and paste this link into your browser:<br>
                          <a href="${confirmLink}" style="color: #3abc83; word-break: break-all;">${confirmLink}</a>
                        </p>

                        <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                          If you didn't create a SonoPass account, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;">
                        <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                          © ${new Date().getFullYear()} SonoPass. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'SonoPass <onboarding@sonopass.com>',
      to: email,
      subject: 'Reset your SonoPass password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, #3abc83 0%, #2ea674 100%);">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          Sono<span style="color: #ffffff;">Pass</span>
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Reset Your Password</h2>
                        <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                          We received a request to reset your password for your SonoPass account. Click the button below to create a new password:
                        </p>

                        <!-- Button -->
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="border-radius: 6px; background-color: #3abc83;">
                              <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                          Or copy and paste this link into your browser:<br>
                          <a href="${resetLink}" style="color: #3abc83; word-break: break-all;">${resetLink}</a>
                        </p>

                        <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;">
                        <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                          © ${new Date().getFullYear()} SonoPass. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}

// Helper function to generate a random token
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
