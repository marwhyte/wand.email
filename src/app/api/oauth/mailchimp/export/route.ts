import { Email } from '@/app/components/email-workspace/types'
import { auth } from '@/auth'
import { getOAuthToken } from '@/lib/database/queries/oauth-tokens'
import { Company } from '@/lib/database/types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API route to export an email to Mailchimp
 *
 * @example POST /api/oauth/mailchimp/export
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      email,
      company,
      templateFolderId,
      createCampaign = false,
      campaignFolderId,
      htmlEmail, // Get pre-rendered HTML from client
    } = body as {
      email: Email
      company: Company
      templateFolderId?: string
      createCampaign?: boolean
      campaignFolderId?: string
      htmlEmail: string
    }

    if (!email) {
      return NextResponse.json({ error: 'Email content is required' }, { status: 400 })
    }

    if (!htmlEmail) {
      return NextResponse.json({ error: 'HTML email content is required' }, { status: 400 })
    }

    // Get Mailchimp token
    const token = await getOAuthToken(session.user.id, 'mailchimp')
    if (!token) {
      return NextResponse.json({ error: 'Mailchimp account not connected' }, { status: 404 })
    }

    // Create template in Mailchimp
    const rawTemplateName = email.preview || 'Email Template'
    const templateName = rawTemplateName.length > 50 ? rawTemplateName.substring(0, 47) + '...' : rawTemplateName
    const templateFolderIdParam =
      templateFolderId && templateFolderId !== 'unfiled' ? `&folder_id=${templateFolderId}` : ''

    // Log the template request for debugging
    const templateRequestBody = {
      name: templateName,
      html: htmlEmail.substring(0, 200) + '...', // Log only the beginning of HTML to avoid excessive logging
    }
    console.log(`Creating Mailchimp template with name: ${templateName}, folder: ${templateFolderIdParam || 'unfiled'}`)

    const createTemplateResponse = await fetch(
      `https://${token.serverPrefix}.api.mailchimp.com/3.0/templates?${templateFolderIdParam}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateName,
          html: htmlEmail,
        }),
      }
    )

    if (!createTemplateResponse.ok) {
      const error = await createTemplateResponse.json()
      console.error('Mailchimp template creation error:', JSON.stringify(error, null, 2))

      // Construct a detailed error message
      let errorMsg = 'Failed to create template: '

      if (error.errors && error.errors.length > 0) {
        errorMsg += error.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
      } else if (error.detail) {
        errorMsg += error.detail
      } else {
        errorMsg += 'Unknown error'
      }

      throw new Error(errorMsg)
    }

    const templateData = await createTemplateResponse.json()
    const templateId = templateData.id

    // If createCampaign is true, create a campaign using the template
    let campaignData = null
    if (createCampaign) {
      const campaignFolderIdParam = campaignFolderId && campaignFolderId !== 'unfiled' ? campaignFolderId : null

      // Create campaign request body with proper folder_id handling
      const campaignRequestBody: any = {
        type: 'regular',
        settings: {
          title: templateName,
          subject_line: templateName,
          from_name: company?.name || 'My Company',
          reply_to: session.user.email,
        },
      }

      // Only add folder_id if it's not null and not 'unfiled'
      if (campaignFolderIdParam) {
        campaignRequestBody.settings.folder_id = campaignFolderIdParam
      }

      const createCampaignResponse = await fetch(`https://${token.serverPrefix}.api.mailchimp.com/3.0/campaigns`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignRequestBody),
      })

      if (!createCampaignResponse.ok) {
        const error = await createCampaignResponse.json()
        console.error('Failed to create campaign:', JSON.stringify(error, null, 2))

        // Log detailed error information
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((e: any) => {
            console.error(`Campaign field error - ${e.field}: ${e.message}`)
          })
        }

        // Continue even if campaign creation fails - we still have the template
      } else {
        campaignData = await createCampaignResponse.json()
        console.log('Campaign created successfully:', JSON.stringify(campaignData, null, 2))

        // Set the campaign content to use the template in a separate API call
        if (campaignData?.id) {
          const campaignContentResponse = await fetch(
            `https://${token.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignData.id}/content`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                template: { id: templateId },
              }),
            }
          )

          if (!campaignContentResponse.ok) {
            const contentError = await campaignContentResponse.json()
            console.error('Failed to set campaign content:', contentError)
          } else {
            const contentData = await campaignContentResponse.json()
            console.log('Campaign content set successfully:', JSON.stringify(contentData, null, 2))
            // Update the campaign data with content information
            campaignData.content = contentData
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      template: templateData,
      campaign: campaignData,
    })
  } catch (error) {
    console.error('Error exporting to Mailchimp:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export to Mailchimp' },
      { status: 500 }
    )
  }
}
