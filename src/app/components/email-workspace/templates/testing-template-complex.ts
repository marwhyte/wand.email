export const testingTemplateComplex = `
<EMAIL preview="Testing Template Complex" backgroundColor=#f7f7f7 rowBackgroundColor=#f7f7f7 linkColor=#000000 fontFamily="Arial, sans-serif" width=600 color=#000000>
  ROW type=header {
    COLUMN width=30% {
      IMAGE src="logo" alt="logo with text"
    }
    COLUMN width=70% {
      IMAGE src="logo" alt="logo with text"
    }
  }
  ROW align=center  {
    COLUMN {
      TEXT text=<p>Hello</p>
    }
  }

  ROW type=footer {
    COLUMN {
      IMAGE src="logo" alt="logo with text"
      TEXT text=<p>Contact</p> 
    }
    
  }
</EMAIL>
`
