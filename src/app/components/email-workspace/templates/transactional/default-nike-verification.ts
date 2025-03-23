import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../../types'

export const defaultNikeVerificationTemplateScript = (useImage: boolean) => `
<EMAIL type=transactional styleVariant=default>
  ROW type=header {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('nike-logo.png', 'nike-verification') : 'logo'} alt="Nike logo"
    }
  }
  
  ROW {
    COLUMN {
      HEADING content=<p>Your Nike Member profile code</p> level=h1
      TEXT content=<p>Here's the one-time verification code you requested:</p>
    }
  }
  
  ROW {
    COLUMN {
      DIVIDER
      HEADING content=<p>17586839</p> textAlign=center
      DIVIDER
    }
  }
  
  ROW {
    COLUMN {
      HEADING content=<p>This code expires after 15 minutes.</p> level=h3
      TEXT content=<p>If you've already received this code or don't need it anymore, ignore this email.</p>
    }
  }
  
  ROW type=footer {
    COLUMN {
      LINK content=<p>Nike.com</p> href="https://www.nike.com" color=#000000 fontSize=24 fontWeight=bold
      DIVIDER
      TEXT content=<p>© 2024 <strong>Nike</strong>, Inc. All Rights Reserved<br>One Bowerman Drive, Beaverton, Oregon 97005</p>
      TEXT content=<p><a href="/">Privacy Policy</a>  &nbsp;&nbsp; <a href="/">Get Help</a></p>
    }
  }
</EMAIL>
`

export const nikeTransactionalExample = `
<example>
  <user_query>Can you help me create an email for a Nike verification code?</user_query>

  <assistant_response>
  I'll create a Nike verification code email.

  ${defaultNikeVerificationTemplateScript(false)}

  The template includes a clean header with the Nike logo, a verification code, and a footer with a link to Nike.com and a copyright notice.
  </assistant_response>
</example>
`
export const defaultNikeVerificationTemplate = (): Email => {
  return createEmail(parseEmailScript(defaultNikeVerificationTemplateScript(true), { id: '123', rows: [] }))
}
