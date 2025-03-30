import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'

export const defaultEbayTemplateScript = (useImage: boolean) => `
<EMAIL type="ecommerce" preview="Ace back-to-school season with these deals!">
  <ROW type="header">
    <COLUMN>
      <IMAGE src="logo" alt="Company Logo" />
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <HEADING level="h1">
        Ace back-to-school season
      </HEADING>
      <TEXT>
        Whether you're taking first-day pics or heading off to college, we've got everything you need for the school year ahead.
      </TEXT>
      <BUTTON href="/">
        Shop now
      </BUTTON>
    </COLUMN>
  </ROW>

  <ROW type="gallery">
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('onlaptop.jpg', 'ebay') : 'pexels:Student Sitting'}" alt="Student Sitting" />
      <DIVIDER />
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <HEADING level="h2">
        Prep for class with tech deals
      </HEADING>
    </COLUMN>
  </ROW>

  <ROW type="gallery">
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('laptop.jpg', 'ebay') : 'pexels:Laptop'}" alt="Laptop" />
      <TEXT fontSize="14" textAlign="center">
        Up to 70% off laptops
      </TEXT>
    </COLUMN>
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('ipad.jpg', 'ebay') : 'pexels:iPad'}" alt="iPad" />
      <TEXT fontSize="14" textAlign="center">
        iPads $100 and up
      </TEXT>
    </COLUMN>
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('headphones.jpg', 'ebay') : 'pexels:Headphones'}" alt="Headphones" />
      <TEXT fontSize="14" textAlign="center">
        Up to 70% off audio
      </TEXT>
    </COLUMN>
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('phones.jpg', 'ebay') : 'pexels:Phone'}" alt="Phone" />
      <TEXT fontSize="14" textAlign="center">
        Phones under $500
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <HEADING level="h2">
        Turn heads in the hall
      </HEADING>
      <TEXT color="#333333">
        Keep that summer glow-up going into September and beyond. Get voted best-dressed with wardrobe upgrades.
      </TEXT>
      <BUTTON href="/">
        Refresh your fits
      </BUTTON>
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('students-group.jpg', 'ebay') : 'pexels:Students smiling together'}" alt="Students smiling together" width="100%" />
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <HEADING level="h3">
        Nail the style assignment
      </HEADING>
      <TEXT>
        You don't have to be a math whiz to know a good deal when you see one. Save big on the perfect back-to-school pieces.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW type="gallery">
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('smilingoutside.png', 'ebay') : 'pexels:Person smiling outside'}" alt="Person smiling outside" />
      <TEXT fontWeight="bold">
        Up to 70% off laptops
      </TEXT>
      <TEXT>
        Get first day-ready with men's clothing.
      </TEXT>
    </COLUMN>
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('smiling.png', 'ebay') : 'pexels:Person smiling'}" alt="Person smiling" />
      <TEXT fontWeight="bold">
        Fresh fashion for women
      </TEXT>
      <TEXT>
        Make the hallways your runway.
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW type="gallery">
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('bed.jpg', 'ebay') : 'pexels:Bed in room'}" alt="Bed in room" />
    </COLUMN>
    <COLUMN>
      <HEADING level="h2">
        Deck out your dorm
      </HEADING>
      <TEXT>
        Own your space with decor, home essentials, and more.
      </TEXT>
      <BUTTON href="/">
        Start designing
      </BUTTON>
    </COLUMN>
  </ROW>

  <ROW type="gallery">
    <COLUMN>
      <HEADING level="h2">
        Head to school in style
      </HEADING>
      <TEXT>
        Outfit your ride with tech, storage, towing gear, and more.
      </TEXT>
      <BUTTON href="/">
        Get rolling
      </BUTTON>
    </COLUMN>
    <COLUMN>
      <IMAGE src="${useImage ? getPhotoUrl('navigation.png', 'ebay') : 'pexels:Navigation in car'}" alt="Navigation in car" />
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <DIVIDER />
      <SURVEY kind="yes-no" question="Is this email helpful?" />
    </COLUMN>
  </ROW>

  <ROW type="footer">
    <COLUMN>
      <IMAGE src="logo" alt="Company Logo" />
      <HEADING level="h4">
        Connect with us
      </HEADING>
      <SOCIALS folder="socials-dark-gray">
        <SOCIAL icon="facebook" url="https://www.facebook.com" title="Facebook" alt="Facebook" />
        <SOCIAL icon="x" url="https://twitter.com" title="X" alt="X" />
        <SOCIAL icon="instagram" url="https://www.instagram.com" title="Instagram" alt="Instagram" />
      </SOCIALS>
      <TEXT>
        <a href="/">Update your email preferences</a>, <a href="/">unsubscribe</a> or <a href="/">learn about account protection</a>.
      </TEXT>
      <TEXT>
        If you have a question, <a href="/">contact us</a>. 123 Main St, San Jose, CA 95125, United States
      </TEXT>
      <TEXT>
        © 2025 Company Name
      </TEXT>
    </COLUMN>
  </ROW>
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

export const defaultEbayTemplate = createEmail(parseEmailScript(defaultEbayTemplateScript(true)), '#000000', '#000000')
