import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'

export const defaultEbayTemplateScript = (useImage: boolean) => `
<EMAIL type=ecommerce name="Back-to-School Email" preview="Ace back-to-school season with these deals!">
  ROW type=header {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('ebaylogo.png', 'ebay') : 'logo'} alt="eBay Logo"
    }
  }

  ROW {
    COLUMNS {
      HEADING content=<p>Ace back-to-school season</p> level=h1
      TEXT content=<p>Whether you're taking first-day pics or heading off to college, we've got everything you need for the school year ahead.</p>
      BUTTON content=<p>Shop now</p> href="/"
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('onlaptop.jpg', 'ebay') : '"pexels:Student Sitting"'} alt="Student Sitting"
      DIVIDER
    }
  }

  ROW {
    COLUMN {
      HEADING content=<p>Prep for class with tech deals</p> level=h2
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('laptop.jpg', 'ebay') : '"pexels:Laptop"'} alt="Laptop"
      TEXT content=<p>Up to 70% off laptops</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('ipad.jpg', 'ebay') : '"pexels:iPad"'} alt="iPad"
      TEXT content=<p>iPads $100 and up</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('headphones.jpg', 'ebay') : '"pexels:Headphones"'} alt="Headphones"
      TEXT content=<p>Up to 70% off audio</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('phones.jpg', 'ebay') : '"pexels:Phone"'} alt="Phone"
      TEXT content=<p>Phones under $500</p> fontSize=14 textAlign=center
    }
  }

  ROW {
    COLUMN {
      HEADING content=<p>Turn heads in the hall</p> level=h2
      TEXT content=<p>Keep that summer glow-up going into September and beyond. Get voted best-dressed with wardrobe upgrades.</p> color=#333333
      BUTTON content=<p>Refresh your fits</p> href="/"
    }
  }

  ROW {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('students-group.jpg', 'ebay') : '"pexels:Students smiling together"'} alt="Students smiling together" width=100%
    }
  }

  ROW {
    COLUMN {
      HEADING content=<p>Nail the style assignment</p> level=h3
      TEXT content=<p>You don't have to be a math whiz to know a good deal when you see one. Save big on the perfect back-to-school pieces.</p>
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('smilingoutside.png', 'ebay') : '"pexels:Person smiling outside"'} alt="Person smiling outside"
      TEXT content=<p>Up to 70% off laptops</p>
      TEXT content=<p>Get first day-ready with men's clothing.</p>
    }
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('smiling.png', 'ebay') : '"pexels:Person smiling"'} alt="Person smiling"
      TEXT content=<p>Fresh fashion for women</p>
      TEXT content=<p>Make the hallways your runway.</p>
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('bed.jpg', 'ebay') : '"pexels:Bed in room"'} alt="Bed in room"
    }
    COLUMN {
      HEADING content=<p>Deck out your dorm</p> level=h2
      TEXT content=<p>Own your space with decor, home essentials, and more.</p>
      BUTTON content=<p>Start designing</p> href="/"
    }
  }

  ROW type=gallery {
    COLUMN {
      HEADING content=<p>Head to school in style</p> level=h2
      TEXT content=<p>Outfit your ride with tech, storage, towing gear, and more.</p>
      BUTTON content=<p>Get rolling</p> href="/"
    }
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('navigation.png', 'ebay') : '"pexels:Navigation in car"'} alt="Navigation in car"
    }
  }

  ROW {
    COLUMN {
      DIVIDER
      SURVEY kind=yes-no question="Is this email helpful?"
    }
  }

  ROW type=footer  {
    COLUMN {
      IMAGE src=${useImage ? getPhotoUrl('ebaylogo.png', 'ebay') : 'logo'} alt="eBay Logo"
      HEADING content=<p>Connect with us</p> level=h4
      SOCIALS folder=socials-dark-gray links=[{ "icon": "facebook", "url": "https://www.facebook.com/ebay", "title": "Facebook", "alt": "Facebook" }, { "icon": "x", "url": "https://twitter.com/ebay", "title": "X", "alt": "X" }, { "icon": "instagram", "url": "https://www.instagram.com/ebay", "title": "Instagram", "alt": "Instagram" }]
      TEXT content=<p><a href="/">Update your email preferences</a>, <a href="/">unsubscribe</a> or <a href="/">learn about account protection</a>.</p>
      TEXT content=<p>If you have a question, <a href="/">contact us</a>. eBay I‌nc., 2‌025 H‌amilton A‌venue, S‌an J‌ose, C‌A 9‌5125, U‌nited S‌tates</p>
      TEXT content=<p>© 1995-2024 eBay Inc. or its affiliates</p>
    }
  }
</EMAIL>
`

export const ebayEcommerceExample = `
<example>
  <user_query>Can you help me create an email for a back-to-school sale?</user_query>

  <assistant_response>
  I'll create a back-to-school promotional email.

  ${defaultEbayTemplateScript(false)}

  The template includes a clean header with your logo, engaging product galleries, and a professional footer with social media links.
  </assistant_response>
</example>
`

export const defaultEbayTemplate = createEmail(
  parseEmailScript(defaultEbayTemplateScript(true), { id: '123', rows: [] }),
  '#000000',
  '#000000'
)
