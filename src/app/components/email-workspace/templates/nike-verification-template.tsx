import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../types'

export const nikeVerificationTemplate = (): Email => {
  const aiScript = `
<EMAIL name="Nike Verification Code" backgroundColor=#000000 linkColor=#000000>
  ROW padding=32,32 align=center {
    COLUMN align=center {
      IMAGE src=${getPhotoUrl('nike-logo.png', 'nike-verification')} alt="Nike logo"
    }
  }
  
  ROW padding=16 align=left {
    COLUMN align=left {
      HEADING text=<p>Your Nike Member profile code</p> fontSize=24 fontWeight=bold padding=0,0,8,0
      TEXT text=<p>Here's the one-time verification code you requested:</p> padding=8,0,16,0 lineHeight=1.5
    }
  }
  
  ROW {
    COLUMN {
      DIVIDER padding=8,0
      HEADING text=<p>17586839</p> fontSize=32 fontWeight=bold padding=24,0,24,0 textAlign=center
      DIVIDER padding=24,0,8,0
    }
  }
  
  ROW padding=16 {
    COLUMN align=left {
      TEXT text=<p>This code expires after 15 minutes.</p> padding=8,0 fontWeight=bold
      TEXT text=<p>If you've already received this code or don't need it anymore, ignore this email.</p> padding=8,0,16,0
    }
  }
  
  ROW padding=16 {
    COLUMN align=center {
      LINK text=<p>Nike.com</p> href="https://www.nike.com" fontSize=24 fontWeight=bold padding=0,0,8,0 textDecoration=none
      DIVIDER padding=16,0
      TEXT text=<p>© 2024 <strong>Nike</strong>, Inc. All Rights Reserved<br>One Bowerman Drive, Beaverton, Oregon 97005</p> fontSize=12 color=#ababab padding=8,0,8,0
      TEXT text=<p>Privacy Policy  &nbsp;&nbsp; Get Help</p> fontSize=12 color=#ababab padding=8,0,0,0
    }
  }
</EMAIL>
`

  return createEmail(
    parseEmailScript(aiScript),
    '#000000',
    '#000000',
    'Helvetica Neue, Arial, sans-serif',
    '#FFFFFF',
    '400'
  )
}
