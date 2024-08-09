import { getPhotoUrl } from '@/lib/utils/misc'
import { v4 as uuidv4 } from 'uuid'

const generateItems = (): RowBlock[] => {
  const items = [
    {
      title: 'Get the Going app.',
      image: 'going-gif-1.gif',
      description: 'Never miss a deal with real-time flight alerts at your fingertips.',
      linkText: 'Download on iOS and Android.',
    },
    {
      title: 'Set up your airports.',
      image: 'going-gif-2.gif',
      description: "You'll only receive deals from departure airports you follow.",
      linkText: 'Choose airports',
      additionalText: "like your biggest, closest, and maybe even your parent's.",
    },
    {
      title: 'Check out your deals.',
      image: 'going-gif-3.gif',
      description: "As a Limited member, you get access to Going's best domestic flights.",
      linkText: 'your deals',
    },
  ]

  const blocks: RowBlock[] = items.map((item) => ({
    id: uuidv4(),
    type: 'row',
    attributes: {
      verticalAlign: 'top',
      valign: 'top',
    },
    columns: [
      {
        id: uuidv4(),
        type: 'column',
        attributes: { paddingBottom: '5px', width: '30%' },
        blocks: [
          {
            id: uuidv4(),
            type: 'image',
            content: '',
            attributes: {
              src: getPhotoUrl(item.image, 'going'),

              maxWidth: '150px',
              display: 'inline-block',
              verticalAlign: 'middle',
              marginTop: '0',
              marginRight: 'auto',
              marginBottom: '0',
              marginLeft: 'auto',
              borderRadius: '8px',
            },
          },
        ],
      },
      {
        id: uuidv4(),
        type: 'column',
        attributes: {
          width: '70%',
          valign: 'top',
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px',
        },
        blocks: [
          {
            id: uuidv4(),
            type: 'heading',
            as: 'h2',
            content: item.title,
            attributes: {
              maxWidth: '360px',
              display: 'inline-block',
              verticalAlign: 'middle',
              textAlign: 'left',
              fontSize: '18px',
              lineHeight: '24px',
              fontWeight: 'bold',
              color: '#004449',
              marginTop: '0',
              marginRight: '0',
              marginBottom: '16px',
              marginLeft: '0',
            },
          },
          {
            id: uuidv4(),
            type: 'text',
            content: `${item.description} <a href='/' style='color: #483cff; text-decoration: underline'>${item.linkText}</a>${item.additionalText ? ' ' + item.additionalText : ''}`,
            attributes: {
              maxWidth: '360px',
              display: 'inline-block',
              verticalAlign: 'middle',
              textAlign: 'left',
              fontSize: '16px',
              lineHeight: '24px',
              color: '#004449',
            },
          },
        ],
      },
    ],
  }))

  return blocks
}

const createSocialIcon = (icon: string, href: string) => ({
  id: uuidv4(),
  type: 'column',
  attributes: { display: 'inline-block', paddingTop: '0', paddingRight: '8px', paddingBottom: '0', paddingLeft: '8px' },
  blocks: [
    {
      id: uuidv4(),
      type: 'link',
      content: '',
      attributes: { href: href, display: 'inline-block' },
      blocks: [
        {
          id: uuidv4(),
          type: 'image',
          content: '',
          attributes: {
            src: getPhotoUrl(icon, 'going'),
            width: '34',
            display: 'block',
            margin: '0',
            alt: 'Social media icon',
          },
        },
      ],
    },
  ],
})

