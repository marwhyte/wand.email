import { Chat, Company } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useEffect } from 'react'

type Props = {
  chat?: Chat
  chatId: string
  company?: Company | null
}

export function useChatHistory({ chat, chatId, company }: Props) {
  const { setChatId, setTitle, setCompany } = useChatStore()
  const { setEmail } = useEmailStore()

  useEffect(() => {
    if (chat) {
      setEmail({
        id: '42635e4e-676f-47a2-8577-c668391b4adb',
        rows: [
          {
            id: '375c1f4b-6981-4992-ac42-41cbe438d690',
            type: 'row',
            columns: [
              {
                id: '769f1b10-6dbf-4621-a70a-f137904bbc3e',
                type: 'column',
                blocks: [
                  {
                    id: '6ddbffca-695d-40c4-a392-db72ee86ca3b',
                    type: 'image',
                    attributes: {
                      alt: 'Your Store Logo',
                      src: 'logo',
                    },
                  },
                ],
                attributes: {
                  width: '100%',
                },
              },
            ],
            attributes: {
              type: 'header',
            },
          },
          {
            id: '4a6471de-0944-4c77-b243-ad36aff84310',
            type: 'row',
            columns: [
              {
                id: '41019f61-9110-4825-925e-62da847ddbf5',
                type: 'column',
                blocks: [
                  {
                    id: 'ff4d9a77-82de-43ff-9c6c-e18fcc92b655',
                    type: 'heading',
                    attributes: {
                      level: 'h1',
                      content: 'Welcome to Our Store! 🎉',
                    },
                  },
                  {
                    id: 'f01dea15-b5ff-4326-9f80-71341f584f54',
                    type: 'text',
                    attributes: {
                      content:
                        "Thanks for joining our community! We're excited to offer you the latest products and exclusive deals.",
                    },
                  },
                  {
                    id: '90a3c23d-e2d8-4367-9999-66e0380e9048',
                    type: 'button',
                    attributes: {
                      href: '#',
                      content: 'Shop Now',
                    },
                  },
                ],
                attributes: {
                  width: '100%',
                },
              },
            ],
            attributes: {},
          },
          {
            id: 'e930634e-c885-49a4-8464-a03c85c97277',
            type: 'row',
            columns: [
              {
                id: '75978c1d-4fba-43b7-b953-d93d20fc5832',
                type: 'column',
                blocks: [
                  {
                    id: '6d003335-3706-4262-a4e3-7668b4c1b600',
                    type: 'image',
                    attributes: {
                      alt: 'New Arrivals',
                      src: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
                    },
                  },
                  {
                    id: 'ff6db93e-c632-483c-bb0b-2c974c12cac6',
                    type: 'heading',
                    attributes: {
                      level: 'h2',
                      content: 'New Arrivals',
                    },
                  },
                  {
                    id: '653ca27d-0194-4ece-af20-4ac0cf3a4812',
                    type: 'text',
                    attributes: {
                      content: 'Check out our latest clothing and accessories.',
                    },
                  },
                  {
                    id: 'b8a9be11-1a06-467c-938c-106c8933fabf',
                    type: 'link',
                    attributes: {
                      href: '#',
                      content: 'Explore Now',
                    },
                  },
                ],
                attributes: {
                  width: '50%',
                },
              },
              {
                id: '8bf6a450-4492-4b15-a01e-fbfac5bfb715',
                type: 'column',
                blocks: [
                  {
                    id: '7b434d0d-6519-4c4f-962a-1d8151de01d4',
                    type: 'image',
                    attributes: {
                      alt: 'Home Decor',
                      src: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
                    },
                  },
                  {
                    id: '949f4748-c4de-480a-8b0e-a540aabcf3cc',
                    type: 'heading',
                    attributes: {
                      level: 'h2',
                      content: 'Home Decor',
                    },
                  },
                  {
                    id: '17c9d1cd-a5af-42dd-afa1-32917fb87ac9',
                    type: 'text',
                    attributes: {
                      content: 'Freshen up your space with our stylish home decor collection.',
                    },
                  },
                  {
                    id: '62a21783-b08a-4d2f-9a63-b5422c7c4a4d',
                    type: 'link',
                    attributes: {
                      href: '#',
                      content: 'Discover More',
                    },
                  },
                ],
                attributes: {
                  width: '50%',
                },
              },
            ],
            attributes: {
              type: 'gallery',
            },
          },
          {
            id: '7e3ce306-f885-45d2-a177-9a935b20e2b7',
            type: 'row',
            columns: [
              {
                id: '2c469fb9-1a8c-4a8a-85f6-f6ab4ba18e0c',
                type: 'column',
                blocks: [
                  {
                    id: '34f685d3-3cfb-4fcb-9ce6-21874190d2c6',
                    type: 'heading',
                    attributes: {
                      level: 'h2',
                      content: 'Special Offer 🎁',
                    },
                  },
                  {
                    id: '8e4ea692-4a70-4e9c-8edb-ce10a707caf5',
                    type: 'text',
                    attributes: {
                      content: 'Enjoy 20% off your first order with code <b>WELCOME20</b> at checkout!',
                    },
                  },
                ],
                attributes: {
                  width: '100%',
                },
              },
            ],
            attributes: {},
          },
          {
            id: '44486c2e-fded-46bc-af7e-c37dcd05338a',
            type: 'row',
            columns: [
              {
                id: '59b03fa9-bc69-4312-9646-c6697f7a7008',
                type: 'column',
                blocks: [
                  {
                    id: '7c2bd90b-7070-4b47-ae4e-ec9214605516',
                    type: 'list',
                    attributes: {
                      type: 'ul',
                      items: [
                        'Free shipping on orders over $50',
                        'Easy returns and exchanges',
                        'Dedicated customer support',
                      ],
                    },
                  },
                ],
                attributes: {
                  width: '100%',
                },
              },
            ],
            attributes: {},
          },
          {
            id: '17643160-b8c2-4b11-8eb4-5e9307c51bfd',
            type: 'row',
            columns: [
              {
                id: 'a31ce466-d741-498c-80af-68076fd6cbf0',
                type: 'column',
                blocks: [
                  {
                    id: 'cfdee1e5-d51b-4397-ac9e-16933abe8d97',
                    type: 'divider',
                    attributes: {},
                  },
                  {
                    id: 'bcc47603-cd64-4893-a62f-8bbbc1a35f93',
                    type: 'survey',
                    attributes: {
                      kind: 'rating',
                      question: 'How likely are you to recommend our store?',
                    },
                  },
                ],
                attributes: {
                  width: '100%',
                },
              },
            ],
            attributes: {},
          },
          {
            id: 'e9ecdda9-b92b-402b-b276-1d9fab065cf2',
            type: 'row',
            columns: [
              {
                id: '79fa7e45-4280-4b9f-826f-26a7f7bf5324',
                type: 'column',
                blocks: [
                  {
                    id: 'ef1dd329-d7dc-48cc-a3f2-724894f775db',
                    type: 'image',
                    attributes: {
                      alt: 'Your Store Logo',
                      src: 'logo',
                    },
                  },
                  {
                    id: 'dff9db53-1e66-46b3-81b5-f50fba6afb04',
                    type: 'text',
                    attributes: {
                      content: 'Follow us on social media:',
                    },
                  },
                  {
                    id: '12d06c1f-7a10-4e58-b718-799ff42f3e46',
                    type: 'socials',
                    attributes: {
                      links: [
                        {
                          alt: 'Facebook',
                          url: '#',
                          icon: 'facebook',
                          title: 'Facebook',
                        },
                        {
                          alt: 'Instagram',
                          url: '#',
                          icon: 'instagram',
                          title: 'Instagram',
                        },
                        {
                          alt: 'X',
                          url: '#',
                          icon: 'x',
                          title: 'X',
                        },
                      ],
                      folder: 'socials-color',
                    },
                  },
                  {
                    id: '67dc1096-0251-4e5f-991d-a1f48cf023b1',
                    type: 'text',
                    attributes: {
                      content: '© 2024 Your Store. All rights reserved.',
                    },
                  },
                ],
                attributes: {
                  width: '100%',
                },
              },
            ],
            attributes: {
              type: 'footer',
            },
          },
        ],
        type: 'ecommerce',
        preview: 'Welcome to our store! Explore our latest products and exclusive offers.',
        styleVariant: 'default',
      })
      setTitle(chat.title)
    } else {
      setEmail(null)
      setTitle(undefined)
      return
    }
  }, [chat?.id])

  useEffect(() => {
    setChatId(chatId)
  }, [chatId])

  useEffect(() => {
    if (company) {
      setCompany(company)
    }
  }, [company])
}
