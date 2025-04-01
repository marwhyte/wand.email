import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const outlineStocktwitsTemplateScript = (useImage: boolean) => `
<EMAIL styleVariant="outline" type="newsletter">
  <ROW type="header">
    <COLUMN>
      <TEXT textAlign="right" fontSize="12">
        March 12, 2025 | <a href="/">Read Online</a>
      </TEXT>
      <IMAGE src="${useImage ? 'logo' : 'logo'}" alt="Company Logo" />
      <SOCIALS folder="socials-dark-round">
        <SOCIAL icon="x" url="#" title="X" alt="X" />
        <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
        <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
      </SOCIALS>
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <TEXT padding="0" fontWeight="bold" color="#2c81e5" fontSize="12">
        FEATURED
      </TEXT>
      <HEADING level="h1">
        Your Monthly Newsletter 📝
      </HEADING>
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NbO8TmQQwxclu-oOhP1tUu_W7bjLQykdLh8-nYp4xiHFvvV2XLfsPutnKnCAjQ_UX_84HqqY_vhYvjMNBPwSTa56vziTBEMcicywkCbl_iUT4mzD7R1s6D93KDykSSXw6okz62-9ivWLIbRv-E9vfwklNer4Y_t9X08LcocWdgR1-D54qaVXhnhx9bsdPdDNMVt08T-vwedABjuuCPk1t9ThvXYBoE8qDyfVrKZfC0gdKzt3vjCJi2s4gVp9bYFB6_VMcK5-lA8ijeazj03z0mM=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/36a7e521-adda-446c-bd1c-3d21c3ff9cd8/shieldwall-vikings.gif?t=1741824045' : 'pexels:trends'}" alt="Trends" />
      <TEXT textAlign="center" padding="0">
        Source: <a href="/">Industry Insights</a>
      </TEXT>
      <TEXT>
        This month has been filled with exciting developments and important updates across our industry. We're seeing new trends emerge and innovative solutions being implemented across various sectors. Let's dive into what's been happening! 👀 
      </TEXT>
      <TEXT>
        Today's issue covers <b>emerging industry trends, new leadership appointments, innovative solutions gaining traction, and more from a busy month in our sector. 📰</b>
      </TEXT>
      <TEXT>
        Here's a quick overview of the key developments we've seen this month. 5 major sectors have shown significant growth, with technology leading the way and traditional industries adapting to new challenges.
      </TEXT>
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NaORb_WFPb7ZoIjMzoph5UdpEkXbChJQGttLCrp5sG36bcCmI_Y9NnKXbi-MYMQU03GmbPrrYRuVyimxaz-yQuoLilQXC3SFzGhClkP-o3nPjq4EBF_ymj_canpVKpN6K1hgoobQR_W62xKOU4_PgKxX4_pLLxV3JFNIVO-T6O9JY5Hpo9yhdNlWZG4AO23e0COxGQtzcRZ9OU6nBYxdRRS0hCRM0RaTCq7sXSj7pnQDeBNcVlxotW6MmWCkkMCyOfA84g=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/f4f74218-b37d-424a-92b1-74d397d7337d/image.png?t=1741822743' : 'pexels:industry trends'}" alt="Industry Trends" />
      <TEXT textAlign="center" padding="0">
        Source: <a href="/">Industry Analytics</a>
      </TEXT>
      <TEXT>
        Here are the key metrics for this month:
      </TEXT>
      <TABLE>
        <TR>
          <TD><strong>Industry Growth</strong></TD>
          <TD><strong>+5.2%</strong></TD>
          <TD><span style="color: rgb(25, 179, 25)">+0.8%</span></TD>
        </TR>
        <TR>
          <TD><strong>Innovation Index</strong></TD>
          <TD><strong>78.3</strong></TD>
          <TD><span style="color: rgb(25, 179, 25)">+2.1</span></TD>
        </TR>
      </TABLE>
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <TEXT padding="0" fontWeight="bold" color="#2c81e5" fontSize="12">
        INSIGHTS
      </TEXT>
      <HEADING level="h2">
        The Future of Industry Innovation 😬
      </HEADING>
      <TEXT>
        New partnerships and collaborations are reshaping how we think about industry standards. Plus, the health of the global economy remains at center stage, raising important questions about sustainable growth.
      </TEXT>
      <TEXT>
        So, how are industry leaders navigating these changes? We sat down with <b>industry expert Jane Smith to answer questions directly from our community.</b> You don't want to miss this. 🤩 
      </TEXT>
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NYDIU-jNhevVHFbpWTwwPJgjLuyDcQ16cg2NcSyjnXQNcS3ZAB4QS0rCilPXYds5yVqUmp_rbPislV9x56DIYAfek8zGG5JWssVWShDC2sAVJyY4LddxwGghAIB4n_h02iILbOnc7oZVVVJZMEYP5Gp6_XaCiJAg6wp8MpfFtjDosvEGy1t9XxH9yS-tJpAvAxN5R7nzq7ChaSpSemsMCTm8lW7rgD4bEXf_LiqrzkQ_rUsQeLV8GnMVVZP7H5JhJzrZnw=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/62b031a1-8d9e-4733-9f5b-8b58b2b3fdf5/image.png?t=1742338748' : 'pexels:expert'}" alt="Jane Smith, Industry Expert" />
      <TEXT textAlign="center">
        Source: <a href="/">Industry Insights</a>
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW type="footer">
    <COLUMN>
      <SOCIALS folder="socials-dark-gray">
        <SOCIAL icon="x" url="#" title="X" alt="X" />
        <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
        <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
      </SOCIALS>
      <TEXT>
        Update your email preferences or unsubscribe <a href="/">here</a>
      </TEXT>
      <TEXT>
        © 2025 The Monthly Industry Report
      </TEXT>
      <TEXT>
        123 Industry Avenue, Suite 500, New York, NY 10001, USA
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const stocktwitsNewsletterExample = `
<example>
  <user_query>I am making a monthly update for my industry newsletter. Can you help me create an email for it?</user_query>

  <assistant_response>
  I'll create a newsletter email for your industry newsletter.

  ${outlineStocktwitsTemplateScript(false)}

  The template includes a nice header with your logo, a newsletter about industry trends and insights, and a footer with social media links.
  </assistant_response>
</example>
`

export const outlineStocktwitsTemplate = (): Email => {
  const email = parseEmailScript(outlineStocktwitsTemplateScript(true))

  return createEmail(email)
}
