import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { Email } from '../../types'

export const newsletterOutlineStocktwitsTemplateScript = `
<EMAIL styleVariant=outline type=newsletter>
    ROW type=header {
        COLUMN {
            TEXT textAlign=right fontSize=12 content=<p>March 12, 2025 <a href="/">Read Online</a></p>
            IMAGE src="logo" alt="Company Logo"
            SOCIALS folder=socials-dark-gray links=[{"icon":"x","url":"#","title":"X","alt":"X"},{"icon":"facebook","url":"#","title":"Facebook","alt":"Facebook"},{"icon":"instagram","url":"#","title":"Instagram","alt":"Instagram"}]
        }
    }
    ROW {
        COLUMN {
            TEXT color=#2c81e5 fontSize=12 content=<p>NEWS</p>
            HEADING level=h1 content=<p>Your Monthly Update</p>
            IMAGE src="https://ci3.googleusercontent.com/meips/ADKq_NbO8TmQQwxclu-oOhP1tUu_W7bjLQykdLh8-nYp4xiHFvvV2XLfsPutnKnCAjQ_UX_84HqqY_vhYvjMNBPwSTa56vziTBEMcicywkCbl_iUT4mzD7R1s6D93KDykSSXw6okz62-9ivWLIbRv-E9vfwklNer4Y_t9X08LcocWdgR1-D54qaVXhnhx9bsdPdDNMVt08T-vwedABjuuCPk1t9ThvXYBoE8qDyfVrKZfC0gdKzt3vjCJi2s4gVp9bYFB6_VMcK5-lA8ijeazj03z0mM=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/36a7e521-adda-446c-bd1c-3d21c3ff9cd8/shieldwall-vikings.gif?t=1741824045"
            TEXT content=<p>Source: <a href="/">Tenor</a></p>
            TEXT content=<p>Inflation fears have been replaced by recession concerns, with today’s consumer price index giving the bulls enough confidence to battle back. Technology stocks led the rebound, with retail earnings weighing on consumer-focused sectors. Bulls now have yesterday’s low to manage risk against as they venture onward. 👀 </p>
            TEXT content=<p>Today's issue covers <b>cooling consumer prices, Intel’s CEO appointment, forgotten retail favorites finding interest, and more from a busy day on Wall Street. 📰</b></p>
            TEXT content=<p>Here’s the S&P 500 heatmap. 5 of 11 sectors closed green, with technology (+1.57%) leading and consumer staples (-2.17%) lagging.</p>
            IMAGE src="https://ci3.googleusercontent.com/meips/ADKq_NaORb_WFPb7ZoIjMzoph5UdpEkXbChJQGttLCrp5sG36bcCmI_Y9NnKXbi-MYMQU03GmbPrrYRuVyimxaz-yQuoLilQXC3SFzGhClkP-o3nPjq4EBF_ymj_canpVKpN6K1hgoobQR_W62xKOU4_PgKxX4_pLLxV3JFNIVO-T6O9JY5Hpo9yhdNlWZG4AO23e0COxGQtzcRZ9OU6nBYxdRRS0hCRM0RaTCq7sXSj7pnQDeBNcVlxotW6MmWCkkMCyOfA84g=s0-d-e1-ft#https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/f4f74218-b37d-424a-92b1-74d397d7337d/image.png?t=1741822743"
            TEXT content=<p>Source: <a href="/">Finviz</a></p>
            TEXT content=<p>And here are the closing prices:

        }
    }
    
</EMAIL>

`

export const newsletterOutlineStocktwitsTemplate = (): Email => {
  const email = parseEmailScript(newsletterOutlineStocktwitsTemplateScript, { id: '123', rows: [] })

  return createEmail(email)
}
