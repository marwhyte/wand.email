import { createEmail } from '@/lib/utils/email-helpers'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Email } from '../../types'

export const turbotaxTemplateScript = `
<EMAIL backgroundColor="#dfdfd8" color="#333333" fontFamily="Lato, Arial, sans-serif" linkColor="#205ea3" rowBackgroundColor="#fcfcfc" width="600">
  <ROW backgroundColor="#fcfcfc" padding="40,16,16,16">
    <COLUMN>
      <IMAGE alt="Intuit TurboTax Logo" src="${getPhotoUrl('intuit-turbotax.png', 'turbotax')}" width="160px" />
    </COLUMN>
  </ROW>
  <ROW>
    <HEADING>This heading appears before columns, spanning full width</HEADING>
    <TEXT>This text appears before columns, spanning full width too</TEXT>
    <COLUMN>
      <ICON icon="bolt" title="Feature Title" description="Feature description goes here" position="top" />
    </COLUMN>
    <COLUMN>
      <ICON icon="bolt" title="Feature Title" description="Feature description goes here" position="top" />
    </COLUMN>
    <COLUMN>
      <ICON icon="house" />
    </COLUMN>
  </ROW>
  <ROW backgroundColor="#fcfcfc" hideOnMobile="true" padding="0,16,30,16">
    <COLUMN>
      <LINK color="#393a3d" fontSize="14" fontWeight="bold" href="#" align="center">
        Blog
      </LINK>
    </COLUMN>
    <COLUMN>
      <LINK color="#393a3d" fontSize="14" fontWeight="bold" href="#" align="center">Tax Calculators</LINK>
    </COLUMN>
    <COLUMN>
      <LINK color="#393a3d" fontSize="14" fontWeight="bold" href="#" align="center">
        Podcast
      </LINK>
    </COLUMN>
    <COLUMN>
      <LIST type="icon">
        <LI>
            Sign in
        </LI>
      </LIST>
      <LIST type="ul">
        <LI>Test</LI>
        <LI>Another Test, hi</LI>
      </LIST>
      <LIST type="icon" icons="['rocket', 'water_drop', 'bolt']">
        <LI>Test</LI>
        <LI>Another Test, hi</LI>
        <LI>Another Test, hi</LI>
      </LIST>
      <LINK color="#393a3d" fontSize="14" fontWeight="bold" href="#" align="center">
        Sign in
      </LINK>
      <TABLE>
        <TR>
          <TD><strong>S&P 500</strong></TD>
          <TD><strong>5,615</strong></TD>
          <TD><span style="color: rgb(179, 25, 25)">-1.07%</span></TD>
        </TR>
        <TR>
          <TD>
          <strong>Nasdaq</strong>
          </TD>
          <TD><strong>17,504</strong></TD>
          <TD><span style="color: rgb(179, 25, 25)">-1.27%</span></TD>
        </TR>
      </TABLE>
      <DIVIDER borderStyle="solid" borderWidth="1" borderColor="#dddddd" padding="10,0,10,0" />
      <TABLE>
        <TR>
          <TD>
            <strong>S&P 500</strong>
          </TD>
        </TR>
      </TABLE>
      <DIVIDER />
      <SURVEY kind="yes-no" question="Are you a TurboTax user?" color="#333333" padding="10,0,10,0" />
      <SURVEY kind="rating" />
      <SOCIALS folder="socials-dark-gray" align="center">
        <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
        <SOCIAL icon="twitter" url="#" title="Twitter" alt="Twitter" />
        <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
        <SOCIAL icon="linkedin" url="#" />
      </SOCIALS>
    </COLUMN>
  </ROW>
</EMAIL>
`

export const turbotaxTemplate = (): Email => {
  const rows = parseEmailScript(turbotaxTemplateScript, '#333333', 'rounded')
  return createEmail(rows, '#333333', '#205ea3', 'Lato, Arial, sans-serif', '#dfdfd8', '#fcfcfc', '600')
}
