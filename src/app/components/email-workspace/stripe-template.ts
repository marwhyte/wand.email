import { getPhotoUrl } from '@/lib/utils/misc'

export const stripeTemplate: Email = {
  id: '8f9a845f-92e4-4d3c-af7c-f938d66cf0d6',
  name: 'The Update - November 2024',
  preview: 'Product news from Stripe Tour New York',
  fontFamily: 'Arial, sans-serif',
  width: '100%',
  color: '#0a2540',
  bgColor: 'transparent',
  rows: [
    {
      id: 'hero-section',
      type: 'row',
      attributes: {
        align: 'center',
        maxWidth: '650px',
        paddingTop: '24px',
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        attributes: {
          maxWidth: '100%',
          background: 'transparent left bottom/cover no-repeat',
          backgroundColor: 'transparent',
          backgroundImage: `url(${getPhotoUrl('bg-gradient.png', 'stripe')})`,
          backgroundPosition: 'left bottom',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        },
      },
      columns: [
        {
          id: 'hero-content-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'stripe-logo',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('stripe-logo-blue.png', 'stripe'),
                alt: 'Stripe Logo',
                width: '60px',
                paddingBottom: '16px',
              },
            },
            {
              id: 'hero-heading',
              type: 'heading',
              content: 'The Update',
              attributes: {
                as: 'h1',
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#0a2540',
                paddingBottom: '16px',
              },
            },
            {
              id: 'hero-subheading',
              type: 'text',
              content: 'November 2024',
              attributes: {
                fontSize: '18px',
                color: '#2e3a55',
                paddingTop: '0',
                paddingBottom: '28px',
                paddingLeft: '0',
                paddingRight: '0',
                lineHeight: '1.5',
              },
            },
            {
              id: 'hero-image',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('man-speaking.png', 'stripe'),
                alt: 'Speaker presenting at Stripe Tour New York',
                width: '100%',
                borderRadius: '16px',
                paddingBottom: '32px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'product-news-header',
      type: 'row',
      attributes: {
        paddingTop: '36px',
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'product-news-header-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'hero-description-heading',
              type: 'heading',
              content: 'Product news from Stripe Tour New York',
              attributes: {
                as: 'h2',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#0a2540',
                paddingBottom: '12px',
              },
            },
            {
              id: 'hero-description',
              type: 'text',
              content:
                'We announced 45+ new product updates, including new payment methods and partnerships to help you increase your revenue globally and new embedded components for Issuing and Treasury.',
              attributes: {
                fontSize: '20px',
                color: '#425466',
                paddingTop: '0',
                paddingBottom: '20px',
                paddingLeft: '0',
                paddingRight: '0',
                lineHeight: '1.5',
              },
            },
            {
              id: 'hero-cta',
              type: 'button',
              content: 'Read the blog',
              attributes: {
                href: '#',
                backgroundColor: '#635BFF',
                color: '#FFFFFF',
                borderRadius: '24px',
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '14px',
                fontWeight: 'bold',
              },
            },
            {
              id: 'product-news-divider',
              type: 'divider',
              attributes: {
                paddingTop: '48px',
                paddingBottom: '48px',
              },
            },
            {
              id: 'product-news-heading',
              type: 'heading',
              content: 'Product news',
              attributes: {
                as: 'h2',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#0a2540',
                paddingBottom: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'instant-bank-payments-row',
      type: 'row',
      attributes: {
        paddingBottom: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'payment-choices-image-col',
          type: 'column',
          gridColumns: 6,
          mobileGridColumns: 12,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'payment-choices-image',
              type: 'image',
              content: '',
              attributes: {
                paddingBottom: '24px',
                src: getPhotoUrl('payment-choices.png', 'stripe'),
                alt: 'Instant Bank Payments interface example',
                width: '1.5',
                borderRadius: '16px',
              },
            },
          ],
        },
        {
          id: 'payment-choices-content-col',
          type: 'column',
          gridColumns: 6,
          mobileGridColumns: 12,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'payment-choices-heading',
              type: 'heading',
              content: 'Offer your customers more payment choices with Instant Bank Payments',
              attributes: {
                as: 'h3',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1A1F36',
                paddingBottom: '16px',
                paddingLeft: '24px',
              },
            },
            {
              id: 'payment-choices-text',
              type: 'text',
              content:
                'Instant Bank Payments, now available with Link, confirm instantly, settle in two business days, protect you from common ACH failures, and convert in a click.',
              attributes: {
                fontSize: '16px',
                color: '#425466',
                lineHeight: '1.5',
                paddingBottom: '16px',
                paddingLeft: '24px',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'payment-choices-link',
              type: 'button',
              content: 'Learn more',
              attributes: {
                href: '#',
                backgroundColor: 'transparent',
                color: '#635BFF',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingRight: '0',
                paddingLeft: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'embedded-components-row',
      type: 'row',
      attributes: {
        paddingBottom: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'cubes-image-col',
          type: 'column',
          gridColumns: 6,
          mobileGridColumns: 12,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'cubes-image',
              type: 'image',
              content: '',
              attributes: {
                paddingBottom: '24px',
                src: getPhotoUrl('cubes.png', 'stripe'),
                alt: 'Isometric cube illustration',
                width: '100%',
                borderRadius: '16px',
              },
            },
          ],
        },
        {
          id: 'embedded-content-col',
          type: 'column',
          gridColumns: 6,
          mobileGridColumns: 12,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'embedded-heading',
              type: 'heading',
              content: 'Launch new revenue lines in weeks',
              attributes: {
                as: 'h3',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1A1F36',
                paddingBottom: '16px',
                paddingLeft: '24px',
              },
            },
            {
              id: 'embedded-text',
              type: 'text',
              content:
                'Embed white-label payments and financial service workflows into your platform with new components for Stripe Issuing, Stripe Treasury, and reporting.',
              attributes: {
                fontSize: '16px',
                color: '#425466',
                lineHeight: '1.5',
                paddingBottom: '16px',
                paddingLeft: '24px',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'embedded-link',
              type: 'button',
              content: 'See all embedded components',
              attributes: {
                href: '#',
                backgroundColor: 'transparent',
                color: '#635BFF',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '24px',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'payment-methods-row',
      type: 'row',
      attributes: {
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'payments-image-col',
          type: 'column',
          gridColumns: 6,
          mobileGridColumns: 12,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'payments-image',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('payments.png', 'stripe'),
                alt: 'Stripe Payments logo',
                width: '100%',
                borderRadius: '16px',
                paddingBottom: '24px',
              },
            },
          ],
        },
        {
          id: 'payments-content-col',
          type: 'column',
          gridColumns: 6,
          mobileGridColumns: 12,
          attributes: {
            valign: 'top',
          },
          blocks: [
            {
              id: 'payments-heading',
              type: 'heading',
              content: 'New payment methods to reach more buyers globally',
              attributes: {
                as: 'h3',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1A1F36',
                paddingBottom: '16px',
                paddingLeft: '24px',
              },
            },
            {
              id: 'payments-text',
              type: 'text',
              content:
                "We've added more payment methods to the list of 100+ you can access with Stripe, including Billie, Capchase Pay, Kriya, Mondu, Satispay, seQura, and Sunbit. Your merchants can now enable new payment methods with no code in the Dashboard.",
              attributes: {
                fontSize: '16px',
                color: '#425466',
                lineHeight: '1.5',
                paddingBottom: '16px',
                paddingLeft: '24px',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'payments-link',
              type: 'button',
              content: 'See all payment methods',
              attributes: {
                href: '#',
                backgroundColor: 'transparent',
                color: '#635BFF',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '24px',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dont-miss-header',
      type: 'row',
      attributes: {
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'dont-miss-header-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'dont-miss-divider',
              type: 'divider',
              attributes: {
                paddingTop: '48px',
                paddingBottom: '48px',
              },
            },
            {
              id: 'dont-miss-heading',
              type: 'heading',
              content: "Don't miss",
              attributes: {
                as: 'h2',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#0a2540',
                paddingBottom: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lessons-section',
      type: 'row',
      attributes: {
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'lessons-content-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'lessons-heading',
              type: 'heading',
              content: 'Launching and scaling: Lessons from 13,000 platforms',
              attributes: {
                as: 'h3',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1A1F36',
                paddingBottom: '16px',
              },
            },
            {
              id: 'lessons-text',
              type: 'text',
              content:
                'In this 30-minute online event, FreshBooks and Stripe experts share best practices for designing, building, and growing a payments business.',
              attributes: {
                fontSize: '16px',
                color: '#425466',
                lineHeight: '1.5',
                paddingBottom: '16px',
                paddingLeft: '0',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'lessons-link',
              type: 'button',
              content: 'Watch now',
              attributes: {
                href: '#',
                backgroundColor: 'transparent',
                color: '#635BFF',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cedar-section',
      type: 'row',
      attributes: {
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'cedar-content-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'cedar-heading',
              type: 'heading',
              content:
                'Cedar creates a powerful financial experience for healthcare patients and providers using Stripe',
              attributes: {
                as: 'h3',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1A1F36',
                paddingBottom: '16px',
              },
            },
            {
              id: 'cedar-text',
              type: 'text',
              content:
                'Cedar selected Stripe to power its Cedar Pay offering and has since achieved a 1.61% payment acceptance uplift and seen growth in the number of patients choosing noncard payment options.',
              attributes: {
                fontSize: '16px',
                color: '#425466',
                lineHeight: '100%',
                paddingBottom: '16px',
                paddingLeft: '0',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'cedar-link',
              type: 'button',
              content: 'Read the story',
              attributes: {
                href: '#',
                backgroundColor: 'transparent',
                color: '#635BFF',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'recommended-reading-header',
      type: 'row',
      attributes: {
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'recommended-reading-header-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'recommended-reading-divider',
              type: 'divider',
              attributes: {
                paddingTop: '48px',
                paddingBottom: '48px',
              },
            },
            {
              id: 'recommended-reading-heading',
              type: 'heading',
              content: 'Recommended reading',
              attributes: {
                as: 'h2',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#0a2540',
                paddingBottom: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'saas-platforms-section',
      type: 'row',
      attributes: {
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'saas-platforms-content-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'saas-platforms-heading',
              type: 'heading',
              content: 'Spotlight on growth: SaaS platforms in 2024',
              attributes: {
                as: 'h3',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1A1F36',
                paddingBottom: '16px',
              },
            },
            {
              id: 'saas-platforms-text',
              type: 'text',
              content:
                'Learn how 12 leading SaaS platforms successfully launched and scaled embedded payments and financial services in 2024.',
              attributes: {
                fontSize: '16px',
                color: '#425466',
                lineHeight: '1.5',
                paddingBottom: '16px',
                paddingLeft: '0',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'saas-platforms-link',
              type: 'button',
              content: 'Read the guide',
              attributes: {
                href: '#',
                backgroundColor: 'transparent',
                color: '#635BFF',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'payments-trends-section',
      type: 'row',
      attributes: {
        paddingBottom: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
        align: 'center',
        maxWidth: '650px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '650px',
        },
      },
      columns: [
        {
          id: 'payments-trends-content-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'payments-trends-heading',
              type: 'heading',
              content: 'Four payments trends shaping global commerce',
              attributes: {
                as: 'h3',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1A1F36',
                paddingBottom: '16px',
              },
            },
            {
              id: 'payments-trends-text',
              type: 'text',
              content:
                'The evolution of global commerce is driving significant changes in payments—including new payment method preferences, new strategies to respond to rising costs, and more tailored fraud prevention.',
              attributes: {
                fontSize: '16px',
                color: '#425466',
                lineHeight: '1.5',
                paddingBottom: '16px',
                paddingLeft: '0',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'payments-trends-link',
              type: 'button',
              content: 'Read the report',
              attributes: {
                href: '#',
                backgroundColor: 'transparent',
                color: '#635BFF',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cta-banner',
      type: 'row',
      attributes: {
        align: 'center',
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
        maxWidth: '650px',
      },
      container: {
        attributes: {
          maxWidth: '100%',
          backgroundColor: 'transparent',
          background: `transparent center center/cover no-repeat`,
          backgroundImage: `url(${getPhotoUrl('divider-gradient.png', 'stripe')})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          height: '90px',
          backgroundRepeat: 'no-repeat',
        },
      },
      columns: [
        {
          id: 'cta-text-col',
          type: 'column',
          gridColumns: 6,
          attributes: {
            valign: 'middle',
          },
          blocks: [
            {
              id: 'cta-heading',
              type: 'heading',
              content: 'Want to learn more?',
              attributes: {
                as: 'h2',
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#FFFFFF',
              },
            },
          ],
        },
        {
          id: 'cta-button-col',
          type: 'column',
          gridColumns: 6,
          attributes: {
            valign: 'middle',
            align: 'right',
          },
          blocks: [
            {
              id: 'cta-button',
              type: 'button',
              content: 'Get in touch',
              attributes: {
                href: '#',
                backgroundColor: '#FFFFFF',
                color: '#1A1F36',
                borderRadius: '24px',
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '14px',
                fontWeight: 'bold',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'footer',
      type: 'row',
      attributes: {
        align: 'center',
        maxWidth: '650px',
        paddingTop: '48px',
        paddingBottom: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        attributes: {
          maxWidth: '100%',
          backgroundColor: '#F6F9FC',
        },
      },
      columns: [
        {
          id: 'footer-logo-col',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'footer-logo',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('stripe-logo.png', 'stripe'),
                alt: 'Stripe',
                width: '80px',
              },
            },
          ],
        },
        {
          id: 'footer-socials-col',
          type: 'column',
          gridColumns: 6,
          attributes: {
            align: 'right',
          },
          blocks: [
            {
              id: 'footer-socials',
              type: 'socials',
              attributes: {
                folder: 'socials-dark-gray',
                socialLinks: [
                  {
                    icon: 'x',
                    url: 'https://twitter.com/stripe',
                    title: 'X',
                    alt: 'X',
                  },
                  {
                    icon: 'linkedin',
                    url: 'https://linkedin.com/company/stripe',
                    title: 'LinkedIn',
                    alt: 'LinkedIn',
                  },
                  {
                    icon: 'youtube',
                    url: 'https://youtube.com/stripe',
                    title: 'YouTube',
                    alt: 'YouTube',
                  },
                  {
                    icon: 'instagram',
                    url: 'https://instagram.com/stripe',
                    title: 'Instagram',
                    alt: 'Instagram',
                  },
                  {
                    icon: 'discord',
                    url: 'https://discord.gg/stripe',
                    title: 'Discord',
                    alt: 'Discord',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'footer-text',
      type: 'row',
      attributes: {
        align: 'center',
        maxWidth: '650px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '48px',
      },
      container: {
        attributes: {
          maxWidth: '100%',
          backgroundColor: '#F6F9FC',
        },
      },
      columns: [
        {
          id: 'footer-text-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'footer-preferences',
              type: 'text',
              content:
                "This email was sent to <a href='mailto:test@gmail.com' style='color: #635BFF; text-decoration: underline;'>test@gmail.com</a>. If you'd rather not receive this kind of email, you can ",
              attributes: {
                fontSize: '12px',
                color: '#425466',
                lineHeight: '1.5',
                paddingTop: '0',
                paddingBottom: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
            {
              id: 'footer-links',
              type: 'text',
              content:
                '<a href="#" style="color: #635BFF; text-decoration: underline;">unsubscribe</a> or <a href="#" style="color: #635BFF; text-decoration: underline;">manage your email preferences</a>.',
              attributes: {
                fontSize: '12px',
                color: '#425466',
                lineHeight: '1.5',
                paddingTop: '0',
                paddingBottom: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
            {
              id: 'footer-address',
              type: 'text',
              content: 'Stripe, 354 Oyster Point Boulevard, South San Francisco, CA 94080',
              attributes: {
                fontSize: '12px',
                color: '#425466',
                lineHeight: '1.5',
                paddingTop: '16px',
                paddingBottom: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
          ],
        },
      ],
    },
  ],
}
