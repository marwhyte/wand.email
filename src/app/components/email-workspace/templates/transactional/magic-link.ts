const magicLinkTemplate = `
<EMAIL preview="Sign up or log in to our app!" styleVariant="default" type="transactional">
  <ROW type="header">
    <COLUMN>
      <TEXT fontSize="27" textAlign="center">
        <strong>wand</strong><span style="color: #52a1ff"><strong>.</strong></span><strong>email</strong>
      </TEXT>
    </COLUMN>
  </ROW>

  <ROW type="content">
    <COLUMN>
      <HEADING level="h1">
        Your sign-in link
      </HEADING>
      <BUTTON align="left" borderRadius="5" href="https://google.com">
        Click to sign-in to wand.email
      </BUTTON>
      <TEXT color="#787878">
        This link will automatically detect if you have an existing account. If not, it will guide you through the sign-up process.
      </TEXT>
      <TEXT color="#787878">
        If you have any questions, feel free to contact our support team.
      </TEXT>
      <LINK align="left" fontSize="14" href="mailto:support@wand.email">
        Contact Support
      </LINK>
    </COLUMN>
  </ROW>

  <ROW type="footer">
    <COLUMN>
      <TEXT>
        You've received this email because you signed up for wand.email
      </TEXT>
      <TEXT>
        209 Bluefield Rd, Chapel Hill, NC 27517
      </TEXT>
    </COLUMN>
  </ROW>
</EMAIL>
`
