import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../types'

export const stripeTemplateScript = `
<EMAIL name="Stripe Template" backgroundColor=#0a2540 linkColor=#635BFF>
  ROW padding=24,16,32,16 align=center maxWidth=650 backgroundColor=transparent backgroundImage=url(${getPhotoUrl('bg-gradient.png', 'stripe')}) backgroundPosition=left,bottom backgroundSize=cover backgroundRepeat=no-repeat {
    COLUMN width=100% {
      IMAGE src="${getPhotoUrl('stripe-logo-blue.png', 'stripe')}" alt="Stripe Logo" width=60 paddingBottom=16
      HEADING content=<p>The Update</p> level=h1 fontSize=72 fontWeight=bold color=#0a2540 paddingBottom=16
      TEXT content=<p>November 2024</p> fontSize=18 color=#2e3a55 padding=0,0,28,0
      IMAGE src="${getPhotoUrl('man-speaking.png', 'stripe')}" alt="Speaker presenting at Stripe Tour New York" width=100% borderRadius=16 paddingBottom=32
    }
  }

  ROW padding=36,16,0,16 align=center maxWidth=650 {
    COLUMN width=100% {
      HEADING content=<p>Product news from Stripe Tour New York</p> level=h2 fontSize=32 fontWeight=bold color=#0a2540 paddingBottom=12
      TEXT content=<p>We announced 45+ new product updates, including new payment methods and partnerships to help you increase your revenue globally and new embedded components for Issuing and Treasury.</p> fontSize=20 color=#425466 padding=0,0,20,0
      BUTTON content=<p>Read the blog</p> href="#" backgroundColor=#635BFF color=#FFFFFF borderRadius=24 padding=4,16,4,16 fontSize=14 fontWeight=bold
      DIVIDER padding=48,0,48,0
      HEADING content=<p>Product news</p> level=h2 fontSize=32 fontWeight=bold color=#0a2540 paddingBottom=24
    }
  }

  ROW padding=0,16,48,16 align=center maxWidth=650 stackOnMobile=true {
    COLUMN width=50% verticalAlign=top {
      IMAGE src="${getPhotoUrl('instant-bank-payments.png', 'stripe')}" alt="Instant Bank Payments interface example" width=100% borderRadius=16 paddingBottom=24
    }
    COLUMN width=50% verticalAlign=top {
      HEADING content=<p>Offer your customers more payment choices with Instant Bank Payments</p> level=h3 fontSize=20 fontWeight=bold color=#0a2540 paddingBottom=12
      TEXT content=<p>Instant Bank Payments is now available in the US, UK, and EU, enabling you to accept bank payments directly in your checkout. Customers can securely connect their bank account and authorize a payment in seconds.</p> fontSize=16 color=#425466
    }
  }

  ROW padding=0,16,48,16 align=center maxWidth=650 stackOnMobile=true {
    COLUMN width=50% verticalAlign=top {
      IMAGE src="${getPhotoUrl('cubes.png', 'stripe')}" alt="Isometric cube illustration" width=100% borderRadius=16 paddingBottom=24
    }
    COLUMN width=50% verticalAlign=top {
      HEADING content=<p>Launch new revenue lines in weeks</p> level=h3 fontSize=20 fontWeight=bold color=#0a2540 paddingBottom=12
      TEXT content=<p>Embed white-label payments and financial service workflows into your platform with new components for Stripe Issuing, Stripe Treasury, and reporting.</p> fontSize=16 color=#425466
    }
  }

  ROW padding=0,16,48,16 align=center maxWidth=650 stackOnMobile=true {
    COLUMN width=50% verticalAlign=top {
      IMAGE src="${getPhotoUrl('payments.png', 'stripe')}" alt="Stripe Payments logo" width=100% borderRadius=16 paddingBottom=24
    }
    COLUMN width=50% verticalAlign=top {
      HEADING content=<p>New payment methods to reach more buyers globally</p> level=h3 fontSize=20 fontWeight=bold color=#0a2540 paddingBottom=12
      TEXT content=<p>We've added more payment methods to the list of 100+ you can access with Stripe, including Billie, Capchase Pay, Kriya, Mondu, Satispay, seQura, and Sunbit. Your merchants can now enable new payment methods with no code in the Dashboard.</p> fontSize=16 color=#425466
    }
  }

  ROW padding=0,16,48,16 align=center maxWidth=650 {
    COLUMN width=100% {
      DIVIDER padding=0,0,48,0
      HEADING content=<p>Don't miss</p> level=h2 fontSize=32 fontWeight=bold color=#0a2540 paddingBottom=24
    }
  }

  ROW padding=0,16,48,16 align=center maxWidth=650 stackOnMobile=true {
    COLUMN width=50% verticalAlign=top {
      HEADING content=<p>Recommended reading</p> level=h3 fontSize=20 fontWeight=bold color=#0a2540 paddingBottom=12
      TEXT content=<p>• <a href="#" style="color: #635BFF;">Stripe's approach to AI</a></p> fontSize=16 color=#425466 paddingBottom=8
      TEXT content=<p>• <a href="#" style="color: #635BFF;">The state of payment methods</a></p> fontSize=16 color=#425466 paddingBottom=8
      TEXT content=<p>• <a href="#" style="color: #635BFF;">Stripe Sessions 2024</a></p> fontSize=16 color=#425466
    }
    COLUMN width=50% verticalAlign=top {
      HEADING content=<p>Want to learn more?</p> level=h3 fontSize=20 fontWeight=bold color=#0a2540 paddingBottom=12
      IMAGE src="${getPhotoUrl('docs.png', 'stripe')}" alt="Documentation illustration" width=100% borderRadius=16 paddingBottom=12
      TEXT content=<p>Check out our <a href="#" style="color: #635BFF;">documentation</a> to learn more about these updates.</p> fontSize=16 color=#425466
    }
  }

  ROW padding=0,16,48,16 align=center maxWidth=650 {
    COLUMN width=100% {
      DIVIDER padding=0,0,48,0
      TEXT content=<p>You received this email because you signed up for updates about new features and products from Stripe. You can <a href="#" style="color: #635BFF;">update your email preferences</a> at any time.</p> fontSize=14 color=#425466
    }
  }

  ROW padding=0,16,32,16 align=center maxWidth=650 backgroundColor=#f6f9fc {
    COLUMN width=50% {
      IMAGE src="${getPhotoUrl('stripe-logo-slate.png', 'stripe')}" alt="Stripe" width=60
    }
    COLUMN width=50% align=right {
      SOCIALS folder="stripe" socialLinks=[{"icon":"twitter","url":"https://twitter.com/stripe","title":"Twitter","alt":"Twitter"},{"icon":"linkedin","url":"https://linkedin.com/company/stripe","title":"LinkedIn","alt":"LinkedIn"},{"icon":"facebook","url":"https://facebook.com/stripe","title":"Facebook","alt":"Facebook"},{"icon":"github","url":"https://github.com/stripe","title":"GitHub","alt":"GitHub"}]
    }
  }

  ROW padding=32,16,32,16 align=center maxWidth=650 backgroundColor=#f6f9fc {
    COLUMN width=100% align=center {
      TEXT content=<p>© 2024 Stripe</p> fontSize=14 color=#425466 textAlign=center
      TEXT content=<p>354 Oyster Point Blvd, South San Francisco, CA 94080</p> fontSize=14 color=#425466 textAlign=center
      LINK content=<p>Privacy & Terms</p> href="#" fontSize=14 color=#425466 textDecoration=underline padding=0,8
      LINK content=<p>Unsubscribe</p> href="#" fontSize=14 color=#425466 textDecoration=underline padding=0,8
    }
  }
</EMAIL>
`

export const stripeTemplate = (): Email => {
  const rows = parseEmailScript(stripeTemplateScript)
  return createEmail(rows, '#0a2540', '#635BFF', 'Arial, sans-serif', 'transparent')
}
