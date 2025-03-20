import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../../types'

export const turbotaxTemplateScript = `
<EMAIL backgroundColor=#dfdfd8 color=#333333 fontFamily="Lato, Arial, sans-serif" linkColor=#205ea3 rowBackgroundColor=#fcfcfc width=600>
ROW backgroundColor=#fcfcfc padding=40,16,16,16 {
  COLUMN {
    IMAGE alt="Intuit TurboTax Logo" src="${getPhotoUrl('intuit-turbotax.png', 'turbotax')}" width=160px
  }
}

ROW backgroundColor=#fcfcfc hideOnMobile=true padding=0,16,30,16 {
  COLUMN {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" content=<p>Blog</p> align=center
  }
  COLUMN {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" content=<p>Tax Calculators</p> align=center
  }
  COLUMN {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" content=<p>Podcast</p> align=center
  }
  COLUMN {
    LINK color=#393a3d fontSize=14 fontWeight=bold href="#" content=<p>Sign in</p> align=center
    TABLE rows=[[<p><strong>S&P 500</strong></p>,<p><strong>5,615</strong></p>,<p><span style=\"color: rgb(179, 25, 25)\">-1.07%</span></p>],[<p><strong>Nasdaq</strong></p>,<p><strong>17,504</strong></p>,<p><span style=\"color: rgb(179, 25, 25)\">-1.27%</span></p>]]
  }
}

ROW verticalAlign=middle backgroundColor=#EAEAE3 padding=14,16 {
  COLUMN width=16.67% {
    IMAGE alt="Status Flag" src="${getPhotoUrl('flag.png', 'turbotax')}" width=100%
  }
  COLUMN width=83.33% {
    TEXT color=#21262a fontSize=18 fontWeight=bold padding=0,0,0,8 content=<p>STATUS: Tax Hero</p>
    TEXT color=#21262a fontSize=18 padding=0,0,0,8 content=<p>You're one of the most savvy tax planners out there. Keep it up!</p>
  }
}

ROW backgroundColor=#F4F4EF padding=32,16 {
  COLUMN {
    HEADING level=h1 color=#21262a fontSize=32 fontWeight=bold letterSpacing=-0.03em padding=0,0,24,0 content=<p>Marco: Know which documents you'll need when it's time to file</p> textAlign=center
  }
}

ROW backgroundColor=#F4F4EF padding=0,0,40,0 {
  COLUMN {
    IMAGE alt="Person sitting with cat" src="${getPhotoUrl('sitting-in-chair.gif', 'turbotax')}" align=center width=100%
    TEXT color=#21262a fontSize=18 letterSpacing=-0.03em padding=24,0 content=<p>Changes this year could impact your taxes. Answer a few questions today to get the tax checklist that will get you prepared for filing.</p> textAlign=center
    BUTTON backgroundColor=#205ea3 borderRadius=5 color=#FFFFFF fontSize=20 fontWeight=bold href="#" padding=24,48 content=<p>Get my checklist</p> align=center
  }
}

ROW backgroundColor=#fcfcfc padding=32,16 {
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

ROW backgroundColor=#fcfcfc padding=32,16 {
  COLUMN {
    TEXT color=#333333 fontSize=12 content=<p><strong>We're looking out for you</strong><br><br>We'll never ask for personal information in an email. When you click on a link, the address should always contain intuit.com/.<br><br><a href="#" style="color: #205ea3; text-decoration: underline;">Click here</a> to see TurboTax product guarantees, disclaimers and other important information.<br><br>This email was sent to: <strong>testing@gmail.com</strong><br><br>Did you receive this email in error? <a href="#" style="color: #205ea3; text-decoration: underline;">Find out why</a>.<br>Update your email preferences or <a href="#" style="color: #205ea3; text-decoration: underline;">unsubscribe</a>.<br><br><strong>©2024 Intuit Inc. All rights reserved. Trademark.</strong><br>Customer Communications, 2800 E. Commerce Center Place, Tucson, AZ 85706</p>
  }
}
</EMAIL>
`

export const turbotaxTemplate = (): Email => {
  const rows = parseEmailScript(turbotaxTemplateScript, { id: '123', rows: [] })
  return createEmail(rows, '#333333', '#205ea3', 'Lato, Arial, sans-serif', '#dfdfd8', '#fcfcfc', '600')
}
