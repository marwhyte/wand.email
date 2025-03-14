import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../types'

export const turbotaxTemplateScript = `
<EMAIL backgroundColor=#dfdfd8 color=#333333 fontFamily="Lato, Arial, sans-serif" linkColor=#205ea3 rowBgColor=#fcfcfc width=600>
ROW backgroundColor=#fcfcfc padding=40,16,16,16 {
  COLUMN align=center {
    IMAGE alt="Intuit TurboTax Logo" src="${getPhotoUrl('intuit-turbotax.png', 'turbotax')}" width=160px
  }
}

ROW backgroundColor=#fcfcfc hideOnMobile=true padding=0,16,30,16 {
  COLUMN align=center {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" text=<p>Blog</p> textAlign=center textDecoration=none
  }
  COLUMN align=center {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" text=<p>Tax Calculators</p> textAlign=center textDecoration=none
  }
  COLUMN align=center {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" text=<p>Podcast</p> textAlign=center textDecoration=none
  }
  COLUMN align=center {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" text=<p>Sign in</p> textAlign=center textDecoration=none
  }
}

ROW align=center backgroundColor=#EAEAE3 maxWidth=420 padding=14,16,14,16 {
  COLUMN verticalAlign=middle width=16.67% {
    IMAGE alt="Status Flag" src="${getPhotoUrl('flag.png', 'turbotax')}" width=100%
  }
  COLUMN verticalAlign=middle width=83.33% {
    TEXT color=#21262a fontSize=18 fontWeight=bold padding=0,0,0,8 text=<p>STATUS: Tax Hero</p>
    TEXT color=#21262a fontSize=18 padding=0,0,0,8 text=<p>You're one of the most savvy tax planners out there. Keep it up!</p>
  }
}

ROW align=center backgroundColor=#F4F4EF maxWidth=420 padding=32,16,32,16 {
  COLUMN {
    HEADING as=h1 color=#21262a fontSize=32 fontWeight=bold letterSpacing=-0.03em padding=0,0,24,0 text=<p>Marco: Know which documents you'll need when it's time to file</p> textAlign=center
  }
}

ROW align=center backgroundColor=#F4F4EF maxWidth=420 padding=0,0,40,0 {
  COLUMN align=center {
    IMAGE alt="Person sitting with cat" src="${getPhotoUrl('sitting-in-chair.gif', 'turbotax')}" textAlign=center width=100%
    TEXT color=#21262a fontSize=18 letterSpacing=-0.03em padding=24,0,24,0 text=<p>Changes this year could impact your taxes. Answer a few questions today to get the tax checklist that will get you prepared for filing.</p> textAlign=center
    BUTTON backgroundColor=#205ea3 borderRadius=5 color=#FFFFFF fontSize=20 fontWeight=bold href="#" padding=24,48,24,48 text=<p>Get my checklist</p> textAlign=center
  }
}

ROW backgroundColor=#fcfcfc padding=32,16,32,16 {
  COLUMN {
    IMAGE alt="Intuit Logo" src="${getPhotoUrl('intuit.png', 'turbotax')}" width=100%
  }
  COLUMN {
    IMAGE alt="TurboTax Logo" src="${getPhotoUrl('turbotax.png', 'turbotax')}" width=100%
  }
  COLUMN {
    IMAGE alt="QuickBooks Logo" src="${getPhotoUrl('quickbooks.png', 'turbotax')}" width=100%
  }
  COLUMN {
    IMAGE alt="Credit Karma Logo" src="${getPhotoUrl('credit-karma.png', 'turbotax')}" width=100%
  }
  COLUMN {
    IMAGE alt="Mailchimp Logo" src="${getPhotoUrl('mailchimp.png', 'turbotax')}" width=100%
  }
}

ROW backgroundColor=#fcfcfc padding=32,16,32,16 {
  COLUMN {
    TEXT color=#333333 fontSize=12 text=<p><strong>We're looking out for you</strong><br><br>We'll never ask for personal information in an email. When you click on a link, the address should always contain intuit.com/.<br><br><a href="#" style="color: #205ea3; text-decoration: underline;">Click here</a> to see TurboTax product guarantees, disclaimers and other important information.<br><br>This email was sent to: <strong>testing@gmail.com</strong><br><br>Did you receive this email in error? <a href="#" style="color: #205ea3; text-decoration: underline;">Find out why</a>.<br>Update your email preferences or <a href="#" style="color: #205ea3; text-decoration: underline;">unsubscribe</a>.<br><br><strong>©2024 Intuit Inc. All rights reserved. Trademark.</strong><br>Customer Communications, 2800 E. Commerce Center Place, Tucson, AZ 85706</p>
  }
}
</EMAIL>
`

export const turbotaxTemplate = (): Email => {
  const rows = parseEmailScript(turbotaxTemplateScript)
  return createEmail(rows, '#333333', '#205ea3', 'Lato, Arial, sans-serif', '#dfdfd8', '#fcfcfc', '600')
}
