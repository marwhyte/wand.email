import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const magicLinkTemplateScript = (useImage: boolean) => `
<EMAIL preview="Sign up or log in to our app!" styleVariant="default" type="transactional">
  <ROW type="header">
    <COLUMN>
      <IMAGE src="logo" alt="Company logo" />
    </COLUMN>
  </ROW>

  <ROW type="content">
    <COLUMN>
      <HEADING level="h1">
        Your sign-in link
      </HEADING>
      <BUTTON align="left" borderRadius="5" href="/">
        Click to sign-in to Company Name
      </BUTTON>
      <TEXT color="#787878">
        This link will automatically detect if you have an existing account. If not, it will guide you through the sign-up process.
      </TEXT>
      <TEXT color="#787878">
        If you have any questions, feel free to contact our support team.
      </TEXT>
      <LINK align="left" fontSize="14" href="mailto:support@companyname.com">
        Contact Support
      </LINK>
    </COLUMN>
  </ROW>

  <ROW type="footer">
    <COLUMN>
      <TEXT>
        You've received this email because you signed up for Company Name
      </TEXT>
      <TEXT>
        123 Main Street, Springfield, IL 62701
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const magicLinkTemplate = (): Email => {
  return parseEmailScript(magicLinkTemplateScript(true))
}
