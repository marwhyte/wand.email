import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const outlineStocktwitsTemplateScript = (useImage: boolean) => `
<EMAIL styleVariant=outline type=newsletter>
    ROW type=header {
        COLUMN {
            TEXT textAlign=right fontSize=12 content=<p>March 12, 2025 | <a href="/">Read Online</a></p>
            IMAGE src=${useImage ? 'logo' : 'logo'} alt="Company Logo"
            SOCIALS folder=socials-dark-round links=[{"icon":"x","url":"#","title":"X","alt":"X"},{"icon":"facebook","url":"#","title":"Facebook","alt":"Facebook"},{"icon":"instagram","url":"#","title":"Instagram","alt":"Instagram"}]
        }
    }
    ROW {
        COLUMN {
            TEXT padding=0 fontWeight=bold color=#2c81e5 fontSize=12 content=<p>NEWS</p>
            HEADING level=h1 content=<p>Your Monthly Update 📝</p>
            IMAGE src=${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NbO8TmQQwxclu-oOhP1tUu_W7bjLQykdLh8-nYp4xiHFvvV2XLfsPutnKnCAjQ_UX_84HqqY_vhYvjMNBPwSTa56vziTBEMcicywkCbl_iUT4mzD7R1s6D93KDykSSXw6okz62-9ivWLIbRv-E9vfwklNer4Y_t9X08LcocWdgR1-D54qaVXhnhx9bsdPdDNMVt08T-vwedABjuuCPk1t9ThvXYBoE8qDyfVrKZfC0gdKzt3vjCJi2s4gVp9bYFB6_VMcK5-lA8ijeazj03z0mM=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/36a7e521-adda-446c-bd1c-3d21c3ff9cd8/shieldwall-vikings.gif?t=1741824045' : 'pexels:shieldwall vikings'} alt="Shieldwall Vikings"
            TEXT textAlign=center padding=0 content=<p>Source: <a href="/">Tenor</a></p>
            TEXT content=<p>Inflation fears have been replaced by recession concerns, with today’s consumer price index giving the bulls enough confidence to battle back. Technology stocks led the rebound, with retail earnings weighing on consumer-focused sectors. Bulls now have yesterday’s low to manage risk against as they venture onward. 👀 </p>
            TEXT content=<p>Today's issue covers <b>cooling consumer prices, Intel’s CEO appointment, forgotten retail favorites finding interest, and more from a busy day on Wall Street. 📰</b></p>
            TEXT content=<p>Here’s the S&P 500 heatmap. 5 of 11 sectors closed green, with technology (+1.57%) leading and consumer staples (-2.17%) lagging.</p>
            IMAGE src=${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NaORb_WFPb7ZoIjMzoph5UdpEkXbChJQGttLCrp5sG36bcCmI_Y9NnKXbi-MYMQU03GmbPrrYRuVyimxaz-yQuoLilQXC3SFzGhClkP-o3nPjq4EBF_ymj_canpVKpN6K1hgoobQR_W62xKOU4_PgKxX4_pLLxV3JFNIVO-T6O9JY5Hpo9yhdNlWZG4AO23e0COxGQtzcRZ9OU6nBYxdRRS0hCRM0RaTCq7sXSj7pnQDeBNcVlxotW6MmWCkkMCyOfA84g=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/f4f74218-b37d-424a-92b1-74d397d7337d/image.png?t=1741822743' : 'pexels:S&P 500 Heatmap'} alt="S&P 500 Heatmap"
            TEXT textAlign=center padding=0 content=<p>Source: <a href="/">Finviz</a></p>
            TEXT content=<p>And here are the closing prices:</p>
            TABLE rows=[[<p><strong>S&P 500</strong></p>,<p><strong>5,615</strong></p>,<p><span style="color: rgb(179, 25, 25)">-1.07%</span></p>],[<p><strong>Nasdaq</strong></p>,<p><strong>17,504</strong></p>,<p><span style="color: rgb(179, 25, 25)">-1.27%</span></p>]]
        }
    }
    ROW {
        COLUMN {
            TEXT padding=0 fontWeight=bold color=#2c81e5 fontSize=12 content=<p>POLICY</p>
            HEADING level=h2 content=<p>The Market’s Fate Rests With Jerome Powell 😬</p>
            TEXT content=<p>Buy now, pay later stocks are all over the news as Klarna looks to come to market, inking an exclusive deal with Walmart in the process. Plus, the health of the U.S. economy remains at center stage, raising concerns about consumer-linked companies.</p>
            TEXT content=<p>So, how is Fintech giant Affirm navigating the current environment? We sat down with <b>CFO Rob O’Hare to answer questions directly from retail investors.</b> You don’t want to miss this. 🤩 </p>
            IMAGE src=${useImage ? 'https://ci3.googleusercontent.com/meips/ADKq_NYDIU-jNhevVHFbpWTwwPJgjLuyDcQ16cg2NcSyjnXQNcS3ZAB4QS0rCilPXYds5yVqUmp_rbPislV9x56DIYAfek8zGG5JWssVWShDC2sAVJyY4LddxwGghAIB4n_h02iILbOnc7oZVVVJZMEYP5Gp6_XaCiJAg6wp8MpfFtjDosvEGy1t9XxH9yS-tJpAvAxN5R7nzq7ChaSpSemsMCTm8lW7rgD4bEXf_LiqrzkQ_rUsQeLV8GnMVVZP7H5JhJzrZnw=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/62b031a1-8d9e-4733-9f5b-8b58b2b3fdf5/image.png?t=1742338748' : 'pexels:CFO'} alt="Affirm CFO Rob O’Hare"
            TEXT textAlign=center content=<p>Source: <a href="/">Stocktwits</a></p>
        }
    }
    ROW type=footer {
        COLUMN {
            SOCIALS folder=socials-dark-gray links=[{"icon":"x","url":"#","title":"X","alt":"X"},{"icon":"facebook","url":"#","title":"Facebook","alt":"Facebook"},{"icon":"instagram","url":"#","title":"Instagram","alt":"Instagram"}]
            TEXT content=<p>Update your email preferences or unsubscribe <a href="/">here</a></p>
            TEXT content=<p>© 2025 The Daily Rip presented by Stocktwits</p>
            TEXT content=<p>228 Park Ave S, Suite 56681, New York, NY 10003, USA</p>
        }
    }
    
</EMAIL>
`

export const stocktwitsNewsletterExample = `
<example>
  <user_query>I am making a monthly update for my stock trading app, stocktwits. Can you help me create an email for it?</user_query>

  <assistant_response>
  I'll create a newsletter email for your stock trading app, stocktwits.

  ${outlineStocktwitsTemplateScript(false)}

  The template includes a nice header with your logo, a newsletter about the stock market, and a footer with social media links.
  </assistant_response>
</example>
`

export const outlineStocktwitsTemplate = (): Email => {
  const email = parseEmailScript(outlineStocktwitsTemplateScript(true), { id: '123', rows: [] })

  return createEmail(email)
}
