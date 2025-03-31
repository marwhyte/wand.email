import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../../types'

export const slackTemplateScript = `
<EMAIL name="Slack Template" backgroundColor="#f8f4f0" linkColor="#611f69">
  <ROW padding="36,8,0,8">
    <COLUMN align="center">
      <IMAGE src="${getPhotoUrl('slack-logo.png', 'slack')}" alt="Slack Logo" width="120" padding="0,0,32,0" />
      <HEADING level="h1" textAlign="left" fontSize="36" fontWeight="bold" padding="0,0,28,0" color="#1d1c1d">
        Your free trial has ended
      </HEADING>
      <TEXT textAlign="left" fontSize="20" color="#434245" padding="0,0,20,0">
        wand.email has now been downgraded to the free plan. Your team no longer has access to historical conversations & files, along with other wand.email premium features.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW backgroundColor="#ffffff" borderRadius="8" borderColor="#f8f4f0" borderWidth="1" borderStyle="solid" padding="0,0,24,0">
    <COLUMN align="center" padding="0,8,36,8">
      <IMAGE src="${getPhotoUrl('message-file-locked.png', 'slack')}" alt="Message & File History Locked" width="100%" />
      <HEADING level="h2" textAlign="center" padding="24,8,0,8" fontSize="24" fontWeight="bold">
        Message & file history locked
      </HEADING>
      <TEXT textAlign="center" fontSize="16" padding="8,8,24,8">
        Regain access to your historical messages & files.
      </TEXT>
      <BUTTON href="#" backgroundColor="#611f69" color="#ffffff" borderRadius="8" padding="12,24,12,24" fontSize="14" fontWeight="bold" textAlign="center">
        LEARN MORE
      </BUTTON>
    </COLUMN>
  </ROW>

  <ROW padding="40,40,0,40" backgroundColor="#f8f4f0" width="100%" minWidth="100%">
    <COLUMN width="25" verticalAlign="middle">
      <TEXT backgroundColor="#611f69" color="#ffffff" textAlign="center" borderRadius="4" fontSize="12" fontWeight="bold" padding="2,3,2,3">
        PRO
      </TEXT>
    </COLUMN>
    <COLUMN width="75" verticalAlign="middle">
      <TEXT textAlign="left" fontSize="20" fontWeight="bold" color="#1d1c1d" padding="0,0,0,26">
        Also locked...
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW backgroundColor="#f8f4f0" padding="40,40,20,40">
    <COLUMN width="12.5" verticalAlign="top">
      <IMAGE src="${getPhotoUrl('rehashtag.png', 'slack')}" width="100%" />
    </COLUMN>
    <COLUMN width="87.5" verticalAlign="top">
      <TEXT textAlign="left" fontSize="18" fontWeight="bold" color="#1d1c1d" padding="0,0,0,26">
        Slack Connect channels
      </TEXT>
      <TEXT textAlign="left" fontSize="16" color="#434245" padding="0,0,0,26">
        Seamlessly collaborate with external connections
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW backgroundColor="#f8f4f0" padding="0,40,20,40">
    <COLUMN width="12.5" verticalAlign="top">
      <IMAGE src="${getPhotoUrl('headphones.png', 'slack')}" width="100%" />
    </COLUMN>
    <COLUMN width="87.5" verticalAlign="top">
      <TEXT textAlign="left" fontSize="18" fontWeight="bold" color="#1d1c1d" padding="0,0,0,26">
        Group huddles
      </TEXT>
      <TEXT textAlign="left" fontSize="16" color="#434245" padding="0,0,0,26">
        Streamline conversations with multi-person video calls
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW backgroundColor="#f8f4f0" padding="0,40,40,40">
    <COLUMN width="12.5" verticalAlign="top">
      <IMAGE src="${getPhotoUrl('papers.png', 'slack')}" width="100%" />
    </COLUMN>
    <COLUMN width="87.5" verticalAlign="top">
      <TEXT textAlign="left" fontSize="18" fontWeight="bold" color="#1d1c1d" padding="0,0,0,26">
        Unlimited canvases
      </TEXT>
      <TEXT textAlign="left" fontSize="16" color="#434245" padding="0,0,0,26">
        Organize, curate, collaborate, and share information right in your Slack workspace
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW padding="32,8,32,8">
    <COLUMN align="center">
      <TEXT textAlign="left" fontSize="14" padding="8,0,16,26">
        <strong>🧠 Did you know?</strong><br/>
        "Slack" stands for Searchable Log of All Conversation & Knowledge – being able to keep track of history, decisions & important details is the building block of what makes Slack so powerful for your team.
      </TEXT>
      <TEXT textAlign="left" fontSize="14" padding="16,0,24,26">
        <strong>Questions?</strong>&nbsp;<a href="https://support.slack.com" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 68, 73);"><strong><u>Contact our support team</u></strong></a> or <a href="https://slack.com/pro" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 68, 73);"><strong><u>learn more</u></strong></a> about Slack Pro
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW padding="16,8,16,8">
    <COLUMN width="50">
      <IMAGE width="100" src="${getPhotoUrl('slack-logo.png', 'slack')}" alt="Slack Logo" />
    </COLUMN>
    <COLUMN width="50" align="right">
      <SOCIALS folder="socials-dark-gray">
        <SOCIAL icon="facebook" url="/" title="Facebook" alt="Facebook" />
        <SOCIAL icon="linkedin" url="/" title="LinkedIn" alt="LinkedIn" />
        <SOCIAL icon="youtube" url="/" title="YouTube" alt="YouTube" />
        <SOCIAL icon="instagram" url="/" title="Instagram" alt="Instagram" />
      </SOCIALS>
    </COLUMN>
  </ROW>

  <ROW padding="32,8,32,8">
    <COLUMN align="center">
      <TEXT textAlign="center" fontSize="14" color="#666666" padding="0,0,24,0">
        <a href="/our-blog" style="text-decoration: underline;">Our Blog</a> | <a href="/policies" style="text-decoration: underline;">Policies</a> | <a href="/help-center" style="text-decoration: underline;">Help Center</a> | <a href="/slack-community" style="text-decoration: underline;">Slack Community</a>
      </TEXT>
      <TEXT textAlign="center" fontSize="14" color="#666666">
        ©2024 Slack Technologies, LLC, a Salesforce company.<br/>415 Mission Street, 3rd Floor, San Francisco, CA 94105<br/><br/>All rights reserved.
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const slackTemplate = (): Email => {
  const rows = parseEmailScript(slackTemplateScript)
  return createEmail(rows, '#333333', '#333333', 'Lato, Arial, sans-serif', '#ffffff', '500')
}
