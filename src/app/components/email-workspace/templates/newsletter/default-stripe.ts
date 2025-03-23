import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const defaultStripeTemplateScript = (useImage: boolean) => `
<EMAIL type=newsletter>
    ROW type=header {
        COLUMN {
            IMAGE src=${useImage ? 'logo' : 'logo'} alt="Company Logo"
        }
    }
    ROW {
        COLUMN {
            HEADING level=h1 content=<p>Why Stripe is a leader</p>
            TEXT content=<p>Momentum for Stripe Billing continues to grow, and Stripe has now been named a Leader in <i>The Forrester Wave™: Recurring Billing Solutions, Q1 2025</i> report.</p>
            BUTTON content=<p>Read the report</p>
            IMAGE src=${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_Nb-JNurds_PBdQim8wR11qZWuOYWNhx5CrcrUY_PY6Pt7cSKJApk_EnYk26wr-BpWhDIn3Vf6ZhOTXELYK-nRbNLxLzYmOUsCLn_Mc5l1Kqjpq0t7NyPY9iRsT1OlJfHalE7ZYET7kGxstHY0lY9gF831rm16-mHeDqkMxNsHKg4gbI4g=s0-d-e1-ft#https://client-data.knak.io/production/email_assets/628faa4d2610a/hB6axIhCN8wz4OcN3tZFjMGzfTPuur3WnzffF1rg.png' : '"pexels:billing solutions"'} alt="Recurring Billing Solutions"
            TEXT content=<p>See Forrester’s evaluation of Stripe Billing and other top vendors, which includes criteria such as:</p>
            LIST items=[<p><b>Extensibility:</b> Our users can easily customize their billing systems as their businesses grow—without requiring extensive technical expertise.</p>,<p><b>Architecture and integration:</b> Linking Stripe Billing and Stripe Payments minimizes our customers’ compatibility issues while enhancing data visibility and reporting.</p>,<p><b>Security:</b> We’re committed to protecting our customers’ data and have invested in a range of security measures.</p>]
            TEXT content=<p>This new announcement follows Stripe’s recognition in <i>The Forrester Wave™: Merchant Payment Providers, Q1 2024</i> report.</p>
            TEXT content=<p>Read <i>The Forrester Wave™: Recurring Billing Solutions, Q1 2025</i> report to discover why we believe Stripe Billing can help you unlock new revenue streams, adapt to market trends, and scale with ease.</p>
            BUTTON content=<p>Read the report</p>
        }
    }
    ROW padding=36 24 type=gallery backgroundColor=#f6f9fc borderRadius=8 {
        COLUMN width=40% {
            IMAGE src=${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_Na4bKYZOQaAwndgxmdkVao9TEo_9GfxrgiDwIEWVUlOdjFeNbRj9fxD4UJ3_kwoNAShmgs-5qoZXleXTYrt672VWpLepfIkQGcU1Y3Fme83Vl8wMgoovTS07txwCKGwtRBPcgZIyt_9KdQaKHVw2LZqz_ejvqu2CQcxP1rrqSupaudztA=s0-d-e1-ft#https://client-data.knak.io/production/email_assets/628faa4d2610a/Zqw4EDwaCjkIWJVHYJDxuw9NmRVNwSg9egA22mbz.png' : '"pexels:billing solutions"'} alt="Recurring Billing Solutions"
        }
        COLUMN width=60% {
            TEXT content=<p>Stripe Sessions is our flagship annual event where business leaders and builders gather to discuss the most important internet economy trends. Join us May 6-8, 2025, at Moscone West in San Francisco.</p>
            LINK align=left content=<p>Learn more</p>
        }
    }
    ROW  {
        COLUMN {
            TEXT fontSize=10 content=<p>Forrester does not endorse any company or product in its research and does not advise selecting based on ratings. Information is based on available resources and opinions may change. For more details, <a href="/">read about Forrester’s objectivity.</a></p>
        }
    }
    ROW type=footer {
        COLUMN {
            IMAGE src=${useImage ? 'logo' : 'logo'} alt="Company Logo"
            SOCIALS folder=socials-dark-round links=[{"icon":"x","url":"#","title":"X","alt":"X"},{"icon":"facebook","url":"#","title":"Facebook","alt":"Facebook"},{"icon":"instagram","url":"#","title":"Instagram","alt":"Instagram"}]
            TEXT content=<p>This email was sent to <a href="/">marcolwhyte@gmail.com</a>. If you'd rather not receive this kind of email, you can unsubscribe or manage your email preferences.</p>
            TEXT content=<p>Stripe, 354 Oyster Point Boulevard, South San Francisco, CA 94080</p>
        }
    }
</EMAIL>
`

export const stripeNewsletterExample = `
<example>
  <user_query>Can you help me create an email for my newsletter? It is about the growth of Stripe Billing.</user_query>

  <assistant_response>
  I'll create a newsletter email about the growth of Stripe Billing.

  ${defaultStripeTemplateScript(false)}

  The template includes a nice header with your logo, a newsletter about the growth of Stripe Billing, and a footer with social media links.
  </assistant_response>
</example>
`

export const defaultStripeTemplate = (): Email => {
  const email = parseEmailScript(defaultStripeTemplateScript(true), { id: '123', rows: [] })

  return createEmail(email)
}
