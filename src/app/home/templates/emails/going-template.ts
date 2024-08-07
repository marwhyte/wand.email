import { addIdsToContainers, getPhotoUrl } from '@/lib/utils/misc'

const generateItems = () => {
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

  return items.map((item) => ({
    type: 'row' as const,
    items: [
      {
        type: 'column' as const,
        style: { paddingBottom: '5px' },
        items: [
          {
            type: 'div' as const,
            style: {
              width: '30%',
              maxWidth: '150px',
              display: 'inline-block',
              verticalAlign: 'middle',
            },
            items: [
              {
                type: 'div' as const,
                style: { padding: '15px' },
                items: [
                  {
                    type: 'image' as const,
                    src: getPhotoUrl(item.image, 'going'),
                    style: {
                      maxWidth: '100%',
                      display: 'block',
                      margin: '0 auto',
                      borderRadius: '8px',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'div' as const,
            style: {
              width: '70%',
              maxWidth: '360px',
              display: 'inline-block',
              verticalAlign: 'middle',
            },
            items: [
              {
                type: 'div' as const,
                style: {
                  padding: '15px',
                  textAlign: 'left' as const,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#004449',
                },
                items: [
                  {
                    type: 'text' as const,
                    style: {
                      margin: '0 0 16px',
                      fontSize: '18px',
                      lineHeight: '24px',
                      fontWeight: 'bold',
                    },
                    value: item.title,
                  },
                  {
                    type: 'text' as const,
                    value: `${item.description} <a href='/' style='color: #483cff; text-decoration: underline'>${item.linkText}</a>${item.additionalText ? ' ' + item.additionalText : ''}`,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }))
}

const createSocialIcon = (icon: string, href: string) => ({
  type: 'column' as const,
  style: { display: 'inline-block', padding: '0 8px' },
  items: [
    {
      type: 'link' as const,
      href: href,
      style: { display: 'inline-block' },
      items: [
        {
          type: 'image' as const,
          width: 34,
          style: { display: 'block', margin: '0' },
          src: getPhotoUrl(icon, 'going'),
          alt: 'Social media icon',
        },
      ],
    },
  ],
})

export const goingEmail = addIdsToContainers({
  preview: 'Yay! Cheap flights are headed your way',
  style: { fontFamily: 'Arial, sans-serif' },
  containers: [
    {
      bgcolor: 'D7FFC2',
      align: 'center',
      items: [
        {
          type: 'row',
          items: [
            {
              type: 'column',
              style: { padding: '20 15' },
              align: 'center',
              items: [
                {
                  type: 'text',
                  style: { color: '#004449', margin: 0, fontSize: '16px', fontWeight: '700' },
                  value: "Clock's ticking on your limited time offer",
                },
                {
                  type: 'link',
                  href: '/',
                  style: { color: '#004449', display: 'inline-block', textDecoration: 'none', margin: 0 },
                  value: 'You have 24 hours to save on your first year of Premium or Elite ',
                },
                {
                  type: 'image',
                  src: getPhotoUrl('plane.png', 'going'),
                  width: 16,
                  height: 16,
                  style: {
                    display: 'inline-block',
                    outline: 'none',
                    border: 'none',
                    textDecoration: 'none',
                    aspectRatio: 'auto 16 / 16',
                  },
                  alt: 'plane logo',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      bgcolor: '004449',
      items: [
        {
          type: 'container',
          style: { padding: '30px' },
          items: [
            {
              type: 'container',
              align: 'center',
              style: { maxWidth: '450px', borderSpacing: '0' },
              items: [
                {
                  type: 'row',
                  items: [
                    {
                      type: 'column',
                      align: 'center',
                      items: [
                        {
                          type: 'image',
                          src: getPhotoUrl('going-logo.png', 'going'),
                          width: 124,
                          alt: 'Going',
                        },
                        {
                          type: 'heading',
                          style: {
                            margin: '30px 0',
                            fontSize: '50px',
                            lineHeight: '56px',
                            fontWeight: 700,
                            color: '#fffef0',
                          },
                          value:
                            "<span style='color: #d7ffc2; font-weight: normal'>Deals</span> coming<span><br></span> your way",
                        },
                        {
                          type: 'text',
                          style: {
                            margin: '0 0 30px',
                            color: '#fffef0',
                            fontSize: '16px',
                          },
                          value:
                            'We are thrilled to help you never overpay for travel again. Keep your eyes peeled for deals from LAX and other departure airports you follow.',
                        },
                        {
                          type: 'container',
                          style: {
                            borderCollapse: 'separate',
                            height: '55px',
                          },
                          items: [
                            {
                              type: 'button',
                              href: '/',
                              style: {
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                borderRadius: '30px',
                                height: '55px',
                                backgroundColor: '#483CFF',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#ffffff',
                                textTransform: 'uppercase',
                                display: 'block',
                              },
                              value: "<span style='line-height: 55px'>VIEW MY CURRENT DEALS</span>",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'image',
          width: 600,
          style: { width: '100%' },
          src: getPhotoUrl('locations.png', 'going'),
          alt: 'background',
        },
      ],
    },
    {
      style: { padding: '60px 15px 30px' },
      bgcolor: 'FFFFFF',
      items: [
        {
          type: 'row',
          items: [
            {
              type: 'column',
              align: 'center',
              valign: 'top',
              items: [
                {
                  type: 'container',
                  items: [
                    {
                      type: 'heading',
                      as: 'h2',
                      style: {
                        color: '#004449',
                        textAlign: 'center',
                        margin: '0 0 24px',
                        fontSize: '24px',
                        lineHeight: '32px',
                        fontWeight: 700,
                      },
                      value: 'Tips to get the most bang for your buck with Going',
                    },
                  ],
                },
              ],
            },
          ],
        },
        ...generateItems(),
      ],
    },
    {
      style: {
        padding: '30px 30px 60px',
        width: '100%',
        backgroundColor: '#FFFFFF',
      },
      bgcolor: 'FFFFFF',
      items: [
        {
          type: 'row',
          align: 'center',
          items: [
            {
              type: 'column',
              items: [
                {
                  type: 'container',
                  style: { maxWidth: '480px' },
                  items: [
                    {
                      type: 'row',
                      style: { textAlign: 'center' },
                      align: 'center',
                      items: [
                        createSocialIcon('facebook.png', 'https://www.facebook.com'),
                        createSocialIcon('instagram.png', 'https://www.instagram.com'),
                        createSocialIcon('x.png', 'https://www.x.com'),
                        createSocialIcon('tiktok.png', 'https://www.tiktok.com'),
                        createSocialIcon('youtube.png', 'https://www.youtube.com'),
                      ],
                    },
                  ],
                },
                {
                  type: 'container',
                  align: 'center',
                  style: { textAlign: 'center', padding: '24px 0 0' },
                  items: [
                    {
                      type: 'text',
                      style: { color: '#004449', fontSize: '12px' },
                      value: "© Scott's Cheap Flights, Inc. DBA Going",
                    },
                    {
                      type: 'text',
                      style: {
                        color: '#004449',
                        lineHeight: '16px',
                        margin: 0,
                        fontSize: '12px',
                      },
                      value: '4845 Pearl East Circle, Suite 118<br>PMB 28648<br>Boulder, CO 80301-6112',
                    },
                    {
                      type: 'container',
                      align: 'center',
                      style: { padding: '24px 0 0', whiteSpace: 'nowrap', textAlign: 'center' },
                      items: [
                        {
                          type: 'link',
                          href: '/',
                          style: { color: '#004449', fontSize: '12px', fontWeight: '700', textDecoration: 'none' },
                          value: 'Advertise',
                        },
                        {
                          type: 'span',
                          style: { color: '#004449', fontSize: '12px', padding: '0 4px' },
                          value: '|',
                        },
                        {
                          type: 'link',
                          href: '/',
                          style: { color: '#004449', fontSize: '12px', fontWeight: '700', textDecoration: 'none' },
                          value: 'Email Preferences',
                        },
                        {
                          type: 'span',
                          style: { color: '#004449', fontSize: '12px', padding: '0 4px' },
                          value: '|',
                        },
                        {
                          type: 'link',
                          href: '/',
                          style: { color: '#004449', fontSize: '12px', fontWeight: '700', textDecoration: 'none' },
                          value: 'Unsubscribe',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'row',
          items: [
            {
              type: 'column',
              style: {
                padding: '24px 0 0',
                textAlign: 'center',
                fontSize: '12px',
                lineHeight: '16px',
                color: '#004449',
                fontStyle: 'italic',
              },
              items: [
                {
                  type: 'text',
                  value:
                    "Offer not combinable with other discounts or previous subscriptions. Redeemable only at <a href='www.going.com'>Going.com</a>, not via the mobile app.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
