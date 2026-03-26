
export const emailTemplate = async ({ code, message }) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${message}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 40px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Social Media App</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${message}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;color:#374151;font-size:16px;font-weight:600;">Verify your email address</p>
              <p style="margin:0 0 32px;color:#6b7280;font-size:14px;line-height:1.6;">
                Use the verification code below to complete your registration. This code expires in <strong>3 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#f5f3ff;border:2px dashed #8b5cf6;border-radius:12px;padding:20px 48px;">
                      <span style="font-size:38px;font-weight:800;letter-spacing:12px;color:#6366f1;">${code}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;color:#9ca3af;font-size:13px;text-align:center;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.<br/>
                Do not share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} Social Media App. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

