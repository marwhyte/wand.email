import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'

const defaultCartTemplateScript = (useImage: boolean) => `
<EMAIL type="cart" styleVariant="clear">
  <ROW type="header">
    <COLUMN>
      <LOGO>
        <IMAGE src="logo" alt="Company Logo" />
      </LOGO>
    </COLUMN>
  </ROW>
  <ROW>
    <COLUMN>
        <HEADING><b>Items</b> are waiting for you in your cart</HEADING>
        <TEXT>
          It looks like you left some items in your cart, we just wanted to send you a gentle reminder.
        </TEXT>
        <TEXT>
          You can pick up where you left off by clicking the button below.
        </TEXT>
        <BUTTON>
            Complete your purchase
        </BUTTON>
        <DIVIDER />
    </COLUMN>
  </ROW>
      <ROW type="discount">
    <COLUMN>
      <TEXT>
        Enjoy this exclusive offer
      </TEXT>
      <HEADING level="h3">
        <strong>Complete your purchase now and save 10% off your entire order</strong>
      </HEADING>
      <TEXT>
        (This offer is exclusive to the account associated with this email address)
      </TEXT>
      <TEXT>
        WELCOME2023
      </TEXT>
    </COLUMN>
  </ROW>
  <ROW>
    <COLUMN>
      <HEADING>Here's what <b>you left behind</b></HEADING>
    </COLUMN>
  </ROW>
  <ROW type="cart">
    <COLUMN>
        <CART_ITEM
            image=${useImage ? '"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8321/Plant_21.png"' : '"pexels:Plant "'}
            name="Product Name"
            description="Product description here"
            quantity="1"
            price="$19.99"
        />
        <CART_ITEM
            image=${useImage ? '"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8321/Plant_19.png"' : '"pexels:Plant"'}
            name="Product Name"
            description="Product description here"
            quantity="1"
            price="$19.99"
        />
        <CART_ITEM
            image=${useImage ? '"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8321/Plant_23.png"' : '"pexels:Plant"'}
            name="Product Name"
            description="Product description here"
            quantity="1"
            price="$19.99"
        />
    </COLUMN>
  </ROW>
    <ROW>
    <COLUMN>
      <SPACER height="16" />
    </COLUMN>
  </ROW>
  <ROW>
    <COLUMN>
        <BUTTON>
            Complete your purchase
        </BUTTON>
        <TEXT>
          If you have any questions, please <a href="/">contact us</a>.
        </TEXT>
    </COLUMN>
  </ROW>
  <ROW>
    <COLUMN>
      <SPACER height="16" />
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
        If you have a question, <a href="/">contact us</a>. 123 Main St, Anytown, State 12345, United States
      </TEXT>
      <TEXT>
        © ${new Date().getFullYear()} Company Name
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const defaultCartSeriesExample = `
<example>
  <user_query>Can you help me create a cart abandonment email?</user_query>

  <assistant_response>
  I'll create a cart abandonment email with a discount code, a cart section, and a footer with social media links.

  ${defaultCartTemplateScript(false)}

  The template includes a clean header with your logo, engaging product showcases, and a professional footer with social media links.
  </assistant_response>
</example>
`

export const defaultCartTemplate = createEmail(parseEmailScript(defaultCartTemplateScript(true)), '#000000', '#000000')
