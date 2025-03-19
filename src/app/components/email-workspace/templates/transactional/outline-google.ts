import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const transactionalOutlineGoogleTemplateScript = `
<EMAIL styleVariant=outline type=transactional width=500>
  ROW {
    COLUMN {
      IMAGE src="logo" alt="Company Logo" width=30%
      HEADING level=h1 content=<p>A new sign-in on Apple iPhone 15 Pro</p>
      TEXT content=<p>marcolwhyte@gmail.com</p>
      DIVIDER
      TEXT content=<p>We noticed a new sign-in to your Google Account on a Apple iPhone 15 Pro device. If this was you, you don’t need to do anything. If not, we’ll help you secure your account.</p>
      BUTTON content=<p>Check activity</p>
      TEXT padding=0 fontSize=12 color=#5f6368 content=<p>You can also see security activity at</p>
      LINK padding=0 fontSize=12 content=<p>myactivity.google.com</p>
    }
  }
  ROW type=footer {
    COLUMN {
      SOCIALS folder=socials-dark-gray links=[{"icon":"x","url":"#","title":"X","alt":"X"},{"icon":"facebook","url":"#","title":"Facebook","alt":"Facebook"},{"icon":"instagram","url":"#","title":"Instagram","alt":"Instagram"}]
      TEXT content=<p>You received this email to let you know about important changes to your Google Account and services.</p>
      TEXT content=<p>© 2025 Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</p>
    }
  }
</EMAIL>
`

export const transactionalOutlineGoogleTemplate = (): Email => {
  const email = parseEmailScript(transactionalOutlineGoogleTemplateScript, { id: '123', rows: [] })

  console.log(email, 'email')
  return createEmail(email)
}
