import { getPhotoUrl } from '@/lib/utils/misc'

export const ebayTemplate: Email = {
  id: '7f8a744f-91e3-4c3b-9f6c-e837c55cf9c5',
  name: 'Back-to-School Email',
  preview: 'Ace back-to-school season with these deals!',
  fontFamily: 'Arial, sans-serif',
  width: '600px',
  color: '#000000',
  bgColor: '#FFFFFF',
  rows: [
    {
      id: '5992c372-682d-412d-a594-3dede81de487',
      type: 'row',
      attributes: {
        paddingTop: '24px',
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
          id: '74fe7107-b59f-4c42-813e-fb051da63c70',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: '71b64799-82f1-4eaf-a9aa-8eb48cd3d08b',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('ebaylogo.png', 'ebay'),
                alt: 'eBay Logo',
              },
            },
            {
              id: '0eafda8b-b22e-4d46-b4a5-3748e7bbe223',
              type: 'heading',
              content: 'Ace back-to-school season',
              attributes: {
                as: 'h1',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#000000',
                paddingTop: '24px',
              },
            },
            {
              id: 'd30e2555-147f-4677-b5a7-fb4ccf6ac682',
              type: 'text',
              content:
                "Whether you're taking first-day pics or heading off to college, we've got everything you need for the school year ahead.",
              attributes: {
                fontSize: '16px',
                color: '#000000',
                paddingTop: '8px',
                paddingBottom: '24px',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
            {
              id: 'f3b17162-862a-412f-9e32-77aa4de8428f',
              type: 'button',
              content: 'Shop now',
              attributes: {
                href: '#',
                fontWeight: 'bold',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '24px',
                paddingTop: '9px',
                paddingBottom: '9px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '14px',
              },
            },
          ],
        },
      ],
    },
    {
      id: '6c9af64b-be69-4b0d-9bd3-15638f4a4b2b',
      type: 'row',
      attributes: {
        paddingTop: '32px',
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
          id: '8a756ec9-37b9-4ecb-a674-707865237299',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'c91813ee-f5fa-47cf-8c71-fdc16bf5e36f',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('onlaptop.jpg', 'ebay'),
                alt: 'Student Sitting',
                borderRadius: '16px',
              },
            },
            {
              id: 'c91813ee-f5fa-47cf-8c71-fdc16bf5e36s',
              type: 'divider',
              attributes: {
                borderWidth: '1px',
                borderColor: '#e5e5e5',
                paddingTop: '24px',
                paddingBottom: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'tech-deals-header-row',
      type: 'row',
      attributes: {
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
          id: 'tech-deals-header-col',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'tech-deals-heading',
              type: 'heading',
              content: 'Prep for class with tech deals',
              attributes: {
                as: 'h2',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'tech-deals-grid-row',
      type: 'row',
      attributes: {
        paddingBottom: '40px',
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
          id: 'tech-deals-col-1',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 'laptop-image',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('laptop.jpg', 'ebay'),
                alt: 'Laptop',
                width: '100%',
                height: '130px',
                paddingBottom: '8px',
                paddingRight: '10px',
                borderRadius: '16px',
              },
            },
            {
              id: 'laptop-text',
              type: 'text',
              content: 'Up to 70% off laptops',
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
              },
            },
          ],
        },
        {
          id: 'tech-deals-col-2',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 'ipad-image',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('ipad.jpg', 'ebay'),
                alt: 'iPad',
                width: '100%',
                height: '130px',
                paddingBottom: '8px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '16px',
              },
            },
            {
              id: 'ipad-text',
              type: 'text',
              content: 'iPads $100 and up',
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
              },
            },
          ],
        },
        {
          id: 'tech-deals-col-3',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 'headphones-image',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('headphones.jpg', 'ebay'),
                alt: 'Headphones',
                width: '100%',
                height: '130px',
                paddingBottom: '8px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '16px',
              },
            },
            {
              id: 'headphones-text',
              type: 'text',
              content: 'Up to 70% off audio',
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0',
              },
            },
          ],
        },
        {
          id: 'tech-deals-col-4',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 'phone-image',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('phones.jpg', 'ebay'),
                alt: 'Phone',
                width: '100%',
                height: '130px',
                paddingBottom: '8px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '16px',
              },
            },
            {
              id: 'phone-text',
              type: 'text',
              content: 'Phones under $500',
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
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
    {
      id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      type: 'row',
      attributes: {
        paddingBottom: '20px',
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
          id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
              type: 'heading',
              content: 'Turn heads in the hall',
              attributes: {
                as: 'h1',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '8px',
              },
            },
            {
              id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g',
              type: 'text',
              content:
                'Keep that summer glow-up going into September and beyond. Get voted best-dressed with wardrobe upgrades.',
              attributes: {
                fontSize: '16px',
                color: '#333333',
                lineHeight: '1.5',
                paddingBottom: '24px',
                paddingLeft: '0',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
            {
              id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8g9h',
              type: 'button',
              content: 'Refresh your fits',
              attributes: {
                href: '#',
                fontWeight: 'bold',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#000000',
                borderRadius: '24px',
                paddingTop: '9px',
                paddingBottom: '9px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '14px',
              },
            },
            {
              id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8g9h0i',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('students-group.jpg', 'ebay'),
                alt: 'Students smiling together',
                width: '100%',
                paddingTop: '32px',
                borderRadius: '16px',
                paddingBottom: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'g7h8i9j0-k1l2-4m3n-4o5p-6q7r8s9t0u1v',
      type: 'row',
      attributes: {
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
          id: 'h8i9j0k1-l2m3-4n4o-5p6q-7r8s9t0u1v2w',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'i9j0k1l2-m3n4-4o5p-6q7r-8s9t0u1v2w3x',
              type: 'heading',
              content: 'Dress for success—for less',
              attributes: {
                as: 'h2',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '8px',
              },
            },
            {
              id: 'j0k1l2m3-n4o5-4p6q-7r8s-9t0u1v2w3x4y',
              type: 'text',
              content:
                "You don't have to be a math whiz to know a good deal when you see one. Save big on the perfect back-to-school pieces.",
              attributes: {
                fontSize: '16px',
                color: '#666666',
                lineHeight: '1.5',
                paddingBottom: '30px',
                paddingLeft: '0',
                paddingRight: '0',
                paddingTop: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'k1l2m3n4-o5p6-4q7r-8s9t-0u1v2w3x4y5z',
      type: 'row',
      attributes: {
        paddingBottom: '40px',
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
          id: 'l2m3n4o5-p6q7-4r8s-9t0u-1v2w3x4y5z6a',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 'm3n4o5p6-q7r8-4s9t-0u1v-2w3x4y5z6a7b',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('clothes.jpg', 'ebay'),
                alt: 'Pre-loved clothing set',
                width: '100%',
                height: '130px',
                borderRadius: '16px',
                paddingBottom: '10px',
                paddingRight: '10px',
              },
            },
            {
              id: 'n4o5p6q7-r8s9-4t0u-1v2w-3x4y5z6a7b8c',
              type: 'text',
              content: 'Save with pre-loved',
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
                paddingTop: '0',
                paddingLeft: '0',
                paddingRight: '0',
                paddingBottom: '0',
              },
            },
          ],
        },
        {
          id: 'o5p6q7r8-s9t0-4u1v-2w3x-4y5z6a7b8c9d',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 'p6q7r8s9-t0u1-4v2w-3x4y-5z6a7b8c9d0e',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('shirt.jpg', 'ebay'),
                alt: "Men's striped shirt",
                width: '100%',
                height: '130px',
                borderRadius: '16px',
                paddingBottom: '10px',
                paddingRight: '10px',
              },
            },
            {
              id: 'q7r8s9t0-u1v2-4w3x-4y5z-6a7b8c9d0e1f',
              type: 'text',
              content: "Up to 50% off men's",
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
                paddingTop: '0',
                paddingLeft: '0',
                paddingRight: '0',
                paddingBottom: '0',
              },
            },
          ],
        },
        {
          id: 'r8s9t0u1-v2w3-4x4y-5z6a-7b8c9d0e1f2g',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 's9t0u1v2-w3x4-4y5z-6a7b-8c9d0e1f2g3h',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('sweater.jpg', 'ebay'),
                alt: "Women's argyle sweater vest",
                width: '100%',
                height: '130px',
                borderRadius: '16px',
                paddingBottom: '10px',
                paddingRight: '10px',
              },
            },
            {
              id: 't0u1v2w3-x4y5-4z6a-7b8c-9d0e1f2g3h4i',
              type: 'text',
              content: "Up to 50% off women's",
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
                paddingTop: '0',
                paddingLeft: '0',
                paddingRight: '0',
                paddingBottom: '0',
              },
            },
          ],
        },
        {
          id: 'u1v2w3x4-y5z6-4a7b-8c9d-0e1f2g3h4i5j',
          type: 'column',
          gridColumns: 3,
          attributes: {},
          blocks: [
            {
              id: 'v2w3x4y5-z6a7-4b8c-9d0e-1f2g3h4i5j6k',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('shoes.jpg', 'ebay'),
                alt: 'Sneakers collection',
                width: '100%',
                height: '130px',
                borderRadius: '16px',
                paddingBottom: '10px',
                paddingRight: '10px',
              },
            },
            {
              id: 'w3x4y5z6-a7b8-4c9d-0e1f-2g3h4i5j6k7l',
              type: 'text',
              content: 'Up to 40% off sneakers',
              attributes: {
                fontSize: '14px',
                color: '#000000',
                textAlign: 'center',
                paddingTop: '0',
                paddingLeft: '0',
                paddingRight: '0',
                paddingBottom: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'x4y5z6a7-b8c9-4d0e-1f2g-3h4i5j6k7l8m',
      type: 'row',
      attributes: {
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
          id: 'y5z6a7b8-c9d0-4e1f-2g3h-4i5j6k7l8m9n',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'z6a7b8c9-d0e1-4f2g-3h4i-5j6k7l8m9n0o',
              type: 'heading',
              content: 'Nail the style assignment',
              attributes: {
                as: 'h2',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '24px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'a7b8c9d0-e1f2-4g3h-4i5j-6k7l8m9n0o1p',
      type: 'row',
      attributes: {
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
          id: 'b8c9d0e1-f2g3-4h4i-5j6k-7l8m9n0o1p2q',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'c9d0e1f2-g3h4-4i5j-6k7l-8m9n0o1p2q3r',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('smilingoutside.png', 'ebay'),
                alt: "Men's fashion look",
                width: '100%',
                borderRadius: '8px',
                paddingBottom: '15px',
                paddingRight: '10px',
              },
            },
            {
              id: 'd0e1f2g3-h4i5-4j6k-7l8m-9n0o1p2q3r4s',
              type: 'heading',
              content: "Fits that don't quit",
              attributes: {
                as: 'h3',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                paddingRight: '10px',
                paddingBottom: '8px',
              },
            },
            {
              id: 'e1f2g3h4-i5j6-4k7l-8m9n-0o1p2q3r4s5t',
              type: 'text',
              content: "Get first day-ready with men's clothing.",
              attributes: {
                fontSize: '12px',
                color: '#666666',
                lineHeight: '1.5',
                paddingBottom: '0',
                paddingLeft: '0',
                paddingRight: '10px',
                paddingTop: '0',
              },
            },
          ],
        },
        {
          id: 'f2g3h4i5-j6k7-4l8m-9n0o-1p2q3r4s5t6u',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'g3h4i5j6-k7l8-4m9n-0o1p-2q3r4s5t6u7v',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('smiling.png', 'ebay'),
                alt: "Women's fashion look",
                width: '100%',
                borderRadius: '8px',
                paddingLeft: '10px',
                paddingBottom: '15px',
              },
            },
            {
              id: 'h4i5j6k7-l8m9-4n0o-1p2q-3r4s5t6u7v8w',
              type: 'heading',
              content: 'Fresh fashion for women',
              attributes: {
                as: 'h3',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                paddingLeft: '10px',
                paddingBottom: '8px',
              },
            },
            {
              id: 'i5j6k7l8-m9n0-4o1p-2q3r-4s5t6u7v8w9x',
              type: 'text',
              content: 'Make the hallways your runway.',
              attributes: {
                fontSize: '12px',
                color: '#666666',
                lineHeight: '1.5',
                paddingBottom: '0',
                paddingLeft: '10px',
                paddingRight: '0',

                paddingTop: '0',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'j7k8l9m0-n1o2-4p3q-4r5s-6t7u8v9w0x1y',
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
          id: 'k8l9m0n1-o2p3-4q4r-5s6t-7u8v9w0x1y2z',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'l9m0n1o2-p3q4-4r5s-6t7u-8v9w0x1y2z3a',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('bed.jpg', 'ebay'),
                alt: 'Stylish dorm room setup',
                width: '100%',
                borderRadius: '16px',
                paddingRight: '15px',
              },
            },
          ],
        },
        {
          id: 'm0n1o2p3-q4r5-4s6t-7u8v-9w0x1y2z3a4b',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'n1o2p3q4-r5s6-4t7u-8v9w-0x1y2z3a4b5c',
              type: 'heading',
              content: 'Deck out your dorm',
              attributes: {
                as: 'h2',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '16px',
              },
            },
            {
              id: 'o2p3q4r5-s6t7-4u8v-9w0x-1y2z3a4b5c6d',
              type: 'text',
              content: 'Own your space with décor, home essentials, and more.',
              attributes: {
                fontSize: '16px',
                color: '#666666',
                lineHeight: '1.5',
                paddingBottom: '20px',
                paddingTop: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
            {
              id: 'p3q4r5s6-t7u8-4v9w-0x1y-2z3a4b5c6d7e',
              type: 'button',
              content: 'Start designing',
              attributes: {
                href: '#',
                fontWeight: 'bold',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#000000',
                borderRadius: '24px',
                paddingTop: '9px',
                paddingBottom: '9px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '14px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'q4r5s6t7-u8v9-4w0x-1y2z-3a4b5c6d7e8f',
      type: 'row',
      attributes: {
        paddingTop: '40px',
        paddingBottom: '40px',
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
          id: 'r5s6t7u8-v9w0-4x1y-2z3a-4b5c6d7e8f9g',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 's6t7u8v9-w0x1-4y2z-3a4b-5c6d7e8f9g0h',
              type: 'heading',
              content: 'Head to school in style',
              attributes: {
                as: 'h2',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '16px',
                paddingRight: '15px',
              },
            },
            {
              id: 't7u8v9w0-x1y2-4z3a-4b5c-6d7e8f9g0h1i',
              type: 'text',
              content: 'Outfit your ride with tech, storage, towing gear, and more.',
              attributes: {
                fontSize: '16px',
                color: '#666666',
                lineHeight: '1.5',
                paddingBottom: '20px',
                paddingTop: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
            },
            {
              id: 'u8v9w0x1-y2z3-4a4b-5c6d-7e8f9g0h1i2j',
              type: 'button',
              content: 'Get rolling',
              attributes: {
                href: '#',
                fontWeight: 'bold',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#000000',
                borderRadius: '24px',
                paddingTop: '9px',
                paddingBottom: '9px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '14px',
              },
            },
          ],
        },
        {
          id: 'v9w0x1y2-z3a4-4b5c-6d7e-8f9g0h1i2j3k',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'w0x1y2z3-a4b5-4c6d-7e8f-9g0h1i2j3k4l',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('navigation.png', 'ebay'),
                alt: 'Car navigation setup',
                width: '100%',
                borderRadius: '16px',
                paddingLeft: '15px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'x1y2z3a4-b5c6-4d7e-8f9g-0h1i2j3k4l5m',
      type: 'row',
      attributes: {
        paddingTop: '20px',
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
          id: 'y2z3a4b5-c6d7-4e8f-9g0h-1i2j3k4l5m6n',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'x1y2z3a4-b5c6-4d7e-8f9g-0h1i2j3k4l5m6f',
              type: 'divider',
              attributes: {
                paddingTop: '20px',
                paddingBottom: '20px',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#e5e5e5',
                textAlign: 'center',
              },
            },
            {
              id: 'z3a4b5c6-d7e8-4f9g-0h1i-2j3k4l5m6n7o',
              type: 'text',
              content: 'Is this email helpful?',
              attributes: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '15px',
                paddingTop: '0',
                paddingLeft: '0',
                paddingRight: '0',
                textAlign: 'center',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'a4b5c6d7-e8f9-4g0h-1i2j-3k4l5m6n7o8p',
      type: 'row',
      attributes: {
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
          id: 'feedback-left-column',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'feedback-yes',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('yes.png', 'ebay'),
                alt: 'Yes',
                height: '25px',
                display: 'inline',
                paddingRight: '10px',
                paddingLeft: '10px',
                textAlign: 'right',
              },
            },
          ],
        },
        {
          id: 'feedback-right-column',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'feedback-no',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('no.png', 'ebay'),
                alt: 'No',
                height: '25px',
                display: 'inline',
                paddingRight: '10px',
                paddingLeft: '10px',
                textAlign: 'left',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'b5c6d7e8-f9g0-4h1i-2j3k-4l5m6n7o8p9q',
      type: 'row',
      attributes: {
        backgroundColor: '#F8F8F8',
        paddingTop: '40px',
        paddingBottom: '40px',
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
          id: 'footer-logo-column',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'd7e8f9g0-h1i2-4j3k-4l5m-6n7o8p9q0r1s',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('ebaylogo.png', 'ebay'),
                alt: 'eBay Logo',
                height: '40px',
                textAlign: 'right',
              },
            },
          ],
        },
        {
          id: 'footer-socials-column',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'e8f9g0h1-i2j3-4k4l-5m6n-7o8p9q0r1s2t',
              type: 'socials',
              attributes: {
                folder: 'socials-color',
                textAlign: 'right',
                socialLinks: [
                  {
                    icon: 'facebook',
                    url: 'https://www.facebook.com/ebay',
                    title: 'Facebook',
                    alt: 'Facebook',
                  },
                  {
                    icon: 'x',
                    url: 'https://twitter.com/ebay',
                    title: 'X',
                    alt: 'X',
                  },
                  {
                    icon: 'instagram',
                    url: 'https://www.instagram.com/ebay',
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
      id: 'app-stores-row',
      type: 'row',
      attributes: {
        backgroundColor: '#F8F8F8',
        paddingBottom: '20px',
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
          id: 'app-store-column',
          type: 'column',
          gridColumns: 6,
          attributes: {
            align: 'right',
          },
          blocks: [
            {
              id: 'g0h1i2j3-k4l5-4m6n-7o8p-9q0r1s2t3u4v',
              type: 'image',
              content: '',
              attributes: {
                textAlign: 'right',
                src: getPhotoUrl('appstore.png', 'ebay'),
                alt: 'App Store',
                height: '40px',
                paddingRight: '10px',
                display: 'inline',
              },
            },
          ],
        },
        {
          id: 'google-play-column',
          type: 'column',
          gridColumns: 6,
          attributes: {},
          blocks: [
            {
              id: 'h1i2j3k4-l5m6-4n7o-8p9q-0r1s2t3u4v5w',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('googleplay.png', 'ebay'),
                alt: 'Google Play',
                height: '40px',
                display: 'inline',
                paddingLeft: '10px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'copyright-row',
      type: 'row',
      attributes: {
        backgroundColor: '#F8F8F8',
        paddingBottom: '40px',
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
          id: 'copyright-column',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'i2j3k4l5-m6n7-4o8p-9q0r-1s2t3u4v5w6x',
              type: 'text',
              content: '© 1995-2024 eBay Inc. or its affiliates',
              attributes: {
                fontSize: '12px',
                color: '#666666',
                paddingTop: '0',
                paddingBottom: '0',
                paddingLeft: '0',
                paddingRight: '0',
                textAlign: 'center',
              },
            },
          ],
        },
      ],
    },
  ],
}
