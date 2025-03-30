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
        NEWS
      </TEXT>
      <HEADING level="h1">
        Your Monthly Update 📝
      </HEADING>
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NbO8TmQQwxclu-oOhP1tUu_W7bjLQykdLh8-nYp4xiHFvvV2XLfsPutnKnCAjQ_UX_84HqqY_vhYvjMNBPwSTa56vziTBEMcicywkCbl_iUT4mzD7R1s6D93KDykSSXw6okz62-9ivWLIbRv-E9vfwklNer4Y_t9X08LcocWdgR1-D54qaVXhnhx9bsdPdDNMVt08T-vwedABjuuCPk1t9ThvXYBoE8qDyfVrKZfC0gdKzt3vjCJi2s4gVp9bYFB6_VMcK5-lA8ijeazj03z0mM=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/36a7e521-adda-446c-bd1c-3d21c3ff9cd8/shieldwall-vikings.gif?t=1741824045' : 'pexels:market trends'}" alt="Market Trends" />
      <TEXT textAlign="center" padding="0">
        Source: <a href="/">Market Analytics</a>
      </TEXT>
      <TEXT>
        Inflation fears have been replaced by recession concerns, with today's consumer price index giving the bulls enough confidence to battle back. Technology stocks led the rebound, with retail earnings weighing on consumer-focused sectors. Bulls now have yesterday's low to manage risk against as they venture onward. 👀 
      </TEXT>
      <TEXT>
        Today's issue covers <b>cooling consumer prices, new tech leadership appointments, forgotten retail favorites finding interest, and more from a busy day on Wall Street. 📰</b>
      </TEXT>
      <TEXT>
        Here's the S&P 500 heatmap. 5 of 11 sectors closed green, with technology (+1.57%) leading and consumer staples (-2.17%) lagging.
      </TEXT>
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NaORb_WFPb7ZoIjMzoph5UdpEkXbChJQGttLCrp5sG36bcCmI_Y9NnKXbi-MYMQU03GmbPrrYRuVyimxaz-yQuoLilQXC3SFzGhClkP-o3nPjq4EBF_ymj_canpVKpN6K1hgoobQR_W62xKOU4_PgKxX4_pLLxV3JFNIVO-T6O9JY5Hpo9yhdNlWZG4AO23e0COxGQtzcRZ9OU6nBYxdRRS0hCRM0RaTCq7sXSj7pnQDeBNcVlxotW6MmWCkkMCyOfA84g=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/f4f74218-b37d-424a-92b1-74d397d7337d/image.png?t=1741822743' : 'pexels:market heatmap'}" alt="S&P 500 Heatmap" />
      <TEXT textAlign="center" padding="0">
        Source: <a href="/">Market Analytics</a>
      </TEXT>
      <TEXT>
        And here are the closing prices:
      </TEXT>
      <TABLE>
        <TR>
          <TD><strong>S&P 500</strong></TD>
          <TD><strong>5,615</strong></TD>
          <TD><span style="color: rgb(179, 25, 25)">-1.07%</span></TD>
        </TR>
        <TR>
          <TD><strong>Nasdaq</strong></TD>
          <TD><strong>17,504</strong></TD>
          <TD><span style="color: rgb(179, 25, 25)">-1.27%</span></TD>
        </TR>
      </TABLE>
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <TEXT padding="0" fontWeight="bold" color="#2c81e5" fontSize="12">
        POLICY
      </TEXT>
      <HEADING level="h2">
        The Market's Fate Rests With Central Bank Decisions 😬
      </HEADING>
      <TEXT>
        Buy now, pay later companies are all over the news as new partnerships with major retailers emerge. Plus, the health of the U.S. economy remains at center stage, raising concerns about consumer-linked companies.
      </TEXT>
      <TEXT>
        So, how are fintech innovators navigating the current environment? We sat down with <b>industry expert Jane Smith to answer questions directly from our community.</b> You don't want to miss this. 🤩 
      </TEXT>
      <IMAGE src="${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NYDIU-jNhevVHFbpWTwwPJgjLuyDcQ16cg2NcSyjnXQNcS3ZAB4QS0rCilPXYds5yVqUmp_rbPislV9x56DIYAfek8zGG5JWssVWShDC2sAVJyY4LddxwGghAIB4n_h02iILbOnc7oZVVVJZMEYP5Gp6_XaCiJAg6wp8MpfFtjDosvEGy1t9XxH9yS-tJpAvAxN5R7nzq7ChaSpSemsMCTm8lW7rgD4bEXf_LiqrzkQ_rUsQeLV8GnMVVZP7H5JhJzrZnw=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/62b031a1-8d9e-4733-9f5b-8b58b2b3fdf5/image.png?t=1742338748' : 'pexels:finance expert'}" alt="Jane Smith, Financial Expert" />
      <TEXT textAlign="center">
        Source: <a href="/">Market Insights</a>
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
        © 2025 The Daily Market Report
      </TEXT>
      <TEXT>
        123 Financial Avenue, Suite 500, New York, NY 10001, USA
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const stocktwitsNewsletterExample = `
<example>
  <user_query>I am making a monthly update for my finance newsletter. Can you help me create an email for it?</user_query>

  <assistant_response>
  I'll create a newsletter email for your finance newsletter.

  ${outlineStocktwitsTemplateScript(false)}

  The template includes a nice header with your logo, a newsletter about the stock market, and a footer with social media links.
  </assistant_response>
</example>
`

export const outlineStocktwitsTemplate = (): Email => {
  const email = parseEmailScript(outlineStocktwitsTemplateScript(true))

  return createEmail(email)
}
