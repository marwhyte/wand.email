import { getPhotoUrl } from '@/lib/utils/misc'

export const turbotaxTemplate: Email = {
  id: 'b72a9f4f-eb7a-48fd-bb63-f5ac5bbf6e9c',
  name: 'TurboTax Filing Preparation',
  preview: 'Marco: Know which documents you’ll need when it’s time to file',
  fontFamily: 'Arial, sans-serif',
  width: '600px',
  color: '#333333',
  bgColor: '#FFFFFF',
  rows: [
    {
      id: 'row-1',
      type: 'row',
      attributes: {
        paddingTop: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '600px',
        },
      },
      columns: [
        {
          id: 'col-1-1',
          type: 'column',
          gridColumns: 12,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: 'block-1-1-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('intuit-turbotax.png', 'turbotax'),
                alt: 'Intuit TurboTax Logo',
                width: '160px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'row-2',
      type: 'row',
      attributes: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '30px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '600px',
        },
      },
      columns: [
        {
          id: 'col-2-1',
          type: 'column',
          gridColumns: 3,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: 'block-2-1-1',
              type: 'link',
              content: 'Blog',
              attributes: {
                href: '#',
                color: '#393a3d',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
              },
            },
          ],
        },
        {
          id: 'col-2-2',
          type: 'column',
          gridColumns: 3,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: 'block-2-2-1',
              type: 'link',
              content: 'Tax Calculators',
              attributes: {
                href: '#',
                color: '#393a3d',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
              },
            },
          ],
        },
        {
          id: 'col-2-3',
          type: 'column',
          gridColumns: 3,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: 'block-2-3-1',
              type: 'link',
              content: 'Podcast',
              attributes: {
                href: '#',
                color: '#393a3d',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
              },
            },
          ],
        },
        {
          id: 'col-2-4',
          type: 'column',
          gridColumns: 3,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: 'block-2-4-1',
              type: 'link',
              content: 'Sign in',
              attributes: {
                href: '#',
                color: '#393a3d',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'row-3',
      type: 'row',
      attributes: {
        paddingTop: '14px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '14px',
        maxWidth: '420px',
        align: 'center',
      },
      container: {
        attributes: {
          maxWidth: '600px',
          backgroundColor: '#EAEAE3',
        },
      },
      columns: [
        {
          id: 'col-3-1',
          type: 'column',
          gridColumns: 2,
          attributes: {
            valign: 'middle',
          },
          blocks: [
            {
              id: 'block-3-1-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('flag.png', 'turbotax'),
                alt: 'Status Flag',
                width: '100%',
              },
            },
          ],
        },
        {
          id: 'col-3-2',
          type: 'column',
          gridColumns: 10,
          attributes: {
            valign: 'middle',
          },
          blocks: [
            {
              id: 'block-3-2-1',
              type: 'text',
              content: 'STATUS: Tax Hero',
              attributes: {
                fontSize: '18px',
                color: '#21262a',
                fontWeight: 'bold',
                paddingLeft: '8px',
              },
            },
            {
              id: 'block-3-2-2',
              type: 'text',
              content: "You're one of the most savvy tax planners out there. Keep it up!",
              attributes: {
                fontSize: '18px',
                color: '#21262a',
                paddingLeft: '8px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'row-4',
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
        maxWidth: '420px',
        align: 'center',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '600px',
          backgroundColor: '#F4F4EF',
        },
      },
      columns: [
        {
          id: 'col-4-1',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'block-4-1-1',
              type: 'heading',
              content: "Marco: Know which documents you'll need when it's time to file",
              attributes: {
                as: 'h1',
                fontSize: '32px',
                lineHeight: '36px',
                fontWeight: 'bold',
                color: '#21262a',
                textAlign: 'center',
                paddingBottom: '24px',
                letterSpacing: '-0.03em',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'row-5',
      type: 'row',
      attributes: {
        paddingBottom: '40px',
        maxWidth: '420px',
        align: 'center',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '600px',
          backgroundColor: '#f4f4ef',
        },
      },
      columns: [
        {
          id: 'col-5-1',
          type: 'column',
          gridColumns: 12,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: 'block-5-1-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('sitting-in-chair.gif', 'turbotax'),
                alt: 'Person sitting with cat',
                width: '100%',
                textAlign: 'center',
              },
            },
            {
              id: 'block-5-1-2',
              type: 'text',
              content:
                'Changes this year could impact your taxes. Answer a few questions today to get the tax checklist that will get you prepared for filing.',
              attributes: {
                fontSize: '18px',
                lineHeight: '24px',
                color: '#21262a',
                letterSpacing: '-0.03em',
                textAlign: 'center',
                paddingTop: '24px',
                paddingBottom: '24px',
              },
            },
            {
              id: 'block-5-1-3',
              type: 'button',
              content: 'Get my checklist',
              attributes: {
                href: '#',
                backgroundColor: '#205ea3',
                color: '#FFFFFF',
                borderRadius: '5px',
                paddingTop: '24px',
                paddingBottom: '24px',
                paddingLeft: '48px',
                paddingRight: '48px',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'row-6',
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '600px',
        },
      },
      columns: [
        {
          id: 'col-6-1',
          type: 'column',
          gridColumns: 2,
          attributes: {},
          blocks: [
            {
              id: 'block-6-1-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('intuit.png', 'turbotax'),
                alt: 'Intuit Logo',
                width: '100%',
              },
            },
          ],
        },
        {
          id: 'col-6-2',
          type: 'column',
          gridColumns: 2,
          attributes: {},
          blocks: [
            {
              id: 'block-6-2-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('turbotax.png', 'turbotax'),
                alt: 'TurboTax Logo',
                width: '100%',
                textAlign: 'center',
              },
            },
          ],
        },
        {
          id: 'col-6-3',
          type: 'column',
          gridColumns: 2,
          attributes: {},
          blocks: [
            {
              id: 'block-6-3-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('quickbooks.png', 'turbotax'),
                alt: 'QuickBooks Logo',
                width: '100%',
                textAlign: 'center',
              },
            },
          ],
        },
        {
          id: 'col-6-4',
          type: 'column',
          gridColumns: 2,
          attributes: {},
          blocks: [
            {
              id: 'block-6-4-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('credit-karma.png', 'turbotax'),
                alt: 'Credit Karma Logo',
                width: '100%',
                textAlign: 'center',
              },
            },
          ],
        },
        {
          id: 'col-6-5',
          type: 'column',
          gridColumns: 2,
          attributes: {},
          blocks: [
            {
              id: 'block-6-5-1',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('mailchimp.png', 'turbotax'),
                alt: 'Mailchimp Logo',
                width: '100%',
                textAlign: 'center',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'row-7',
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '600px',
        },
      },
      columns: [
        {
          id: 'col-7-1',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'block-7-1-1',
              type: 'text',
              content:
                "<strong>We're looking out for you</strong><br><br>" +
                "We'll never ask for personal information in an email. When you click on a link, the address should always contain intuit.com/.<br><br>" +
                '<a href="#" style="color: #205ea3; text-decoration: underline;">Click here</a> to see TurboTax product guarantees, disclaimers and other important information.<br><br>' +
                'This email was sent to: <strong>marcolwhyte@gmail.com</strong><br><br>' +
                'Did you receive this email in error? <a href="#" style="color: #205ea3; text-decoration: underline;">Find out why</a>.<br>' +
                'Update your email preferences or <a href="#" style="color: #205ea3; text-decoration: underline;">unsubscribe</a>.<br><br>' +
                '<strong>©2024 Intuit Inc. All rights reserved. Trademark.</strong><br>' +
                'Customer Communications, 2800 E. Commerce Center Place, Tucson, AZ 85706<br>' +
                '40894-004',
              attributes: {
                fontSize: '14px',
                color: '#393a3d',
                textAlign: 'left',
                lineHeight: '22px',
              },
            },
          ],
        },
      ],
    },
  ],
}
