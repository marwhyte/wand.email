import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'

export const shippingTemplateScript = (useImage: boolean) => `
<EMAIL type="transactional" styleVariant="clear">
  <ROW type="header">
    <COLUMN>
      <IMAGE src="logo" alt="Company logo" />
    </COLUMN>
  </ROW>
  <ROW>
    <COLUMN>
      <HEADING level="h1">
        Your order will be shipped soon!
      </HEADING>
      <BUTTON href="/">
        View my order
      </BUTTON>
    </COLUMN>
  </ROW>
  <ROW>
    <COLUMN>
      <HEADING>
        WHAT'S IN YOUR ORDER?
      </HEADING>
      <TEXT>
        Order Number: #BB-1234567890
      </TEXT>
      <DIVIDER />
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
      <HEADING level="h3">
        SHIPPING DETAILS
      </HEADING>
      <TEXT>
        Marco Whyte</p><p>123 Main St.</p><p>Anytown, NC 12345</p><p>USA
      </TEXT>
    </COLUMN>
    <COLUMN>
      <HEADING level="h3">
        SHIPPING METHOD
      </HEADING>
      <TEXT>
        USPS Priority Mail
      </TEXT>
      <TEXT>
        Tracking Number: 1234567890
      </TEXT>
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
export const shippingExample = `
<example>
  <user_query>Can you help me create an email for a shipping confirmation?</user_query>


  <assistant_response>
  I'll create a shipping confirmation email.

  ${shippingTemplateScript(false)}

  The template includes a clean header with your logo, a product showcase, and a footer with social media links.
  </assistant_response>
</example>
`

export const shippingTemplate = () => {
  return createEmail(parseEmailScript(shippingTemplateScript(true)))
}
