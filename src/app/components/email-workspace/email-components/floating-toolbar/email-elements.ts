export type ElementType = 'tag' | 'link'

export type EmailElement = {
  name: string
  value: string
  category: string
  type: ElementType
}

// Combine the merge tags and special links into a single list of email elements
export const emailElements: EmailElement[] = [
  // Mailchimp
  { name: 'Email', value: '*|EMAIL|*', category: 'Mailchimp', type: 'tag' },
  { name: 'First Name', value: '*|FNAME|*', category: 'Mailchimp', type: 'tag' },
  { name: 'Last Name', value: '*|LNAME|*', category: 'Mailchimp', type: 'tag' },
  { name: 'Subscribe', value: '*|LIST:SUBSCRIBE|*', category: 'Mailchimp', type: 'tag' },
  { name: 'Archive', value: '*|ARCHIVE|*', category: 'Mailchimp', type: 'tag' },
  { name: 'Address Line', value: '*|LIST:ADDRESSLINE|*', category: 'Mailchimp', type: 'tag' },
  { name: 'Unsubscribe', value: '*|UNSUB|*', category: 'Mailchimp', type: 'link' },

  // MailUp
  { name: 'Email', value: '[email]', category: 'MailUp', type: 'tag' },
  { name: 'First Name', value: '[firstname]', category: 'MailUp', type: 'tag' },
  { name: 'Last Name', value: '[lastname]', category: 'MailUp', type: 'tag' },
  { name: 'Company', value: '[company]', category: 'MailUp', type: 'tag' },
  { name: 'Unsubscribe', value: 'http://[unsubscribe]/', category: 'MailUp', type: 'link' },
  { name: 'Subscribe', value: 'http://[subscribelink]/', category: 'MailUp', type: 'link' },
  { name: 'Preferences', value: 'http://[prefcenter]/', category: 'MailUp', type: 'link' },
  { name: 'Static Link', value: 'http://[staticnl]/', category: 'MailUp', type: 'link' },

  // SendGrid
  { name: 'Email', value: '-email-', category: 'SendGrid', type: 'tag' },
  { name: 'First Name', value: '-first_name-', category: 'SendGrid', type: 'tag' },
  { name: 'Last Name', value: '-last_name-', category: 'SendGrid', type: 'tag' },
  { name: 'Unsubscribe', value: '[Unsubscribe]', category: 'SendGrid', type: 'link' },
  { name: 'Web Version', value: '[weblink]', category: 'SendGrid', type: 'link' },

  // Autopilot
  { name: 'Email', value: '--Email--', category: 'Autopilot', type: 'tag' },
  { name: 'First Name', value: '--First Name--', category: 'Autopilot', type: 'tag' },
  { name: 'Last Name', value: '--Last Name--', category: 'Autopilot', type: 'tag' },
  { name: 'Company', value: '--Company--', category: 'Autopilot', type: 'tag' },
  { name: 'Unsubscribe', value: '--unsubscribe--', category: 'Autopilot', type: 'link' },

  // Campaign Monitor
  { name: 'Email', value: '[email]', category: 'Campaign Monitor', type: 'tag' },
  { name: 'First Name', value: '[firstname]', category: 'Campaign Monitor', type: 'tag' },
  { name: 'Last Name', value: '[lastname]', category: 'Campaign Monitor', type: 'tag' },
  { name: 'Unsubscribe', value: '<unsubscribe>Unsubscribe</unsubscribe>', category: 'Campaign Monitor', type: 'link' },
  {
    name: 'Web Version',
    value: '<webversion>Open in a browser</webversion>',
    category: 'Campaign Monitor',
    type: 'link',
  },

  // HubSpot
  { name: 'Company City', value: '{{ site_settings.company_city }}', category: 'HubSpot', type: 'tag' },
  { name: 'Company Name', value: '{{ site_settings.company_name }}', category: 'HubSpot', type: 'tag' },
  { name: 'Company State', value: '{{ site_settings.company_state }}', category: 'HubSpot', type: 'tag' },
  {
    name: 'Company Street Address',
    value: '{{ site_settings.company_street_address_1 }}',
    category: 'HubSpot',
    type: 'tag',
  },
  { name: 'Unsubscribe', value: '{{ unsubscribe_link }}', category: 'HubSpot', type: 'link' },
  { name: 'View as Web Page', value: '{{ view_as_page_url }}', category: 'HubSpot', type: 'link' },
]

// Mapping from export type to provider category
export const exportTypeToCategory: Record<string, string> = {
  mailchimp: 'Mailchimp',
  html: 'HTML',
  react: 'React',
}
