import { Email, EmailType } from '@/app/components/email-workspace/types'

const createHeader = (type: EmailType) => {
  return `
    <ROW type="header">
        <COLUMN>
            <IMAGE src="logo" />
        </COLUMN>
    </ROW>
    `
}

const createHero = (header: string, subheader: string, buttonText: string, buttonLink: string) => {
  return `
    <ROW type="hero">
        <COLUMN>
            <HEADING></HEADING>
            <SUBHEADING>${subheader}</SUBHEADING>
            <BUTTON href="${buttonLink}">${buttonText}</BUTTON>
        </COLUMN>
    </ROW>
    `
}

const createBody = (email: Email) => {}

const createCards = (email: Email) => {}

const createDiscount = (email: Email) => {}

const createFooter = (email: Email) => {}
