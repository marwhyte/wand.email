import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../../types'

export const stripeTemplateScript = `
<EMAIL name="Stripe Template" backgroundColor="#0a2540" linkColor="#635BFF">
  <ROW padding="24,16,32,16" align="center" maxWidth="650" backgroundColor="transparent" backgroundImage="url(${getPhotoUrl('bg-gradient.png', 'stripe')})" backgroundPosition="left,bottom" backgroundSize="cover" backgroundRepeat="no-repeat">
    <COLUMN width="100%">
      <IMAGE src="${getPhotoUrl('stripe-logo-blue.png', 'stripe')}" alt="Stripe Logo" width="60" paddingBottom="16" />
      <HEADING level="h1" fontSize="72" fontWeight="bold" color="#0a2540" paddingBottom="16">
        The Update
      </HEADING>
      <TEXT fontSize="18" color="#2e3a55" padding="0,0,28,0">
        November 2024
      </TEXT>
      <IMAGE src="${getPhotoUrl('man-speaking.png', 'stripe')}" alt="Speaker presenting at Stripe Tour New York" width="100%" borderRadius="16" paddingBottom="32" />
    </COLUMN>
  </ROW>

  <ROW padding="36,16,0,16" align="center" maxWidth="650">
    <COLUMN width="100%">
      <HEADING level="h2" fontSize="32" fontWeight="bold" color="#0a2540" paddingBottom="12">
        Product news from Stripe Tour New York
      </HEADING>
      <TEXT fontSize="20" color="#425466" padding="0,0,20,0">
        We announced 45+ new product updates, including new payment methods and partnerships to help you increase your revenue globally and new embedded components for Issuing and Treasury.
      </TEXT>
      <BUTTON href="#" backgroundColor="#635BFF" color="#FFFFFF" borderRadius="24" padding="4,16,4,16" fontSize="14" fontWeight="bold">
        Read the blog
      </BUTTON>
      <DIVIDER padding="48,0,48,0" />
      <HEADING level="h2" fontSize="32" fontWeight="bold" color="#0a2540" paddingBottom="24">
        Product news
      </HEADING>
    </COLUMN>
  </ROW>

  <ROW padding="0,16,48,16" align="center" maxWidth="650" stackOnMobile="true">
    <COLUMN width="50%" verticalAlign="top">
      <IMAGE src="${getPhotoUrl('instant-bank-payments.png', 'stripe')}" alt="Instant Bank Payments interface example" width="100%" borderRadius="16" paddingBottom="24" />
    </COLUMN>
    <COLUMN width="50%" verticalAlign="top">
      <HEADING level="h3" fontSize="20" fontWeight="bold" color="#0a2540" paddingBottom="12">
        Offer your customers more payment choices with Instant Bank Payments
      </HEADING>
      <TEXT fontSize="16" color="#425466">
        Instant Bank Payments is now available in the US, UK, and EU, enabling you to accept bank payments directly in your checkout. Customers can securely connect their bank account and authorize a payment in seconds.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW padding="0,16,48,16" align="center" maxWidth="650" stackOnMobile="true">
    <COLUMN width="50%" verticalAlign="top">
      <IMAGE src="${getPhotoUrl('cubes.png', 'stripe')}" alt="Isometric cube illustration" width="100%" borderRadius="16" paddingBottom="24" />
    </COLUMN>
    <COLUMN width="50%" verticalAlign="top">
      <HEADING level="h3" fontSize="20" fontWeight="bold" color="#0a2540" paddingBottom="12">
        Launch new revenue lines in weeks
      </HEADING>
      <TEXT fontSize="16" color="#425466">
        Embed white-label payments and financial service workflows into your platform with new components for Stripe Issuing, Stripe Treasury, and reporting.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW padding="0,16,48,16" align="center" maxWidth="650" stackOnMobile="true">
    <COLUMN width="50%" verticalAlign="top">
      <IMAGE src="${getPhotoUrl('payments.png', 'stripe')}" alt="Stripe Payments logo" width="100%" borderRadius="16" paddingBottom="24" />
    </COLUMN>
    <COLUMN width="50%" verticalAlign="top">
      <HEADING level="h3" fontSize="20" fontWeight="bold" color="#0a2540" paddingBottom="12">
        New payment methods to reach more buyers globally
      </HEADING>
      <TEXT fontSize="16" color="#425466">
        We've added more payment methods to the list of 100+ you can access with Stripe, including Billie, Capchase Pay, Kriya, Mondu, Satispay, seQura, and Sunbit. Your merchants can now enable new payment methods with no code in the Dashboard.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW padding="0,16,48,16" align="center" maxWidth="650">
    <COLUMN width="100%">
      <DIVIDER padding="0,0,48,0" />
      <HEADING level="h2" fontSize="32" fontWeight="bold" color="#0a2540" paddingBottom="24">
        Don't miss
      </HEADING>
    </COLUMN>
  </ROW>

  <ROW padding="0,16,48,16" align="center" maxWidth="650" stackOnMobile="true">
    <COLUMN width="50%" verticalAlign="top">
      <HEADING level="h3" fontSize="20" fontWeight="bold" color="#0a2540" paddingBottom="12">
        Recommended reading
      </HEADING>
      <TEXT fontSize="16" color="#425466" paddingBottom="8">
        • <a href="#" style="color: #635BFF;">Stripe's approach to AI</a>
      </TEXT>
      <TEXT fontSize="16" color="#425466" paddingBottom="8">
        • <a href="#" style="color: #635BFF;">The state of payment methods</a>
      </TEXT>
      <TEXT fontSize="16" color="#425466">
        • <a href="#" style="color: #635BFF;">Stripe Sessions 2024</a>
      </TEXT>
    </COLUMN>
    <COLUMN width="50%" verticalAlign="top">
      <HEADING level="h3" fontSize="20" fontWeight="bold" color="#0a2540" paddingBottom="12">
        Want to learn more?
      </HEADING>
      <IMAGE src="${getPhotoUrl('docs.png', 'stripe')}" alt="Documentation illustration" width="100%" borderRadius="16" paddingBottom="12" />
      <TEXT fontSize="16" color="#425466">
        Check out our <a href="#" style="color: #635BFF;">documentation</a> to learn more about these updates.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW padding="0,16,48,16" align="center" maxWidth="650">
    <COLUMN width="100%">
      <DIVIDER padding="0,0,48,0" />
      <TEXT fontSize="14" color="#425466">
        You received this email because you signed up for updates about new features and products from Stripe. You can <a href="#" style="color: #635BFF;">update your email preferences</a> at any time.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW padding="0,16,32,16" align="center" maxWidth="650" backgroundColor="#f6f9fc">
    <COLUMN width="50%">
      <IMAGE src="${getPhotoUrl('stripe-logo-slate.png', 'stripe')}" alt="Stripe" width="60" />
    </COLUMN>
    <COLUMN width="50%" align="right">
      <SOCIALS folder="stripe">
        <SOCIAL icon="twitter" url="https://twitter.com/stripe" title="Twitter" alt="Twitter" />
        <SOCIAL icon="linkedin" url="https://linkedin.com/company/stripe" title="LinkedIn" alt="LinkedIn" />
        <SOCIAL icon="facebook" url="https://facebook.com/stripe" title="Facebook" alt="Facebook" />
        <SOCIAL icon="github" url="https://github.com/stripe" title="GitHub" alt="GitHub" />
      </SOCIALS>
    </COLUMN>
  </ROW>

  <ROW padding="32,16,32,16" align="center" maxWidth="650" backgroundColor="#f6f9fc">
    <COLUMN width="100%" align="center">
      <TEXT fontSize="14" color="#425466" textAlign="center">
        © 2024 Stripe
      </TEXT>
      <TEXT fontSize="14" color="#425466" textAlign="center">
        354 Oyster Point Blvd, South San Francisco, CA 94080
      </TEXT>
      <LINK href="#" fontSize="14" color="#425466" textDecoration="underline" padding="0,8">
        Privacy & Terms
      </LINK>
      <LINK href="#" fontSize="14" color="#425466" textDecoration="underline" padding="0,8">
        Unsubscribe
      </LINK>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const stripeTemplate = (): Email => {
  const rows = parseEmailScript(stripeTemplateScript, '#0a2540', 'rounded')
  return createEmail(rows, '#0a2540', '#635BFF', 'Arial, sans-serif', 'transparent')
}
