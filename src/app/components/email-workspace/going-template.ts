import { getPhotoUrl } from '@/lib/utils/misc'
import { v4 as uuidv4 } from 'uuid'

const defaultContainerStyles = {
  attributes: {
    backgroundImage: 'none',
    backgroundPosition: 'top left',
    backgroundRepeat: 'no-repeat',
  },
}

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

  const rows: RowBlock[] = items.map((item) => ({
    id: uuidv4(),
    type: 'row' as const,
    container: {
      ...defaultContainerStyles,
      attributes: {
        ...defaultContainerStyles.attributes,
      },
    },
    attributes: {
      verticalAlign: 'top',
      valign: 'top',
      paddingTop: '15px',
      paddingRight: '15px',
      paddingBottom: '15px',
      paddingLeft: '15px',
    },
    columns: [
      {
        id: uuidv4(),
        type: 'column' as const,
        attributes: { align: 'center' },
        gridColumns: 4,
        blocks: [
          {
            id: uuidv4(),
            type: 'image',
            content: '',
            attributes: {
              src: getPhotoUrl(item.image, 'going'),
              width: '70%',
            },
          },
        ],
      },
      {
        id: uuidv4(),
        type: 'column',
        attributes: {
          valign: 'top',
        },
        gridColumns: 8,
        blocks: [
          {
            id: uuidv4(),
            type: 'heading',
            content: item.title,
            attributes: {
              as: 'h2',
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
              paddingTop: '10px',
              paddingRight: '0',
              paddingBottom: '10px',
              paddingLeft: '0',
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

  return rows
}

const createSocialIcon = (icon: string, href: string) => ({
  id: uuidv4(),
  type: 'column',
  attributes: { display: 'inline-block' },
  gridColumns: 12,
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
            width: '34px',
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
  id: uuidv4(),
  name: 'Going Template',
  preview: 'Yay! Cheap flights are headed your way',
  fontFamily: 'Arial, sans-serif',
  width: '600',
  color: '#3b82f6',
  bgColor: '#FFFFFF',
  rows: [
    {
      id: uuidv4(),
      type: 'row' as const,
      container: {
        ...defaultContainerStyles,
        align: 'center' as const,
        attributes: {
          ...defaultContainerStyles.attributes,
          backgroundColor: '#D7FFC2',
        },
      },
      attributes: {
        paddingTop: '20px',
        paddingRight: '15px',
        paddingBottom: '20px',
        paddingLeft: '15px',
      },
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          attributes: {
            align: 'center',
          },
          gridColumns: 12,
          blocks: [
            {
              id: uuidv4(),
              type: 'text',
              content: "Clock's ticking on your limited time offer",
              attributes: {
                color: '#004449',
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
                textAlign: 'center',
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
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
              },
            },
            {
              id: uuidv4(),
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('plane.png', 'going'),
                width: '16px',
                height: '16px',
                display: 'inline-block',
                textDecoration: 'none',
                alt: 'plane logo',
              },
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'row' as const,
      container: {
        ...defaultContainerStyles,
        align: 'center',
        attributes: {
          ...defaultContainerStyles.attributes,
          backgroundColor: '#004449',
        },
      },
      attributes: {
        paddingTop: '30px',
        paddingBottom: '0',
      },
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          attributes: { align: 'center', borderSpacing: '0' },
          gridColumns: 12,
          blocks: [
            {
              id: uuidv4(),
              type: 'image',
              content: '',
              attributes: {
                textAlign: 'center',
                src: getPhotoUrl('going-logo.png', 'going'),
                width: '20%',
                alt: 'Going',
              },
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'row' as const,
      container: {
        ...defaultContainerStyles,
        align: 'center',
        attributes: {
          ...defaultContainerStyles.attributes,
          backgroundColor: '#004449',
        },
      },
      attributes: {
        paddingTop: '30px',
        paddingRight: '30px',
        paddingBottom: '30px',
        paddingLeft: '30px',
      },
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          attributes: { align: 'center', borderSpacing: '0' },
          gridColumns: 12,
          blocks: [
            {
              id: uuidv4(),
              type: 'heading',
              content: "<span style='color: #d7ffc2;'>Deals</span><strong> coming<span><br></span> your way</strong",
              attributes: {
                as: 'h1',
                textAlign: 'center',
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '30px',
                paddingLeft: '0',
                fontSize: '50px',
                lineHeight: '56px',
                color: '#fffef0',
              },
            },
            {
              id: uuidv4(),
              type: 'text',
              content:
                'We are thrilled to help you never overpay for travel again. Keep your eyes peeled for deals from LAX and other departure airports you follow.',
              attributes: {
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '30px',
                paddingLeft: '0',
                color: '#fffef0',
                fontSize: '16px',
              },
            },
            {
              id: uuidv4(),
              type: 'button',
              content: 'VIEW MY CURRENT DEALS',
              attributes: {
                href: '/',
                textAlign: 'center',
                verticalAlign: 'middle',
                borderRadius: '30px',
                backgroundColor: '#483CFF',
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#ffffff',
                textTransform: 'uppercase',
                paddingTop: '20px',
                paddingRight: '40px',
                paddingBottom: '20px',
                paddingLeft: '40px',
              },
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'row' as const,
      container: {
        ...defaultContainerStyles,
        align: 'center',
        attributes: {
          ...defaultContainerStyles.attributes,
          paddingTop: '60px',
          paddingRight: '15px',
          paddingBottom: '30px',
          paddingLeft: '15px',
          backgroundColor: '#004449',
        },
      },
      attributes: {},
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          attributes: { align: 'center' },
          gridColumns: 12,
          blocks: [
            {
              id: uuidv4(),
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('locations.png', 'going'),
                width: '100%',
                display: 'block',
                alt: 'background',
              },
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'row' as const,
      container: {
        ...defaultContainerStyles,
        align: 'center',
        attributes: {
          ...defaultContainerStyles.attributes,
          paddingTop: '60px',
          paddingRight: '15px',
          paddingBottom: '30px',
          paddingLeft: '15px',
        },
      },
      attributes: {},
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          attributes: { align: 'center', valign: 'top' },
          gridColumns: 12,
          blocks: [
            {
              id: uuidv4(),
              type: 'text',
              content: 'Tips to get the most bang for your buck with Going',
              attributes: {
                color: '#004449',
                textAlign: 'center',
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '24px',
                paddingLeft: '0',
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
    {
      id: uuidv4(),
      type: 'row' as const,
      container: {
        ...defaultContainerStyles,
        align: 'center',
        attributes: {
          ...defaultContainerStyles.attributes,
          paddingTop: '30px',
          paddingRight: '30px',
          paddingBottom: '60px',
          paddingLeft: '30px',
        },
      },
      attributes: {},
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          attributes: {},
          gridColumns: 12,
          blocks: [
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
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
                fontSize: '12px',
                textAlign: 'center',
              },
            },
            {
              id: uuidv4(),
              type: 'text',
              content:
                '<a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Advertise</a> | <a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Email Preferences</a> | <a href="/" style="color: #004449; font-size: 12px; font-weight: bold; text-decoration: none;">Unsubscribe</a>',
              attributes: {
                color: '#004449',
                fontSize: '12px',
                paddingTop: '0',
                paddingRight: '4px',
                paddingBottom: '0',
                paddingLeft: '4px',
              },
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'row' as const,
      container: {
        ...defaultContainerStyles,
        attributes: {
          ...defaultContainerStyles.attributes,
          paddingTop: '24px',
          paddingRight: '0',
          paddingBottom: '0',
          paddingLeft: '0',
        },
      },
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
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          attributes: {},
          gridColumns: 12,
          blocks: [
            {
              id: uuidv4(),
              type: 'text',
              content:
                "Offer not combinable with other discounts or previous subscriptions. Redeemable only at <a href='www.going.com'>Going.com</a>, not via the mobile app.",
              attributes: {
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
              },
            },
          ],
        },
      ],
    },
  ],
}
