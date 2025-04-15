import { auth } from '@/auth'
import { getOAuthToken } from '@/lib/database/queries/oauth-tokens'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API route to fetch folders from Mailchimp
 *
 * @example GET /api/oauth/mailchimp/folders?type=template
 */
export async function GET(request: NextRequest) {
  try {
    // Get folder type from query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'template'

    // Check if the type is valid
    if (type !== 'template' && type !== 'campaign') {
      return NextResponse.json({ error: 'Invalid folder type. Must be "template" or "campaign"' }, { status: 400 })
    }

    // Verify user is authenticated
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the OAuth token for the user
    const oauthToken = await getOAuthToken(session.user.id, 'mailchimp')
    if (!oauthToken) {
      return NextResponse.json({ error: 'User not connected to Mailchimp' }, { status: 403 })
    }

    // Determine the endpoint based on folder type
    const endpoint = type === 'template' ? 'template-folders' : 'campaign-folders'

    // Determine server prefix - using US as fallback
    const serverPrefix = oauthToken.serverPrefix || 'us1'

    // Fetch folders from Mailchimp API
    const mailchimpResponse = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/${endpoint}?count=100`, {
      headers: {
        Authorization: `Bearer ${oauthToken.accessToken}`,
        'Content-Type': 'application/json',
      },
      // Add cache headers to prevent excessive caching
      cache: 'no-store',
    })

    // Check for Mailchimp API errors
    if (!mailchimpResponse.ok) {
      const errorData = await mailchimpResponse.json()
      // Check if token is expired or invalid
      if (mailchimpResponse.status === 401) {
        // Consider implementing token refresh here
        return NextResponse.json(
          {
            error: 'Mailchimp authorization expired or invalid',
            details: errorData,
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        {
          error: `Mailchimp API error: ${errorData.title || 'Unknown error'}`,
          details: errorData,
        },
        { status: mailchimpResponse.status }
      )
    }

    // Parse the response
    const data = await mailchimpResponse.json()

    // Format the folders
    const folders = data.folders.map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      count: folder.count || 0,
    }))

    return NextResponse.json({ folders })
  } catch (error) {
    console.error('Error fetching Mailchimp folders:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch folders' },
      { status: 500 }
    )
  }
}
