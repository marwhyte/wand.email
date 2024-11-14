import { getPhotoUrl } from '@/lib/utils/misc'
import { v4 as uuidv4 } from 'uuid'

export const slackTemplate: Email = {
  id: '3f5bd71b-028c-457e-98f7-45e4d3739f7a',
  name: 'slack',
  preview: 'Your free trial has ended. SentSwiftly has now been downgraded...',
  fontFamily: 'Lato, Arial, sans-serif',
  width: '500px',
  color: '#333333',
  bgColor: '#ffffff',
  rows: [
    {
      id: 'ef51e075-d5d5-4f98-a78b-d599b25f59e9',
      type: 'row',
      attributes: {
        paddingTop: '36px',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
        },
      },
      columns: [
        {
          id: '04f3eb18-fc66-4d82-ac6b-be98fbfd94dc',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: '43cb2add-026f-483d-aa9a-19b2f881acec',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('slack-logo.png', 'slack'),
                alt: 'Slack Logo',
                width: '120px',
                paddingBottom: '32px',
              },
            },
            {
              id: 'e963ee46-8686-4977-b2ca-215138647460',
              type: 'heading',
              content: 'Your free trial has ended',
              attributes: {
                textAlign: 'left',
                as: 'h1',
                fontSize: '36px',
                fontWeight: 'bold',
                paddingBottom: '28px',
                lineHeight: '42px',
                letterSpacing: '-0.25px',
                color: '#1d1c1d',
              },
            },
            {
              id: '763a3adb-6e57-45ce-9856-7e36294b9064',
              type: 'text',
              content:
                'SentSwiftly has now been downgraded to the free plan. Your team no longer has access to historical conversations & files, along with other Slack premium features.',
              attributes: {
                textAlign: 'left',
                fontSize: '20px',
                color: '#434245',
                paddingBottom: '20px',
                paddingLeft: '0px',
                paddingRight: '0px',
                lineHeight: '28px',
                letterSpacing: '-0.2px',
              },
            },
          ],
        },
      ],
    },
    {
      id: '66368904-b028-41a7-9703-5ddc19b4da90',
      type: 'row',
      attributes: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        borderColor: '#f8f4f0',
        borderWidth: '1px',
        borderStyle: 'solid',
        paddingBottom: '24px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
          paddingBottom: '36px',
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
      columns: [
        {
          id: 'bdfd88b7-61d9-4a9c-9f90-ea384b7b0323',
          type: 'column',
          gridColumns: 12,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: 'c20b5c8d-68dd-4456-bf48-b5985f636db7',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('message-file-locked.png', 'slack'),
                alt: 'Message & File History Locked',
                width: '100%',
              },
            },
            {
              id: '2c54d0dc-6865-4354-b06f-3f8907414eb0',
              type: 'heading',
              content: 'Message & file history locked',
              attributes: {
                textAlign: 'center',
                as: 'h2',
                paddingLeft: '8px',
                paddingRight: '8px',
                paddingTop: '24px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333333',
              },
            },
            {
              id: 'd2481daf-d3a3-4b0c-958e-6154060373cc',
              type: 'text',
              content: 'Regain access to your historical messages & files.',
              attributes: {
                textAlign: 'center',
                fontSize: '16px',
                color: '#333333',
                paddingTop: '8px',
                paddingBottom: '24px',
                paddingLeft: '8px',
                paddingRight: '8px',
                lineHeight: '1.5',
              },
            },
            {
              id: '528c2356-d469-46e7-b38d-4eec19d32e08',
              type: 'button',
              content: 'LEARN MORE',
              attributes: {
                href: '#',
                backgroundColor: '#611f69',
                color: '#ffffff',
                borderRadius: '8px',
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'pro-features-row',
      type: 'row',
      attributes: {
        paddingTop: '40px',
        backgroundColor: '#f8f4f0',
        paddingLeft: '40px',
        paddingRight: '40px',
        width: '100%',
        minWidth: '100%',
      },
      container: {
        align: 'center',
        attributes: {
          minWidth: '100%',
          maxWidth: '500px',
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
      columns: [
        {
          id: 'pro-badge-col',
          type: 'column',
          gridColumns: 3,
          attributes: {
            valign: 'middle',
          },
          blocks: [
            {
              id: 'pro-badge',
              type: 'text',
              content: 'PRO',
              attributes: {
                backgroundColor: '#611f69',
                color: '#ffffff',
                textAlign: 'center',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingRight: '3px',
                paddingLeft: '3px',
              },
            },
          ],
        },
        {
          id: 'locked-text-col',
          type: 'column',
          gridColumns: 9,
          attributes: {
            valign: 'middle',
          },
          blocks: [
            {
              id: 'locked-text',
              type: 'text',
              content: 'Also locked...',
              attributes: {
                textAlign: 'left',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1d1c1d',
                paddingTop: '0px',
                paddingBottom: '0px',
                paddingLeft: '26px',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'slack-connect-row',
      type: 'row',
      attributes: {
        paddingTop: '40px',
        paddingBottom: '20px',
        backgroundColor: '#f8f4f0',
        paddingLeft: '40px',
        paddingRight: '40px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
      columns: [
        {
          id: 'connect-icon-col',
          type: 'column',
          gridColumns: 1.5,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'connect-icon',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('rehashtag.png', 'slack'),
                alt: 'Slack Connect Icon',
                width: '100%',
              },
            },
          ],
        },
        {
          id: 'connect-content-col',
          type: 'column',
          gridColumns: 10.5,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'connect-title',
              type: 'text',
              content: 'Slack Connect channels',
              attributes: {
                textAlign: 'left',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1d1c1d',
                paddingTop: '0px',
                paddingLeft: '26px',
                paddingRight: '0px',
                lineHeight: '24px',
              },
            },
            {
              id: 'connect-description',
              type: 'text',
              content: 'Seamlessly collaborate with external connections',
              attributes: {
                textAlign: 'left',
                fontSize: '16px',
                color: '#434245',
                paddingTop: '0px',
                paddingBottom: '0px',
                paddingLeft: '26px',
                paddingRight: '0px',
                lineHeight: '24px',
                letterSpacing: '-0.2px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'huddles-row',
      type: 'row',
      attributes: {
        paddingBottom: '20px',
        backgroundColor: '#f8f4f0',
        paddingLeft: '40px',
        paddingRight: '40px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
      columns: [
        {
          id: 'huddles-icon-col',
          type: 'column',
          gridColumns: 1.5,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'huddles-icon',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('headphones.png', 'slack'),
                alt: 'Huddles Icon',
                width: '100%',
              },
            },
          ],
        },
        {
          id: 'huddles-content-col',
          type: 'column',
          gridColumns: 10.5,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'huddles-title',
              type: 'text',
              content: 'Group huddles',
              attributes: {
                textAlign: 'left',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1d1c1d',
                paddingTop: '0px',
                paddingLeft: '26px',
                paddingRight: '0px',
                lineHeight: '24px',
              },
            },
            {
              id: 'huddles-description',
              type: 'text',
              content: 'Streamline conversations with multi-person video calls',
              attributes: {
                textAlign: 'left',
                fontSize: '16px',
                color: '#434245',
                paddingTop: '0px',
                paddingBottom: '0px',
                paddingLeft: '26px',
                paddingRight: '0px',
                lineHeight: '24px',
                letterSpacing: '-0.2px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'canvases-row',
      type: 'row',
      attributes: {
        paddingBottom: '40px',
        backgroundColor: '#f8f4f0',
        paddingLeft: '40px',
        paddingRight: '40px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
      columns: [
        {
          id: 'canvases-icon-col',
          type: 'column',
          gridColumns: 1.5,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'canvases-icon',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('papers.png', 'slack'),
                alt: 'Canvases Icon',
                width: '100%',
              },
            },
          ],
        },
        {
          id: 'canvases-content-col',
          type: 'column',
          gridColumns: 10.5,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'canvases-title',
              type: 'text',
              content: 'Unlimited canvases',
              attributes: {
                textAlign: 'left',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1d1c1d',
                paddingTop: '0px',
                paddingLeft: '26px',
                paddingRight: '0px',
                lineHeight: '24px',
              },
            },
            {
              id: 'canvases-description',
              type: 'text',
              content: 'Organize, curate, collaborate, and share information right in your Slack workspace',
              attributes: {
                textAlign: 'left',
                fontSize: '16px',
                color: '#434245',
                paddingTop: '0px',
                paddingBottom: '0px',
                paddingLeft: '26px',
                paddingRight: '0px',
                lineHeight: '24px',
                letterSpacing: '-0.2px',
              },
            },
          ],
        },
      ],
    },
    {
      id: '99bfeb17-b733-4f9d-8e5d-c321d74551f6',
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
        },
      },
      columns: [
        {
          id: '9688d727-10bb-41c0-9d8d-af8e0664087f',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: '1f8ae2ac-bcb2-4d04-a3aa-a6fd9d1f2758',
              type: 'text',
              content:
                '<p><strong>🧠 Did you know?</strong></p><p>“Slack” stands for Searchable Log of All Conversation & Knowledge – being able to keep track of history, decisions & important details is the building block of what makes Slack so powerful for your team.</p>',
              attributes: {
                textAlign: 'left',
                fontSize: '14px',
                color: '#333333',
                paddingTop: '8px',
                paddingBottom: '16px',
                paddingLeft: '0px',
                paddingRight: '0px',
                lineHeight: '1.5',
              },
            },
            {
              id: '99c5eab3-fd84-4c72-a16a-d84d0d6089f8',
              type: 'text',
              content:
                '<p><strong>Questions?</strong>&nbsp;<a href="https://support.slack.com" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 68, 73);"><strong><u>Contact our support team</u></strong></a> or <a href="https://slack.com/pro" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 68, 73);"><strong><u>learn more</u></strong></a> about Slack Pro</p>',
              attributes: {
                textAlign: 'left',
                fontSize: '14px',
                color: '#333333',
                paddingTop: '16px',
                paddingBottom: '24px',
                paddingLeft: '0px',
                paddingRight: '0px',
                lineHeight: '1.5',
              },
            },
          ],
        },
      ],
    },
    {
      id: '5c041493-7599-41f9-bcb5-2bd1b0e0c0f1',
      type: 'row',
      attributes: {
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
        },
      },
      columns: [
        {
          id: 'footer-logo-column',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'c0da15f3-aa5f-4e16-9e4d-7ec4a74a7695',
              type: 'image',
              content: '',
              attributes: {
                width: '100px',
                src: getPhotoUrl('slack-logo.png', 'slack'),
                alt: 'Slack Logo',
              },
            },
          ],
        },
        {
          id: 'footer-socials-column',
          type: 'column',
          gridColumns: 6,
          attributes: {
            align: 'right',
          },
          blocks: [
            {
              id: '586c966d-8713-406b-ab1d-94a6c7258870',
              type: 'socials',
              attributes: {
                folder: 'socials-dark-gray',
                socialLinks: [
                  {
                    icon: 'facebook',
                    url: 'https://www.facebook.com',
                    title: 'Facebook',
                    alt: 'Facebook',
                  },
                  {
                    icon: 'linkedin',
                    url: 'https://www.linkedin.com',
                    title: 'LinkedIn',
                    alt: 'LinkedIn',
                  },
                  {
                    icon: 'youtube',
                    url: 'https://www.youtube.com',
                    title: 'YouTube',
                    alt: 'YouTube',
                  },
                  {
                    icon: 'instagram',
                    url: 'https://www.instagram.com',
                    title: 'Instagram',
                    alt: 'Instagram',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '500px',
        },
      },
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          gridColumns: 12,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: uuidv4(),
              type: 'text',
              content: `<a href="/our-blog" style="color: #666666; text-decoration: underline;">Our Blog</a> | <a href="/policies" style="color: #666666; text-decoration: underline;">Policies</a> | <a href="/help-center" style="color: #666666; text-decoration: underline;">Help Center</a> | <a href="/slack-community" style="color: #666666; text-decoration: underline;">Slack Community</a>`,
              attributes: {
                textAlign: 'center',
                fontSize: '14px',
                color: '#666666',
                paddingBottom: '24px',
              },
            },
            {
              id: uuidv4(),
              type: 'text',
              content:
                '©2024 Slack Technologies, LLC, a Salesforce company.<br/>415 Mission Street, 3rd Floor, San Francisco, CA 94105<br/><br/>All rights reserved.',
              attributes: {
                textAlign: 'center',
                fontSize: '14px',
                color: '#666666',
              },
            },
          ],
        },
      ],
    },
  ],
}
