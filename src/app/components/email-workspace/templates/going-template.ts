import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'

export const goingTemplateScript = `
<EMAIL name="Going Template" backgroundColor=#D7FFC2 linkColor=#004449>
  ROW padding=20,15,20,15 backgroundColor=#D7FFC2 {
    COLUMN align=center {
      TEXT content=<p>Clock's ticking on your limited time offer</p> fontWeight=bold
      LINK content=<p>You have 24 hours to save on your first year of Premium or Elite </p> href="/"
      IMAGE src=${getPhotoUrl('plane.png', 'going')} width=16 height=16 display=inline-block alt="plane logo"
    }
  }

  ROW padding=30,0,0,0 backgroundColor=#004449 {
    COLUMN align=center {
      IMAGE src=${getPhotoUrl('going-logo.png', 'going')} alt="Going logo" width=20%
    }
  }

  ROW padding=30 backgroundColor=#004449 {
    COLUMN align=center {
      HEADING content=<p><span style='color: #d7ffc2;'>Deals</span><strong> coming<span><br></span> your way</strong></p> level=h1 textAlign=center padding=0,0,30,0 fontSize=50 color=#fffef0
      TEXT content=<p>We are thrilled to help you never overpay for travel again. Keep your eyes peeled for deals from LAX and other departure airports you follow.</p> padding=0,0,30,0 color=#fffef0 fontSize=16
      BUTTON content=<p>VIEW MY CURRENT DEALS</p> href="/" borderRadius=30 backgroundColor=#483CFF fontWeight=bold padding=20,40,20,40
    }
  }

  ROW padding=60,15,30,15 backgroundColor=#004449 {
    COLUMN {
      IMAGE src=${getPhotoUrl('locations.png', 'going')} alt="Locations"
    }
  }

  ROW padding=60,15,30,15 {
    COLUMN align=center verticalAlign=top {
      TEXT content=<p>Tips to get the most bang for your buck with Going</p> textAlign=center padding=0,0,24,0 fontSize=24 fontWeight=bold
    }
  }

  ROW padding=15 verticalAlign=top {
    COLUMN align=center width=33% {
      IMAGE src=${getPhotoUrl('going-gif-1.gif', 'going')} width=70%
    }
    COLUMN verticalAlign=top width=66% {
      HEADING content=<p>Get the Going app.</p> level=h2 maxWidth=360 display=inline-block verticalAlign=middle textAlign=left fontSize=18 fontWeight=bold color=#004449 margin=0,0,16,0
      TEXT content=<p>Never miss a deal with real-time flight alerts. <a href='/' style='color: #483cff; text-decoration: underline'>Download on iOS and Android.</a></p> padding=10,0 display=inline-block verticalAlign=middle color=#004449
    }
  }

  ROW padding=15 verticalAlign=top {
    COLUMN align=center width=33% {
      IMAGE src=${getPhotoUrl('going-gif-2.gif', 'going')} width=70%
    }
    COLUMN verticalAlign=top width=66% {
      HEADING content=<p>Set up your airports.</p> level=h2 maxWidth=360 display=inline-block verticalAlign=middle textAlign=left fontSize=18 fontWeight=bold color=#004449 margin=0,0,16,0
      TEXT content=<p>You'll only receive deals from departure airports you follow. <a href='/' style='color: #483cff; text-decoration: underline'>Choose airports</a></p> padding=10,0 display=inline-block verticalAlign=middle color=#004449
    }
  }

  ROW padding=15 verticalAlign=top {
    COLUMN align=center width=33% {
      IMAGE src=${getPhotoUrl('going-gif-3.gif', 'going')} width=70%
    }
    COLUMN verticalAlign=top width=66% {
      HEADING content=<p>Check out your deals.</p> level=h2 maxWidth=360 display=inline-block verticalAlign=middle textAlign=left fontSize=18 fontWeight=bold color=#004449 margin=0,0,16,0
      TEXT content=<p>Access to Going's best domestic flights. <a href='/' style='color: #483cff; text-decoration: underline'>your deals</a></p> padding=10,0 display=inline-block verticalAlign=middle color=#004449
    }
  }

  ROW padding=30 {
    COLUMN align=center {
      TEXT content=<p>© Going</p> fontSize=12 padding=24,0,0,0
      TEXT content=<p>4845 Pearl East Circle, Suite 118<br>PMB 28648<br>Boulder, CO 80301-6112</p> fontSize=12
      TEXT content=<p><a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Advertise</a> | <a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Email Preferences</a> | <a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Unsubscribe</a></p> fontSize=12 padding=0,4
    }
  }

  ROW padding=24,0,0,0 textAlign=center fontStyle=italic {
    COLUMN {
      TEXT content=<p>Offer not combinable with other discounts or previous subscriptions. Redeemable only at <a href='www.going.com'>www.going.com</a></p> fontSize=12
    }
  }
</EMAIL>
`

export const goingTemplate = createEmail(parseEmailScript(goingTemplateScript), '#004449', '#004449')
