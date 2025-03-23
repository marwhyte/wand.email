import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const outlineGoogleTemplateScript = (useImage: boolean) => `
<EMAIL styleVariant="outline" type="transactional" width="500">
  <ROW>
    <COLUMN>
      <IMAGE src="${useImage ? 'logo' : 'logo'}" alt="Company Logo" width="30%" />
      <HEADING level="h1">
        A new sign-in on Apple iPhone 15 Pro
      </HEADING>
      <TEXT>
        marcolwhyte@gmail.com
      </TEXT>
      <DIVIDER />
      <TEXT>
        We noticed a new sign-in to your Google Account on a Apple iPhone 15 Pro device. If this was you, you don't need to do anything. If not, we'll help you secure your account.
      </TEXT>
      <BUTTON>
        Check activity
      </BUTTON>
      <TEXT padding="0" fontSize="12" color="#5f6368">
        You can also see security activity at
      </TEXT>
      <LINK padding="0" fontSize="12">
        myactivity.google.com
      </LINK>
    </COLUMN>
  </ROW>
  <ROW type="footer">
    <COLUMN>
      <SOCIALS folder="socials-dark-gray">
        <SOCIAL icon="x" url="#" title="X" alt="X" />
        <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
        <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
      </SOCIALS>
      <TEXT>
        You received this email to let you know about important changes to your Google Account and services.
      </TEXT>
      <TEXT>
        © 2025 Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const googleTransactionalExample = `
<example>
  <user_query>Can you help me create an email for a Google account security alert?</user_query>

  <assistant_response>
  I'll create a Google account security alert email.

  ${outlineGoogleTemplateScript(false)}

  The template includes a clean header with the Google logo, a security alert message, and a footer with social media links and a copyright notice.
  </assistant_response>
</example>
`

export const outlineGoogleTemplate = (): Email => {
  const email = parseEmailScript(outlineGoogleTemplateScript(true), { id: '123', rows: [] })

  return createEmail(email)
}
