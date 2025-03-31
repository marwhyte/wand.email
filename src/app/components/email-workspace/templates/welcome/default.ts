import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'

const defaultWelcomeTemplateScript = (useImage: boolean) => `
<EMAIL styleVariant="default" type="welcome-series" preview="Welcome to Our Company">
  <ROW type="header">
    <COLUMN>
      <IMAGE src="logo" alt="Company logo" />
    </COLUMN>
  </ROW>

  <ROW type="content">
    <COLUMN>
      <HEADING level="h1">Welcome to Our Community!</HEADING>
      <TEXT>
        Thank you for joining us. We're excited to have you as part of our growing community of users who are discovering the benefits of our products and services.
      </TEXT>
      <TEXT>
        We're thrilled to have you on board and wanted to offer you a special welcome gift to get you started.
      </TEXT>
    </COLUMN>
  </ROW>
  <ROW type="discount">
    <COLUMN>
      <TEXT>
        Enjoy this exclusive offer
      </TEXT>
      <HEADING level="h3">
        <strong>Special discount for new members</strong>
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
      <BUTTON href="/">
        Get Started
      </BUTTON>
      <DIVIDER />
    </COLUMN>
  </ROW>

  <ROW>
    <COLUMN>
      <HEADING level="h2">
        Discover what we offer
      </HEADING>
      <TEXT>
        Explore our popular products and services to find what works best for you!
      </TEXT>
    </COLUMN>
  </ROW>
  <ROW type="gallery">
    <COLUMN>
      <IMAGE src="pexels:Example Product 1" alt="Gallery" />
    </COLUMN>
    <COLUMN>
      <HEADING level="h3">
        Featured Product
      </HEADING>
      <TEXT>
        Discover how our featured product can help you achieve your goals.
      </TEXT>
      <BUTTON href="/">
        Learn More
      </BUTTON>
    </COLUMN>
  </ROW>
  <ROW type="gallery">
    <COLUMN>
      <HEADING level="h3">
        Popular Service
      </HEADING>
      <TEXT>
        Our most requested service that customers love for its simplicity and effectiveness.
      </TEXT>
      <BUTTON href="/">
        Explore
      </BUTTON>
    </COLUMN>
    <COLUMN>
      <IMAGE src="pexels:Example Product 2" alt="Gallery" />
    </COLUMN>
  </ROW>
  <ROW type="footer">
    <COLUMN>
      <IMAGE src="logo" alt="Company Logo" />
      <HEADING level="h4">
        Connect with us
      </HEADING>
      <SOCIALS folder="socials-dark-gray">
        <SOCIAL icon="facebook" url="/" title="Facebook" alt="Facebook" />
        <SOCIAL icon="x" url="/" title="X" alt="X" />
        <SOCIAL icon="instagram" url="/" title="Instagram" alt="Instagram" />
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

export const defaultWelcomeSeriesExample = `
<example>
  <user_query>Can you help me create an email for a welcome series?</user_query>

  <assistant_response>
  I'll create a welcome series email with multiple steps, each introducing a new feature or benefit of your product or service.

  ${defaultWelcomeTemplateScript(false)}

  The template includes a clean header with your logo, engaging product showcases, and a professional footer with social media links.
  </assistant_response>
</example>
`

export const defaultWelcomeTemplate = createEmail(
  parseEmailScript(defaultWelcomeTemplateScript(true)),
  '#000000',
  '#000000'
)