export const goingTemplate: Email = {
  id: '1',
  name: 'Going Template',
  preview: 'Yay! Cheap flights are headed your way',
  fontFamily: 'Arial, sans-serif',
  blocks: [
    {
      id: uuidv4(),
      type: 'container',
      attributes: { backgroundColor: '#D7FFC2', align: 'center' },
      rows: [
        {
          id: uuidv4(),
          type: 'row',
          attributes: {},
          columns: [
            {
              id: uuidv4(),
              type: 'column',
              attributes: {
                paddingTop: '20px',
                paddingRight: '15px',
                paddingBottom: '20px',
                paddingLeft: '15px',
                align: 'center',
              },
              blocks: [
                {
                  id: uuidv4(),
                  type: 'text',
                  content: "Clock's ticking on your limited time offer",
                  attributes: {
                    color: '#004449',
                    marginTop: '0',
                    marginRight: '0',
                    textAlign: 'center',
                    marginBottom: '0',
                    marginLeft: '0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'link',
                  content: 'You have 24 hours to save on your first year of Premium or Elite ',
                  attributes: {
                    href: '/',
                    color: '#004449',
                    display: 'inline-block',
                    textDecoration: 'none',
                    marginTop: '0',
                    marginRight: '0',
                    marginBottom: '0',
                    marginLeft: '0',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'image',
                  content: '',
                  attributes: {
                    src: getPhotoUrl('plane.png', 'going'),
                    width: '16',
                    height: '16',
                    display: 'inline-block',
                    border: 'none',
                    textDecoration: 'none',
                    aspectRatio: 'auto 16 / 16',
                    alt: 'plane logo',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'container',
      attributes: { backgroundColor: '#004449' },
      rows: [
        {
          id: uuidv4(),
          type: 'row',
          attributes: { paddingTop: '30px', paddingRight: '30px', paddingBottom: '30px', paddingLeft: '30px' },
          columns: [
            {
              id: uuidv4(),
              type: 'column',
              attributes: { align: 'center', maxWidth: '450px', borderSpacing: '0' },
              blocks: [
                {
                  id: uuidv4(),
                  type: 'image',
                  content: '',
                  attributes: {
                    textAlign: 'center',
                    src: getPhotoUrl('going-logo.png', 'going'),
                    width: '124',
                    alt: 'Going',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'heading',
                  content:
                    "<span style='color: #d7ffc2; font-weight: normal'>Deals</span> coming<span><br></span> your way",
                  attributes: {
                    as: 'h1',
                    textAlign: 'center',
                    marginTop: '30px',
                    marginRight: '0',
                    marginBottom: '30px',
                    marginLeft: '0',
                    fontSize: '50px',
                    lineHeight: '56px',
                    fontWeight: 'bold',
                    color: '#fffef0',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  content:
                    'We are thrilled to help you never overpay for travel again. Keep your eyes peeled for deals from LAX and other departure airports you follow.',
                  attributes: {
                    marginTop: '0',
                    marginRight: '0',
                    marginBottom: '30px',
                    marginLeft: '0',
                    color: '#fffef0',
                    fontSize: '16px',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'button',
                  content: "<span style='line-height: 55px'>VIEW MY CURRENT DEALS</span>",
                  attributes: {
                    href: '/',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    borderRadius: '30px',
                    height: '55px',
                    backgroundColor: '#483CFF',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    display: 'block',
                  },
                },
              ],
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'row',
          attributes: { align: 'center' },
          columns: [
            {
              id: uuidv4(),
              type: 'column',
              attributes: { align: 'center' },
              blocks: [
                {
                  id: uuidv4(),
                  type: 'image',
                  content: '',
                  attributes: {
                    src: getPhotoUrl('locations.png', 'going'),
                    width: '600',
                    display: 'block',
                    marginTop: '0',
                    marginRight: 'auto',
                    marginBottom: '0',
                    marginLeft: 'auto',
                    alt: 'background',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'container',
      attributes: {
        paddingTop: '60px',
        paddingRight: '15px',
        paddingBottom: '30px',
        paddingLeft: '15px',
        backgroundColor: '#FFFFFF',
      },
      rows: [
        {
          id: uuidv4(),
          type: 'row',
          attributes: {},
          columns: [
            {
              id: uuidv4(),
              type: 'column',
              attributes: { align: 'center', valign: 'top' },
              blocks: [
                {
                  id: uuidv4(),
                  type: 'text',
                  content: 'Tips to get the most bang for your buck with Going',
                  attributes: {
                    color: '#004449',
                    textAlign: 'center',
                    marginTop: '0',
                    marginRight: '0',
                    marginBottom: '24px',
                    marginLeft: '0',
                    fontSize: '24px',
                    lineHeight: '32px',
                    fontWeight: 'bold',
                  },
                },
              ],
            },
          ],
        },
        ...generateItems(),
      ],
    },
    {
      id: uuidv4(),
      type: 'container',
      attributes: {
        paddingTop: '30px',
        paddingRight: '30px',
        paddingBottom: '60px',
        paddingLeft: '30px',
        width: '100%',
        backgroundColor: '#FFFFFF',
      },
      rows: [
        {
          id: uuidv4(),
          type: 'row',
          attributes: { align: 'center' },
          columns: [
            {
              id: uuidv4(),
              type: 'column',
              attributes: { maxWidth: '480px', textAlign: 'center' },
              blocks: [
                // ...createSocialIcon('facebook.png', 'https://www.facebook.com').blocks,
                // ...createSocialIcon('instagram.png', 'https://www.instagram.com').blocks,
                // ...createSocialIcon('x.png', 'https://www.x.com').blocks,
                // ...createSocialIcon('tiktok.png', 'https://www.tiktok.com').blocks,
                // ...createSocialIcon('youtube.png', 'https://www.youtube.com').blocks,
                {
                  id: uuidv4(),
                  type: 'text',
                  content: "© Scott's Cheap Flights, Inc. DBA Going",
                  attributes: {
                    color: '#004449',
                    fontSize: '12px',
                    textAlign: 'center',
                    paddingTop: '24px',
                    paddingRight: '0',
                    paddingBottom: '0',
                    paddingLeft: '0',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  content: '4845 Pearl East Circle, Suite 118<br>PMB 28648<br>Boulder, CO 80301-6112',
                  attributes: {
                    color: '#004449',
                    lineHeight: '16px',
                    marginTop: '0',
                    marginRight: '0',
                    marginBottom: '0',
                    marginLeft: '0',
                    fontSize: '12px',
                    textAlign: 'center',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  content: '|',
                  attributes: {
                    color: '#004449',
                    fontSize: '12px',
                    paddingTop: '0',
                    paddingRight: '4px',
                    paddingBottom: '0',
                    paddingLeft: '4px',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'link',
                  content: 'Advertise',
                  attributes: {
                    href: '/',
                    color: '#004449',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  content: '|',
                  attributes: {
                    color: '#004449',
                    fontSize: '12px',
                    paddingTop: '0',
                    paddingRight: '4px',
                    paddingBottom: '0',
                    paddingLeft: '4px',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'link',
                  content: 'Email Preferences',
                  attributes: {
                    href: '/',
                    color: '#004449',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  content: '|',
                  attributes: {
                    color: '#004449',
                    fontSize: '12px',
                    paddingTop: '0',
                    paddingRight: '4px',
                    paddingBottom: '0',
                    paddingLeft: '4px',
                  },
                },
                {
                  id: uuidv4(),
                  type: 'link',
                  content: 'Unsubscribe',
                  attributes: {
                    href: '/',
                    color: '#004449',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  },
                },
              ],
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'row',
          attributes: {},
          columns: [
            {
              id: uuidv4(),
              type: 'column',
              attributes: {
                paddingTop: '24px',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
                textAlign: 'center',
                fontSize: '12px',
                lineHeight: '16px',
                color: '#004449',
                fontStyle: 'italic',
              },
              blocks: [
                {
                  id: uuidv4(),
                  type: 'text',
                  content:
                    "Offer not combinable with other discounts or previous subscriptions. Redeemable only at <a href='www.going.com'>Going.com</a>, not via the mobile app.",
                  attributes: {},
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
