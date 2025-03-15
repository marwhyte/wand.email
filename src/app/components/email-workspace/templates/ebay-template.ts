import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'

export const ebayTemplateScript = `
<EMAIL name="Back-to-School Email" preview="Ace back-to-school season with these deals!" fontFamily="Arial, sans-serif" width=600 linkColor=#000000 color=#000000 bgColor=#FFFFFF>
  ROW type=header {
    COLUMN {
      IMAGE src=${getPhotoUrl('ebaylogo.png', 'ebay')} alt="eBay Logo"
    }
  }

  ROW {
    COLUMNS {
      HEADING content=<p>Ace back-to-school season</p> level=h1
      TEXT content=<p>Whether you're taking first-day pics or heading off to college, we've got everything you need for the school year ahead.</p>
      BUTTON content=<p>Shop now</p> href="/" fontWeight=bold backgroundColor=#000000 color=#FFFFFF
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${getPhotoUrl('onlaptop.jpg', 'ebay')} alt="Student Sitting"
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
      IMAGE src=${getPhotoUrl('laptop.jpg', 'ebay')} alt="Laptop"
      TEXT content=<p>Up to 70% off laptops</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('ipad.jpg', 'ebay')} alt="iPad"
      TEXT content=<p>iPads $100 and up</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('headphones.jpg', 'ebay')} alt="Headphones"
      TEXT content=<p>Up to 70% off audio</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('phones.jpg', 'ebay')} alt="Phone"
      TEXT content=<p>Phones under $500</p> fontSize=14 textAlign=center
    }
  }

  ROW {
    COLUMN {
      HEADING content=<p>Turn heads in the hall</p> level=h2
      TEXT content=<p>Keep that summer glow-up going into September and beyond. Get voted best-dressed with wardrobe upgrades.</p> color=#333333
      BUTTON content=<p>Refresh your fits</p> href="/" fontWeight=bold backgroundColor=#FFFFFF color=#000000 borderStyle=solid borderWidth=1 borderColor=#000000
    }
  }

  ROW padding=12, 0 {
    COLUMN {
      IMAGE src=${getPhotoUrl('students-group.jpg', 'ebay')} alt="Students smiling together" width=100%
      HEADING content=<p>Nail the style assignment</p> level=h3
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${getPhotoUrl('smilingoutside.png', 'ebay')} alt="Person smiling outside"
      TEXT content=<p>Up to 70% off laptops</p> fontWeight=bold color=#111820
      TEXT content=<p>Get first day-ready with men's clothing.</p>
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('smiling.png', 'ebay')} alt="Person smiling"
      TEXT content=<p>Fresh fashion for women</p> fontWeight=bold color=#111820
      TEXT content=<p>Make the hallways your runway.</p>
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${getPhotoUrl('bed.jpg', 'ebay')} alt="Bed in room"
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
      IMAGE src=${getPhotoUrl('navigation.png', 'ebay')} alt="Navigation in car"
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
      IMAGE src=${getPhotoUrl('ebaylogo.png', 'ebay')} alt="eBay Logo"
      HEADING content=<p>Connect with us</p> level=h4
      SOCIALS folder=socials-dark-gray socialLinks=[{ icon: "facebook", url: "https://www.facebook.com/ebay", title: "Facebook", alt: "Facebook" }, { icon: "x", url: "https://twitter.com/ebay", title: "X", alt: "X" }, { icon: "instagram", url: "https://www.instagram.com/ebay", title: "Instagram", alt: "Instagram" }]
      TEXT content=<p><a href="/">Update your email preferences</a>, <a href="/">unsubscribe</a> or <a href="/">learn about account protection</a>.</p>
      TEXT content=<p>If you have a question, <a href="/">contact us</a>. eBay I‌nc., 2‌025 H‌amilton A‌venue, S‌an J‌ose, C‌A 9‌5125, U‌nited S‌tates</p>
      TEXT content=<p>© 1995-2024 eBay Inc. or its affiliates</p>
    }
  }
</EMAIL>
`

export const ebayTemplate = createEmail(parseEmailScript(ebayTemplateScript), '#000000', '#000000')
