import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'

export const slackTemplateScript = `
<EMAIL name="Slack Template" backgroundColor=#f8f4f0 linkColor=#611f69>
  ROW padding=36,8,0,8 {
    COLUMN align=center {
      IMAGE src="${getPhotoUrl('slack-logo.png', 'slack')}" alt="Slack Logo" width=120 padding=0,0,32,0
     HEADING text=<p>Your free trial has ended</p> as=h1 textAlign=left fontSize=36 fontWeight=bold padding=0,0,28,0 lineHeight=42px color=#1d1c1d
      TEXT text=<p>SentSwiftly has now been downgraded to the free plan. Your team no longer has access to historical conversations & files, along with other Slack premium features.</p> textAlign=left fontSize=20 color=#434245 padding=0,0,20,0 lineHeight=28px
    }
  }

  ROW backgroundColor=#ffffff borderRadius=8 borderColor=#f8f4f0 borderWidth=1 borderStyle=solid padding=0,0,24,0 {
    COLUMN align=center padding=0,8,36,8 {
      IMAGE src="${getPhotoUrl('message-file-locked.png', 'slack')}" alt="Message & File History Locked" width=100%
      HEADING text=<p>Message & file history locked</p> as=h2 textAlign=center padding=24,8,0,8 fontSize=24 fontWeight=bold
      TEXT text=<p>Regain access to your historical messages & files.</p> textAlign=center fontSize=16 padding=8,8,24,8 lineHeight=1.5
      BUTTON text=<p>LEARN MORE</p> href=# backgroundColor=#611f69 color=#ffffff borderRadius=8 padding=12,24,12,24 fontSize=14 fontWeight=bold textAlign=center
    }
  }

  ROW padding=40,40,0,40 backgroundColor=#f8f4f0 width=100% minWidth=100% {
    COLUMN width=25 valign=middle {
      TEXT text=<p>PRO</p> backgroundColor=#611f69 color=#ffffff textAlign=center borderRadius=4 fontSize=12 fontWeight=bold padding=2,3,2,3
    }
    COLUMN width=75 valign=middle {
      TEXT text=<p>Also locked...</p> textAlign=left fontSize=20 fontWeight=bold color=#1d1c1d padding=0,0,0,26
    }
  }

  ROW backgroundColor=#f8f4f0 padding=40,40,20,40 {
    COLUMN width=12.5 valign=top {
      IMAGE src="${getPhotoUrl('rehashtag.png', 'slack')}" width=100%
    }
    COLUMN width=87.5 valign=top {
      TEXT text=<p>Slack Connect channels</p> textAlign=left fontSize=18 fontWeight=bold color=#1d1c1d padding=0,0,0,26 lineHeight=24px
      TEXT text=<p>Seamlessly collaborate with external connections</p> textAlign=left fontSize=16 color=#434245 padding=0,0,0,26 lineHeight=24px
    }
  }

  ROW backgroundColor=#f8f4f0 padding=0,40,20,40 {
    COLUMN width=12.5 valign=top {
      IMAGE src="${getPhotoUrl('headphones.png', 'slack')}" width=100%
    }
    COLUMN width=87.5 valign=top {
      TEXT text=<p>Group huddles</p> textAlign=left fontSize=18 fontWeight=bold color=#1d1c1d padding=0,0,0,26 lineHeight=24px
      TEXT text=<p>Streamline conversations with multi-person video calls</p> textAlign=left fontSize=16 color=#434245 padding=0,0,0,26 lineHeight=24px
    }
  }

  ROW backgroundColor=#f8f4f0 padding=0,40,40,40 {
    COLUMN width=12.5 valign=top {
      IMAGE src="${getPhotoUrl('papers.png', 'slack')}" width=100%
    }
    COLUMN width=87.5 valign=top {
      TEXT text=<p>Unlimited canvases</p> textAlign=left fontSize=18 fontWeight=bold color=#1d1c1d padding=0,0,0,26 lineHeight=24px
      TEXT text=<p>Organize, curate, collaborate, and share information right in your Slack workspace</p> textAlign=left fontSize=16 color=#434245 padding=0,0,0,26 lineHeight=24px
    }
  }

  ROW padding=32,8,32,8 {
    COLUMN align=center {
      TEXT text=<p><strong>🧠 Did you know?</strong><br/>"Slack" stands for Searchable Log of All Conversation & Knowledge – being able to keep track of history, decisions & important details is the building block of what makes Slack so powerful for your team.</p> textAlign=left fontSize=14 padding=8,0,16,26 lineHeight=1.5
      TEXT text=<p><strong>Questions?</strong>&nbsp;<a href="https://support.slack.com" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 68, 73);"><strong><u>Contact our support team</u></strong></a> or <a href="https://slack.com/pro" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 68, 73);"><strong><u>learn more</u></strong></a> about Slack Pro</p> textAlign=left fontSize=14 padding=16,0,24,26 lineHeight=1.5
    }
  }

  ROW padding=16,8,16,8 {
    COLUMN width=50 {
      IMAGE width=100 src="${getPhotoUrl('slack-logo.png', 'slack')}" alt="Slack Logo"
    }
    COLUMN width=50 align=right {
      SOCIALS folder="socials-dark-gray" socialLinks=[{"icon":"facebook","url":"https://www.facebook.com","title":"Facebook","alt":"Facebook"},{"icon":"linkedin","url":"https://www.linkedin.com","title":"LinkedIn","alt":"LinkedIn"},{"icon":"youtube","url":"https://www.youtube.com","title":"YouTube","alt":"YouTube"},{"icon":"instagram","url":"https://www.instagram.com","title":"Instagram","alt":"Instagram"}]
      ]
    }
  }

  ROW padding=32,8,32,8 {
    COLUMN align=center {
      TEXT text=<p><a href="/our-blog" style="text-decoration: underline;">Our Blog</a> | <a href="/policies" style="text-decoration: underline;">Policies</a> | <a href="/help-center" style="text-decoration: underline;">Help Center</a> | <a href="/slack-community" style="text-decoration: underline;">Slack Community</a></p> textAlign=center fontSize=14 color=#666666 padding=0,0,24,0
      TEXT text=<p>©2024 Slack Technologies, LLC, a Salesforce company.<br/>415 Mission Street, 3rd Floor, San Francisco, CA 94105<br/><br/>All rights reserved.</p> textAlign=center fontSize=14 color=#666666
    }
  }
</EMAIL>
`

export const slackTemplate = (): Email => {
  const rows = parseEmailScript(slackTemplateScript)
  return createEmail('slack', rows, '#333333', '#333333', 'Lato, Arial, sans-serif', '#ffffff', '500')
}
