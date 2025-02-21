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
      HEADING text=<p>Ace back-to-school season</p> as=h1
      TEXT text=<p>Whether you're taking first-day pics or heading off to college, we've got everything you need for the school year ahead.</p>
      BUTTON text=<p>Shop now</p> href="/" fontWeight=bold backgroundColor=#000000 color=#FFFFFF
    }
  }

  ROW padding=12, 0 {
    COLUMN {
      IMAGE src=${getPhotoUrl('onlaptop.jpg', 'ebay')} alt="Student Sitting"
      DIVIDER
    }
  }

  ROW {
    COLUMN {
      HEADING text=<p>Prep for class with tech deals</p> as=h2
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${getPhotoUrl('laptop.jpg', 'ebay')} alt="Laptop"
      TEXT text=<p>Up to 70% off laptops</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('ipad.jpg', 'ebay')} alt="iPad"
      TEXT text=<p>iPads $100 and up</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('headphones.jpg', 'ebay')} alt="Headphones"
      TEXT text=<p>Up to 70% off audio</p> fontSize=14 textAlign=center
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('phones.jpg', 'ebay')} alt="Phone"
      TEXT text=<p>Phones under $500</p> fontSize=14 textAlign=center
    }
  }

  ROW {
    COLUMN {
      HEADING text=<p>Turn heads in the hall</p> as=h2
      TEXT text=<p>Keep that summer glow-up going into September and beyond. Get voted best-dressed with wardrobe upgrades.</p> color=#333333
      BUTTON text=<p>Refresh your fits</p> href="/" fontWeight=bold backgroundColor=#FFFFFF color=#000000 borderStyle=solid borderWidth=1 borderColor=#000000
    }
  }

  ROW padding=12, 0 {
    COLUMN {
      IMAGE src=${getPhotoUrl('students-group.jpg', 'ebay')} alt="Students smiling together" width=100%
      HEADING text=<p>Nail the style assignment</p> as=h3
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${getPhotoUrl('smilingoutside.png', 'ebay')} alt="Person smiling outside"
      TEXT text=<p>Up to 70% off laptops</p> fontWeight=bold color=#111820
      TEXT text=<p>Get first day-ready with men's clothing.</p>
    }
    COLUMN {
      IMAGE src=${getPhotoUrl('smiling.png', 'ebay')} alt="Person smiling"
      TEXT text=<p>Fresh fashion for women</p> fontWeight=bold color=#111820
      TEXT text=<p>Make the hallways your runway.</p>
    }
  }

  ROW type=gallery {
    COLUMN {
      IMAGE src=${getPhotoUrl('bed.jpg', 'ebay')} alt="Bed in room"
    }
    COLUMN {
      HEADING text=<p>Deck out your dorm</p> as=h2
      TEXT text=<p>Own your space with decor, home essentials, and more.</p>
      BUTTON text=<p>Start designing</p> href="/"
    }
  }

  ROW type=gallery {
    COLUMN {
      HEADING text=<p>Head to school in style</p> as=h2
      TEXT text=<p>Outfit your ride with tech, storage, towing gear, and more.</p>
      BUTTON text=<p>Get rolling</p> href="/"
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

  ROW backgroundColor=#F8F8F8 padding=40,16 {
    COLUMN width=50% align=right {
      IMAGE src=${getPhotoUrl('ebaylogo.png', 'ebay')} alt="eBay Logo" height=40 textAlign=right
    }
    COLUMN width=50% {
      SOCIALS folder="socials-color" textAlign=right socialLinks=[
        { icon: "facebook", url: "https://www.facebook.com/ebay", title: "Facebook", alt: "Facebook" },
        { icon: "x", url: "https://twitter.com/ebay", title: "X", alt: "X" },
        { icon: "instagram", url: "https://www.instagram.com/ebay", title: "Instagram", alt: "Instagram" }
      ]
    }
  }

  ROW backgroundColor=#F8F8F8 padding=0,16,20,16 {
    COLUMN width=50% align=right {
      IMAGE src=${getPhotoUrl('appstore.png', 'ebay')} alt="App Store" height=40 paddingRight=10 display=inline textAlign=right
    }
    COLUMN width=50% {
      IMAGE src=${getPhotoUrl('googleplay.png', 'ebay')} alt="Google Play" height=40 paddingLeft=10 display=inline
    }
  }

  ROW backgroundColor=#F8F8F8 padding=0,16,40,16 {
    COLUMN align=center {
      TEXT text=<p>© 1995-2024 eBay Inc. or its affiliates</p> fontSize=12 color=#666666 textAlign=center
    }
  }
</EMAIL>
`

export const ebayTemplate = createEmail('Back-to-School Email', parseEmailScript(ebayTemplateScript), '#000000', '#000000')
