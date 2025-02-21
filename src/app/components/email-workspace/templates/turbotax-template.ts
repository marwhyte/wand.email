import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../types'

export const turbotaxTemplateScript = `
<EMAIL name="TurboTax Filing Preparation" backgroundColor=#dfdfd8 linkColor=#205ea3 color=#333333 fontFamily="Lato, Arial, sans-serif">
  ROW padding=40,16,16,16 backgroundColor=#fcfcfc {
    COLUMN width=100% align=center {
      IMAGE src="${getPhotoUrl('intuit-turbotax.png', 'turbotax')}" alt="Intuit TurboTax Logo" width=160
    }
  }

  ROW padding=0,16,30,16 hideOnMobile=true backgroundColor=#fcfcfc {
    COLUMN width=25% align=center {
      LINK text=<p>Blog</p> href="#" color=#393a3d fontSize=14 fontWeight=bold textAlign=center textDecoration=none
    }
    COLUMN width=25% align=center {
      LINK text=<p>Tax Calculators</p> href="#" color=#393a3d fontSize=14 fontWeight=bold textAlign=center textDecoration=none
    }
    COLUMN width=25% align=center {
      LINK text=<p>Podcast</p> href="#" color=#393a3d fontSize=14 fontWeight=bold textAlign=center textDecoration=none
    }
    COLUMN width=25% align=center {
      LINK text=<p>Sign in</p> href="#" color=#393a3d fontSize=14 fontWeight=bold textAlign=center textDecoration=none
    }
  }

  ROW padding=14,16,14,16 maxWidth=420 align=center backgroundColor=#EAEAE3 {
    COLUMN width=16.67% verticalAlign=middle {
      IMAGE src="${getPhotoUrl('flag.png', 'turbotax')}" alt="Status Flag" width=100%
    }
    COLUMN width=83.33% verticalAlign=middle {
      TEXT text=<p>STATUS: Tax Hero</p> fontSize=18 color=#21262a fontWeight=bold paddingLeft=8
      TEXT text=<p>You're one of the most savvy tax planners out there. Keep it up!</p> fontSize=18 color=#21262a paddingLeft=8
    }
  }

  ROW padding=32,16,32,16 maxWidth=420 align=center backgroundColor=#F4F4EF {
    COLUMN width=100% {
      HEADING text=<p>Marco: Know which documents you'll need when it's time to file</p> as=h1 fontSize=32px lineHeight=36px fontWeight=bold color=#21262a textAlign=center paddingBottom=24 letterSpacing=-0.03em
    }
  }

  ROW padding=0,0,40,0 maxWidth=420 align=center backgroundColor=#F4F4EF {
    COLUMN align=center {
      IMAGE src="${getPhotoUrl('sitting-in-chair.gif', 'turbotax')}" alt="Person sitting with cat" width=100% textAlign=center
      TEXT text=<p>Changes this year could impact your taxes. Answer a few questions today to get the tax checklist that will get you prepared for filing.</p> fontSize=18 lineHeight=24px color=#21262a letterSpacing=-0.03em textAlign=center padding=24,0,24,0
      BUTTON text=<p>Get my checklist</p> href="#" backgroundColor=#205ea3 color=#FFFFFF borderRadius=5 padding=24,48,24,48 fontSize=20 fontWeight=bold textAlign=center
    }
  }

  ROW padding=32,16,32,16 backgroundColor=#fcfcfc {
    COLUMN width=20% {
      IMAGE src="${getPhotoUrl('intuit.png', 'turbotax')}" alt="Intuit Logo" width=100%
    }
    COLUMN width=20% {
      IMAGE src="${getPhotoUrl('turbotax.png', 'turbotax')}" alt="TurboTax Logo" width=100%
    }
    COLUMN width=20% {
      IMAGE src="${getPhotoUrl('quickbooks.png', 'turbotax')}" alt="QuickBooks Logo" width=100%
    }
    COLUMN width=20% {
      IMAGE src="${getPhotoUrl('credit-karma.png', 'turbotax')}" alt="Credit Karma Logo" width=100%
    }
    COLUMN width=20% {
      IMAGE src="${getPhotoUrl('mailchimp.png', 'turbotax')}" alt="Mailchimp Logo" width=100%
    }
  }

  ROW padding=32,16,32,16 backgroundColor=#fcfcfc {
    COLUMN {
      TEXT text=<p><strong>We're looking out for you</strong><br><br>We'll never ask for personal information in an email. When you click on a link, the address should always contain intuit.com/.<br><br><a href="#" style="color: #205ea3; text-decoration: underline;">Click here</a> to see TurboTax product guarantees, disclaimers and other important information.<br><br>This email was sent to: <strong>testing@gmail.com</strong><br><br>Did you receive this email in error? <a href="#" style="color: #205ea3; text-decoration: underline;">Find out why</a>.<br>Update your email preferences or <a href="#" style="color: #205ea3; text-decoration: underline;">unsubscribe</a>.<br><br><strong>©2024 Intuit Inc. All rights reserved. Trademark.</strong><br>Customer Communications, 2800 E. Commerce Center Place, Tucson, AZ 85706</p> fontSize=12 color=#333333
    }
  }
</EMAIL>
`

export const turbotaxTemplate = (): Email => {
  const rows = parseEmailScript(turbotaxTemplateScript)
  return createEmail('TurboTax Filing Preparation', rows, '#333333', '#205ea3', 'Lato, Arial, sans-serif', '#dfdfd8', '600px')
}
