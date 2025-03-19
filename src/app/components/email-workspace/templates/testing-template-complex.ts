export const testingTemplateComplex = `
<EMAIL preview="Testing Template Complex" backgroundColor=#f7f7f7 rowBackgroundColor=#f7f7f7 linkColor=#0066cc fontFamily="Arial, sans-serif" width=600 color=#333333>
  ROW type=header backgroundColor=#ffffff borderColor=#dddddd borderRadius=5 borderStyle=solid borderWidth=1 columnSpacing=10 hideOnMobile=false stackOnMobile=true verticalAlign=middle padding=20 {
    COLUMN width=30% {
      IMAGE src="logo.png" alt="Company Logo" align=left padding=10 borderRadius=5 width=120
    }
    COLUMN width=70% {
      HEADING level=h2 content=<p>Welcome to Our Newsletter</p> color=#333333 fontWeight=bold fontSize=24 fontFamily="Arial, sans-serif" letterSpacing=0.5 lineHeight=1.2 textAlign=right padding=10
      SOCIALS align=right folder=socials-color padding=10 links=[{"icon":"facebook","url":"https://facebook.com","title":"Facebook","alt":"Facebook"},{"icon":"instagram","url":"https://instagram.com","title":"Instagram","alt":"Instagram"},{"icon":"linkedin","url":"https://linkedin.com","title":"LinkedIn","alt":"LinkedIn"}]
    }
  }
  
  ROW backgroundColor=#ffffff padding=30,0 borderRadius=5 {
    COLUMN {
      HEADING level=h1 content=<p>Your Monthly Update</p> color=#222222 fontWeight=bold fontSize=28 textAlign=center padding=0,0,20,0
      
      TEXT content=<p>Hello valued subscriber,</p><p>We're excited to share our latest updates with you. This newsletter includes all the information you need to stay informed about our products and services.</p> color=#444444 fontSize=16 lineHeight=1.5 textAlign=left padding=0,0,20,0
      
      DIVIDER borderStyle=solid borderWidth=1 borderColor=#eeeeee padding=10,0,20,0
      
      IMAGE src="feature-image.jpg" alt="Featured Product" align=center width=100% padding=10,0,20,0 borderRadius=8
      
      HEADING level=h3 content=<p>New Product Launch</p> color=#333333 fontWeight=bold fontSize=20 padding=10,0
      
      TEXT content=<p>We're thrilled to announce our newest product line, designed with your needs in mind. Check out all the amazing features below.</p> color=#444444 fontSize=16 lineHeight=1.5 padding=0,0,15,0
      
      BUTTON content=<p>Learn More</p> href="https://example.com/products" backgroundColor=#0066cc color=#ffffff borderRadius=5 align=center fontWeight=bold fontSize=16 padding=10 contentPadding=10,20,10,20 borderColor=#0055aa borderWidth=1 borderStyle=solid
      
      DIVIDER borderStyle=dashed borderWidth=1 borderColor=#dddddd padding=20,0
      
      HEADING level=h3 content=<p>Customer Feedback</p> color=#333333 fontWeight=bold fontSize=20 padding=10,0
      
      SURVEY kind=rating question="How would you rate your experience with our service?" color=#333333 padding=10,0,20,0 links={"rating":{"1":"https://example.com/feedback?rating=1","2":"https://example.com/feedback?rating=2","3":"https://example.com/feedback?rating=3","4":"https://example.com/feedback?rating=4","5":"https://example.com/feedback?rating=5"}}
      
      TEXT content=<p>Your feedback helps us improve our services. Thank you for taking the time to share your thoughts.</p> color=#666666 fontSize=14 fontStyle=italic padding=10,0,20,0
      
      LINK content=<p>View all survey results</p> href="https://example.com/results" color=#0066cc fontWeight=bold fontSize=16 align=center padding=10,0,20,0
    }
  }
  
  ROW type=gallery backgroundColor=#f9f9f9 padding=30 borderRadius=5 {
    COLUMN width=33% {
      IMAGE src="product1.jpg" alt="Product 1" width=100% borderRadius=8 padding=0,0,10,0
      HEADING level=h4 content=<p>Product One</p> color=#333333 fontWeight=bold fontSize=18 textAlign=center padding=5,0
      TEXT content=<p>Our bestselling item with amazing features.</p> color=#666666 fontSize=14 textAlign=center padding=0,0,10,0
      LINK content=<p>View details</p> href="https://example.com/product1" color=#0066cc fontSize=14 align=center padding=0,0,15,0
    }
    COLUMN width=33% {
      IMAGE src="product2.jpg" alt="Product 2" width=100% borderRadius=8 padding=0,0,10,0
      HEADING level=h4 content=<p>Product Two</p> color=#333333 fontWeight=bold fontSize=18 textAlign=center padding=5
      TEXT content=<p>New arrival with exclusive discount.</p> color=#666666 fontSize=14 textAlign=center padding=0,0,10,0
      LINK content=<p>View details</p> href="https://example.com/product2" color=#0066cc fontSize=14 align=center padding=0,0,15,0
    }
    COLUMN width=33% {
      IMAGE src="product3.jpg" alt="Product 3" width=100% borderRadius=8 padding=0,0,10,0
      HEADING level=h4 content=<p>Product Three</p> color=#333333 fontWeight=bold fontSize=18 textAlign=center padding=5,0,5,0
      TEXT content=<p>Limited edition with special features.</p> color=#666666 fontSize=14 textAlign=center padding=0,0,10,0
      LINK content=<p>View details</p> href="https://example.com/product3" color=#0066cc fontSize=14 align=center padding=0,0,15,0
    }
  }
  
  ROW backgroundColor=#f0f7ff padding=30 borderRadius=5 {
    COLUMN {
      HEADING level=h3 content=<p>We Value Your Opinion</p> color=#333333 fontWeight=bold fontSize=20 textAlign=center padding=0,0,15,0
      TEXT content=<p>Would you recommend our products to others?</p> color=#444444 fontSize=16 textAlign=center padding=0,0,15,0
      SURVEY kind=yes-no question="Would you recommend our products to others?" color=#333333 padding=10,0,20,0 links={"yes-no":{"yes":"https://example.com/recommend?answer=yes","no":"https://example.com/recommend?answer=no"}}
    }
  }

  ROW type=footer backgroundColor=#333333 padding=30 borderRadius=5 {
    COLUMN width=50% {
      IMAGE src="footer-logo.png" alt="Company Logo" width=120 padding=0,0,15,0
      TEXT content=<p>123 Business Street<br>City, State 12345<br>Phone: (123) 456-7890</p> color=#ffffff fontSize=14 lineHeight=1.5 padding=0,0,15,0
      SOCIALS align=left folder=socials-white padding=0,0,15,0 links=[{"icon":"facebook","url":"https://facebook.com","title":"Facebook","alt":"Facebook"},{"icon":"instagram","url":"https://instagram.com","title":"Instagram","alt":"Instagram"},{"icon":"x","url":"https://x.com","title":"X","alt":"X"}]
    }
    COLUMN width=50% {
      HEADING level=h4 content=<p>Quick Links</p> color=#ffffff fontWeight=bold fontSize=16 padding=0,0,10,0
      LINK content=<p>About Us</p> href="https://example.com/about" color=#ffffff fontSize=14 padding=0,0,5,0
      LINK content=<p>Products</p> href="https://example.com/products" color=#ffffff fontSize=14 padding=0,0,5,0
      LINK content=<p>Services</p> href="https://example.com/services" color=#ffffff fontSize=14 padding=0,0,5,0
      LINK content=<p>Contact Us</p> href="https://example.com/contact" color=#ffffff fontSize=14 padding=0,0,5,0
      TEXT content=<p>© 2023 Company Name. All rights reserved.</p> color=#cccccc fontSize=12 padding=15,0,0,0
    }
  }
</EMAIL>
`
