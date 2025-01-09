import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'

export const goingTemplate = (): Email => {
  const aiScript = `
  ROW padding=20,15,20,15 backgroundColor=#D7FFC2 {
    COLUMN align=center {
      TEXT text=<p>Clock's ticking on your limited time offer</p> fontWeight=bold
      LINK text=<p>You have 24 hours to save on your first year of Premium or Elite </p> href="/"
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
      HEADING text=<p><span style='color: #d7ffc2;'>Deals</span><strong> coming<span><br></span> your way</strong></p> as=h1 textAlign=center padding=0,0,30,0 fontSize=50 lineHeight=56 color=#fffef0
      TEXT text=<p>We are thrilled to help you never overpay for travel again. Keep your eyes peeled for deals from LAX and other departure airports you follow.</p> padding=0,0,30,0 color=#fffef0 fontSize=16
      BUTTON text=<p>VIEW MY CURRENT DEALS</p> href="/" borderRadius=30 backgroundColor=#483CFF fontWeight=bold padding=20,40,20,40
    }
  }

  ROW padding=60,15,30,15 backgroundColor=#004449 {
    COLUMN {
      IMAGE src=${getPhotoUrl('locations.png', 'going')} alt="Locations"
    }
  }

  ROW padding=60,15,30,15 {
    COLUMN align=center valign=top {
      TEXT text=<p>Tips to get the most bang for your buck with Going</p> textAlign=center padding=0,0,24,0 fontSize=24 lineHeight=32px fontWeight=bold
    }
  }

  ROW padding=15 verticalAlign=top {
    COLUMN align=center width=33% {
      IMAGE src=${getPhotoUrl('going-gif-1.gif', 'going')} width=70%
    }
    COLUMN valign=top width=66% {
      HEADING text=<p>Get the Going app.</p> as=h2 maxWidth=360 display=inline-block verticalAlign=middle textAlign=left fontSize=18 lineHeight=24px fontWeight=bold color=#004449 margin=0,0,16,0
      TEXT text=<p>Never miss a deal with real-time flight alerts. <a href='/' style='color: #483cff; text-decoration: underline'>Download on iOS and Android.</a></p> padding=10,0 display=inline-block verticalAlign=middle color=#004449
    }
  }

  ROW padding=15 verticalAlign=top {
    COLUMN align=center width=33% {
      IMAGE src=${getPhotoUrl('going-gif-2.gif', 'going')} width=70%
    }
    COLUMN valign=top width=66% {
      HEADING text=<p>Set up your airports.</p> as=h2 maxWidth=360 display=inline-block verticalAlign=middle textAlign=left fontSize=18 lineHeight=24px fontWeight=bold color=#004449 margin=0,0,16,0
      TEXT text=<p>You'll only receive deals from departure airports you follow. <a href='/' style='color: #483cff; text-decoration: underline'>Choose airports</a></p> padding=10,0 display=inline-block verticalAlign=middle color=#004449
    }
  }

  ROW padding=15 verticalAlign=top {
    COLUMN align=center width=33% {
      IMAGE src=${getPhotoUrl('going-gif-3.gif', 'going')} width=70%
    }
    COLUMN valign=top width=66% {
      HEADING text=<p>Check out your deals.</p> as=h2 maxWidth=360 display=inline-block verticalAlign=middle textAlign=left fontSize=18 lineHeight=24 fontWeight=bold color=#004449 margin=0,0,16,0
      TEXT text=<p>Access to Going's best domestic flights. <a href='/' style='color: #483cff; text-decoration: underline'>your deals</a></p> padding=10,0 display=inline-block verticalAlign=middle color=#004449
    }
  }

  ROW padding=30 {
    COLUMN align=center {
      TEXT text=<p>© Going</p> fontSize=12 padding=24,0,0,0
      TEXT text=<p>4845 Pearl East Circle, Suite 118<br>PMB 28648<br>Boulder, CO 80301-6112</p> fontSize=12
      TEXT text=<p><a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Advertise</a> | <a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Email Preferences</a> | <a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Unsubscribe</a></p> fontSize=12 padding=0,4
    }
  }

  ROW padding=24,0,0,0 textAlign=center fontStyle=italic {
    COLUMN {
      TEXT text=<p>Offer not combinable with other discounts or previous subscriptions. Redeemable only at <a href='www.going.com'>www.going.com</a></p> fontSize=12
    }
  }`

  return createEmail('Going Template', parseEmailScript(aiScript), '#004449', '#004449')
}
