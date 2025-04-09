import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const defaultNikeVerificationTemplateScript = (useImage: boolean) => `
<EMAIL type="transactional" styleVariant="default">
  <ROW type="header">
    <COLUMN>
      <IMAGE src="logo" alt="Company logo" />
    </COLUMN>
  </ROW>
  
  <ROW>
    <COLUMN>
      <HEADING level="h1">
        Your verification code
      </HEADING>
      <TEXT>
        Here's the one-time verification code you requested:
      </TEXT>
    </COLUMN>
  </ROW>
  
  <ROW>
    <COLUMN>
      <DIVIDER />
      <HEADING textAlign="center">
        17586839
      </HEADING>
      <DIVIDER />
    </COLUMN>
  </ROW>
  
  <ROW>
    <COLUMN>
      <HEADING level="h3">
        This code expires after 15 minutes.
      </HEADING>
      <TEXT>
        If you've already received this code or don't need it anymore, ignore this email.
      </TEXT>
    </COLUMN>
  </ROW>
  
  <ROW type="footer">
    <COLUMN>
      <LINK href="https://www.example.com" color="#000000" fontSize="24" fontWeight="bold">
        Example.com
      </LINK>
      <DIVIDER />
      <TEXT>
        © 2024 <strong>Company Name</strong>, Inc. All Rights Reserved<br>123 Main Street, Springfield, IL 62701
      </TEXT>
      <TEXT>
        <a href="/">Privacy Policy</a>  &nbsp;&nbsp; <a href="/">Get Help</a>
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const nikeTransactionalExample = `
<example>
  <user_query>Can you help me create an email for a verification code?</user_query>

  <assistant_response>
  I'll create a verification code email.

  ${defaultNikeVerificationTemplateScript(false)}

  The template includes a clean header with your company logo, a verification code, and a footer with a link to your website and a copyright notice.
  </assistant_response>
</example>
`
export const defaultNikeVerificationTemplate = (): Email => {
  return createEmail(parseEmailScript(defaultNikeVerificationTemplateScript(true), '#000000', 'rounded'))
}
