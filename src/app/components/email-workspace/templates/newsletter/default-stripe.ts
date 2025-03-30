import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const defaultStripeTemplateScript = (useImage: boolean) => `
<EMAIL styleVariant="clear" type="newsletter">
  <ROW type="header">
    <COLUMN>
      <IMAGE src="logo" alt="Company Logo" />
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <HEADING level="h1">
        New Industry Report Released
      </HEADING>
      <TEXT>
        Our platform continues to gain momentum, and we're excited to announce that we've been named a Leader in <i>The Industry Analyst Wave™: Digital Solutions, Q1 2025</i> report.
      </TEXT>
      <BUTTON>
        Read the report
      </BUTTON>
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_Nb-JNurds_PBdQim8wR11qZWuOYWNhx5CrcrUY_PY6Pt7cSKJApk_EnYk26wr-BpWhDIn3Vf6ZhOTXELYK-nRbNLxLzYmOUsCLn_Mc5l1Kqjpq0t7NyPY9iRsT1OlJfHalE7ZYET7kGxstHY0lY9gF831rm16-mHeDqkMxNsHKg4gbI4g=s0-d-e1-ft#https://client-data.knak.io/production/email_assets/628faa4d2610a/hB6axIhCN8wz4OcN3tZFjMGzfTPuur3WnzffF1rg.png' : 'pexels:digital solutions'}" alt="Digital Solutions Report" />
      <TEXT>
        See the industry analysis of our platform and other top vendors, which includes criteria such as:
      </TEXT>
      <LIST>
        <LI><b>Extensibility:</b> Our users can easily customize their systems as their businesses grow—without requiring extensive technical expertise.</LI>
        <LI><b>Architecture and integration:</b> Our unified platform minimizes compatibility issues while enhancing data visibility and reporting.</LI>
        <LI><b>Security:</b> We're committed to protecting our customers' data and have invested in a range of security measures.</LI>
      </LIST>
      <TEXT>
        This new announcement follows our recognition in <i>The Industry Analyst Wave™: Digital Innovation Providers, Q1 2024</i> report.
      </TEXT>
      <TEXT>
        Read <i>The Industry Analyst Wave™: Digital Solutions, Q1 2025</i> report to discover why we believe our platform can help you unlock new revenue streams, adapt to market trends, and scale with ease.
      </TEXT>
      <BUTTON>
        Read the report
      </BUTTON>
    </COLUMN>
  </ROW>

  <ROW padding="36,24" type="gallery" backgroundColor="#f6f9fc" borderRadius="8">
    <COLUMN width="40%">
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_Na4bKYZOQaAwndgxmdkVao9TEo_9GfxrgiDwIEWVUlOdjFeNbRj9fxD4UJ3_kwoNAShmgs-5qoZXleXTYrt672VWpLepfIkQGcU1Y3Fme83Vl8wMgoovTS07txwCKGwtRBPcgZIyt_9KdQaKHVw2LZqz_ejvqu2CQcxP1rrqSupaudztA=s0-d-e1-ft#https://client-data.knak.io/production/email_assets/628faa4d2610a/Zqw4EDwaCjkIWJVHYJDxuw9NmRVNwSg9egA22mbz.png' : 'pexels:digital solutions'}" alt="Digital Solutions Conference" />
    </COLUMN>
    <COLUMN width="60%">
      <TEXT>
        Tech Summit 2025 is our flagship annual event where business leaders and innovators gather to discuss the most important digital economy trends. Join us May 6-8, 2025, at the Convention Center in San Francisco.
      </TEXT>
      <LINK align="left">
        Learn more
      </LINK>
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <TEXT fontSize="10">
        Industry Analyst does not endorse any company or product in its research and does not advise selecting based on ratings. Information is based on available resources and opinions may change. For more details, <a href="/">read about their objectivity.</a>
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW type="footer">
    <COLUMN>
      <IMAGE src="${useImage ? 'logo' : 'logo'}" alt="Company Logo" />
      <SOCIALS folder="socials-dark-round">
        <SOCIAL icon="x" url="#" title="X" alt="X" />
        <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
        <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
      </SOCIALS>
      <TEXT>
        This email was sent to <a href="/">marcolwhyte@gmail.com</a>. If you'd rather not receive this kind of email, you can unsubscribe or manage your email preferences.
      </TEXT>
      <TEXT>
        Company Name, 123 Main Street, San Francisco, CA 94080
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const stripeNewsletterExample = `
<example>
  <user_query>Can you help me create an email for my newsletter? It is about our industry recognition.</user_query>

  <assistant_response>
  I'll create a newsletter email about your industry recognition.

  ${defaultStripeTemplateScript(false)}

  The template includes a nice header with your logo, a newsletter about your industry recognition, and a footer with social media links.
  </assistant_response>
</example>
`

export const defaultStripeTemplate = (): Email => {
  const email = parseEmailScript(defaultStripeTemplateScript(true))

  return createEmail(email)
}
