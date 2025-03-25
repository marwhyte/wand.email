type Params = {
  identifier: string
  provider: {
    apiKey?: string
    from?: string | undefined
  }
  url: string
}

export async function sendVerificationRequest(params: Params) {
  const { identifier: to, provider, url } = params
  const { host } = new URL(url)
  console.log('this', to, provider, url)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: provider.from,
      to,
      subject: `Sign in to ${host}`,
      html: html({ url, host }),
      text: text({ url, host }),
    }),
  })

  if (!res.ok) throw new Error('Resend error: ' + JSON.stringify(await res.json()))
}

function html(params: { url: string; host: string }) {
  const { url } = params

  const brandColor = '#346df1'
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: '#fff',
  }

  return `
  <body style="background-color:#f4f4f4;color:#000000;font-family:Arial, sans-serif;style-variant:default;type:transactional;id:a10f4982-2bc1-4780-936b-e17ec63bbdf9;rows:[object Object],[object Object],[object Object];preview:Sign up or log in to our app!;margin:0;-webkit-text-size-adjust:none;-moz-text-size-adjust:none">
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Sign up or log in to our app!
    
    <div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    </div>
  </div>
  <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:100%;color:#000000;font-family:Arial, sans-serif;width:100%;margin:0;mso-table-lspace:0pts;mso-table-rspace:0pts;padding-top:20px;background-color:#f4f4f4;-webkit-text-size-adjust:none;-moz-text-size-adjust:none">
    <tbody>
      <tr style="width:100%">
        <td>
          <div style="border-radius:8px 8px 0 0;overflow:hidden">
            <table align="center" width="500px" class="row-content stack" bgcolor="#FFFFFF" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding-top:20px;padding-right:16px;padding-bottom:20px;padding-left:16px;background-color:#FFFFFF;width:500px;max-width:500px;mso-table-lspace:0pts;mso-table-rspace:0pts">
              <tbody style="width:100%">
                <tr style="width:100%">
                  <td class="column" data-id="__react-email-column" style="width:100%">
                    <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                      <tr>
                        <td style="width:100%;padding-top:10px;padding-right:0;padding-bottom:10px;padding-left:0">
                          <p style="font-size:27px;line-height:120%;margin:0;text-align:center;overflow-wrap:break-word;word-break:break-word;letter-spacing:normal">
                            <strong>wand
                            </strong>
                            <span style="color:#52a1ff">
                              <strong>.
                              </strong>
                            </span>
                            <strong>email
                            </strong>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="border-radius:0 0 8px 8px;overflow:hidden">
            <table align="center" width="500px" class="row-content stack" bgcolor="#FFFFFF" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding-right:40px;padding-bottom:20px;padding-left:40px;background-color:#FFFFFF;width:500px;max-width:500px;mso-table-lspace:0pts;mso-table-rspace:0pts">
              <tbody style="width:100%">
                <tr style="width:100%">
                  <td class="column" data-id="__react-email-column" style="width:100%">
                    <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                      <tr>
                        <td style="width:100%;padding-top:12px;padding-right:0;padding-bottom:12px;padding-left:0">
                          <h1 style="font-size:28px;text-align:left;font-weight:bold;line-height:100%;letter-spacing:normal;margin-block-start:0;margin-block-end:0">Your sign-in link
                          </h1>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                      <tr>
                        <td style="width:100%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:0">
                          <div align="left">
                            <a href="${url}" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;font-weight:bold;color:#ffffff;font-size:14px;border-radius:5px;cursor:pointer;align:center;content-padding-left:24px;content-padding-right:24px;border-left:0px solid transparent;border-right:0px solid transparent;border-top:0px solid transparent;border-bottom:0px solid transparent;background-color:#52a1ff;padding-top:10px;padding-right:24px;padding-bottom:10px;padding-left:24px;padding:10px 24px 10px 24px" target="_blank">
                              <span>
                                <!--[if mso]>
                                  <i style="mso-font-width:400%;mso-text-raise:15" hidden>&#8202;&#8202;&#8202;
                                  </i>
                                  <![endif]-->
                                  </span>
                                  <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">Click to sign-in to wand.email
                                  </span>
                                  <span>
                                    <!--[if mso]>
                                      <i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8203;
                                      </i>
                                      <![endif]-->
                                      </span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                              <tr>
                                <td style="width:100%;padding-top:10px;padding-right:0;padding-bottom:10px;padding-left:0">
                                  <p style="font-size:14px;line-height:120%;margin:0;color:#787878;text-align:left;overflow-wrap:break-word;word-break:break-word;letter-spacing:normal">This link will automatically detect if you have an existing account. If not, it will guide you through the sign-up process.
                                  </p>
                                </td>
                              </tr>
                            </table>
                            <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                              <tr>
                                <td style="width:100%;padding-top:10px;padding-right:0;padding-bottom:10px;padding-left:0">
                                  <p style="font-size:14px;line-height:120%;margin:0;color:#787878;text-align:left;overflow-wrap:break-word;word-break:break-word;letter-spacing:normal">If you have any questions, feel free to contact our support team.
                                  </p>
                                </td>
                              </tr>
                            </table>
                            <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                              <tr>
                                <td style="width:100%;padding-top:10px;padding-right:0;padding-bottom:10px;padding-left:0">
                                  <div align="left">
                                    <a href="mailto:support@wand.email" style="color:#3b82f6;text-decoration:none;font-size:14px;font-weight:normal;cursor:pointer;align:center" target="_blank">Contact Support
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table align="center" width="500px" class="row-content stack" bgcolor="#f4f4f4" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding-top:32px;padding-right:16px;padding-bottom:32px;padding-left:16px;background-color:#f4f4f4;width:500px;max-width:500px;mso-table-lspace:0pts;mso-table-rspace:0pts">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td class="column" data-id="__react-email-column" style="width:100%">
                            <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                              <tr>
                                <td style="width:100%;padding-top:4px;padding-right:0;padding-bottom:4px;padding-left:0">
                                  <p style="font-size:14px;line-height:120%;margin:0;text-align:center;overflow-wrap:break-word;word-break:break-word;letter-spacing:normal;color:#696969">You&#x27;ve received this email because you signed up for wand.email
                                  </p>
                                </td>
                              </tr>
                            </table>
                            <table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word">
                              <tr>
                                <td style="width:100%;padding-top:4px;padding-right:0;padding-bottom:4px;padding-left:0">
                                  <p style="font-size:14px;line-height:120%;margin:0;text-align:center;overflow-wrap:break-word;word-break:break-word;letter-spacing:normal;color:#696969">209 Bluefield Rd, Chapel Hill, NC 27517
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
  `
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
