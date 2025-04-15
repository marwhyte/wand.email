import EmailRendererFinal from '@/app/components/email-workspace/email-renderer-final'
import { useEmailPreprocessor } from '@/app/hooks/useEmailPreprocessor'
import { useMailchimpFolders } from '@/app/hooks/useMailchimpFolders'
import { useOAuth } from '@/app/hooks/useOAuth'
import { render } from '@react-email/components'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../button'
import Notification from '../notification'
import { Select } from '../select'
import { Text } from '../text'
import { ExportTypeProps } from './export-type'

const MailchimpExport = ({ email, company, onExportSuccess, onExportError }: ExportTypeProps) => {
  const { data: session } = useSession()
  const { preprocessAndGetEmail } = useEmailPreprocessor()
  const [isExporting, setIsExporting] = useState(false)
  const [isExported, setIsExported] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'failure'>('success')
  const [selectedTemplateFolder, setSelectedTemplateFolder] = useState('unfiled')
  const [createCampaign, setCreateCampaign] = useState(true)
  const [selectedCampaignFolder, setSelectedCampaignFolder] = useState('unfiled')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const authCheckPerformedRef = useRef(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [designUrl, setDesignUrl] = useState<string | null>(null)

  // Use our custom hooks
  const { initiateOAuth, isOAuthLoading, isOAuthSuccess, isOAuthError, oauthError, resetOAuth } = useOAuth({
    onSuccess: (data) => {
      console.log('OAuth success callback received:', data)
      setIsAuthenticated(true)
      setNotificationMessage('Connected to Mailchimp successfully')
      setNotificationStatus('success')
      // Fetch folders with force=true to ensure we get fresh data
      fetchFolders(true)
    },
    onError: (error) => {
      console.error('OAuth error callback received:', error)
      setNotificationMessage(`Failed to connect to Mailchimp: ${error}`)
      setNotificationStatus('failure')
      if (onExportError) onExportError(`Failed to connect to Mailchimp: ${error}`)
    },
  })

  const {
    templateFolders,
    campaignFolders,
    isLoading: isFoldersLoading,
    error: foldersError,
    fetchFolders,
    hasLoadedFolders,
  } = useMailchimpFolders()

  // Check if user is already connected to Mailchimp
  useEffect(() => {
    const checkConnection = async () => {
      // Skip if we've already checked
      if (authCheckPerformedRef.current) {
        return
      }

      setIsCheckingAuth(true)
      try {
        // Prevent multiple checks
        authCheckPerformedRef.current = true

        // Use a more reliable approach to check auth status
        const tokenResponse = await fetch('/api/oauth/mailchimp/folders?type=template')

        if (tokenResponse.ok) {
          console.log('User is authenticated with Mailchimp')
          setIsAuthenticated(true)

          // Only fetch folders if we don't have them yet
          if (!hasLoadedFolders) {
            fetchFolders()
          }
        } else {
          console.log('User is not authenticated with Mailchimp')
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.log('Error checking Mailchimp auth:', error)
        setIsAuthenticated(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    if (session?.user?.id && !authCheckPerformedRef.current) {
      checkConnection()
    } else {
      setIsCheckingAuth(false)
    }
  }, [session, fetchFolders, hasLoadedFolders])

  // Handle OAuth errors
  useEffect(() => {
    if (isOAuthError && oauthError) {
      setNotificationMessage(`Authentication failed: ${oauthError}`)
      setNotificationStatus('failure')
    }
  }, [isOAuthError, oauthError])

  // This effect ensures isExported stays true once set
  // Helps prevent the view from resetting to the initial state
  useEffect(() => {
    console.log('isExported:', isExported)
    // Once exported successfully, this state should persist
  }, [isExported])

  // Clear cache and reset on unmount
  useEffect(() => {
    console.log('[MailchimpExport] Component mounted')

    return () => {
      console.log('[MailchimpExport] Component unmounting, OAuth states:', {
        isOAuthLoading,
        isOAuthSuccess,
        isOAuthError,
      })

      // Only reset OAuth state when component unmounts if we're not in the middle of authentication
      // This prevents the popup from being closed prematurely
      if (!isOAuthLoading) {
        console.log('[MailchimpExport] Safe to reset OAuth - not in the middle of authentication')
        resetOAuth()
      } else {
        console.log('[MailchimpExport] NOT resetting OAuth - authentication in progress')
        // Don't reset while authentication is in progress
      }
    }
  }, [resetOAuth, isOAuthLoading, isOAuthSuccess, isOAuthError])

  if (!email) {
    return <Text>Email is required to export to Mailchimp</Text>
  }

  // Handle connection to Mailchimp
  const handleConnect = () => {
    initiateOAuth('mailchimp')
  }

  // Handle export to Mailchimp
  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Preprocess the email to upload all icons to S3
      const emailWithIcons = await preprocessAndGetEmail(email)

      if (!emailWithIcons) {
        throw new Error('Failed to process email')
      }

      // Ensure the preview/template name is not too long for Mailchimp (max 50 chars)
      if (emailWithIcons.preview && emailWithIcons.preview.length > 50) {
        emailWithIcons.preview = emailWithIcons.preview.substring(0, 47) + '...'
      }

      // Render the email HTML on the client side
      const htmlEmail = render(
        EmailRendererFinal({
          email: emailWithIcons,
          company,
        })
      )

      // Call the export API
      const response = await fetch('/api/oauth/mailchimp/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailWithIcons,
          company,
          templateFolderId: selectedTemplateFolder,
          createCampaign,
          campaignFolderId: createCampaign ? selectedCampaignFolder : undefined,
          htmlEmail, // Send pre-rendered HTML
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.error || 'Failed to export to Mailchimp'
        console.error('Mailchimp export error details:', result)
        throw new Error(errorMessage)
      }

      // Log the result for debugging
      console.log('Mailchimp API response:', JSON.stringify(result, null, 2))

      // Set preview URLs if available in the response
      if (result.template?.id) {
        setPreviewUrl(`https://admin.mailchimp.com/templates/design?tid=${result.template.id}`)
      }

      // For campaigns, Mailchimp uses web_id for URLs, not the regular id
      if (result.campaign?.web_id) {
        setDesignUrl(`https://admin.mailchimp.com/campaigns/edit?id=${result.campaign.web_id}`)
      } else if (result.campaign?.campaign_id) {
        // Some Mailchimp API versions may use campaign_id
        setDesignUrl(`https://admin.mailchimp.com/campaigns/edit?id=${result.campaign.campaign_id}`)
      } else if (result.campaign?.id) {
        // Fallback to regular id if web_id isn't available
        setDesignUrl(`https://admin.mailchimp.com/campaigns/edit?id=${result.campaign.id}`)
      }

      setIsExported(true)
      console.log('Setting isExported to true')
      setNotificationMessage('Email exported to Mailchimp successfully')
      setNotificationStatus('success')
      if (onExportSuccess) {
        console.log('Calling onExportSuccess')
        onExportSuccess()
      }
    } catch (error) {
      console.error('Error exporting to Mailchimp:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to export to Mailchimp'
      setNotificationMessage(errorMessage)
      setNotificationStatus('failure')
      if (onExportError) onExportError(errorMessage)
    } finally {
      setIsExporting(false)
    }
  }

  // Display loading state during OAuth flow
  if (isOAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <p className="mt-4">Authenticating with Mailchimp...</p>
        <p className="mt-2 text-sm text-gray-500">
          A popup window should appear. Please complete the authentication process.
        </p>

        <div className="mt-8 text-center">
          <Text className="text-sm text-gray-500">If a popup did not open, click here:</Text>
          <Button className="mt-2" color="light" onClick={handleConnect}>
            Retry Authentication
          </Button>
        </div>
      </div>
    )
  }

  // Display loading state while checking initial auth status
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <p className="mt-4">Checking Mailchimp connection...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notificationMessage && (
        <div className="mb-2">
          <Notification
            title={notificationMessage}
            status={notificationStatus}
            onClose={() => setNotificationMessage(null)}
            skipClose={false}
          />
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {!isAuthenticated ? (
          <div className="text-center">
            <div className="mb-4">
              <img
                src="/mailchimp-icon.svg"
                alt="Mailchimp Logo"
                className="mx-auto h-16 w-16 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg'
                }}
              />
            </div>
            <Text className="mb-4">
              Connect your Mailchimp account to export this email directly to your campaigns.
            </Text>
            <Button onClick={handleConnect}>Connect to Mailchimp</Button>
          </div>
        ) : isExported ? (
          <div className="text-center">
            <div className="mb-4">
              <img
                src="/mailchimp-icon.svg"
                alt="Mailchimp Logo"
                className="mx-auto h-16 w-16 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg'
                }}
              />
            </div>
            <Text className="mb-2 text-green-600">Email successfully exported to Mailchimp!</Text>
            <Text className="mb-4">You can now view and edit this template in your Mailchimp account.</Text>
            <div className="flex flex-col items-center space-y-3">
              {designUrl ? (
                <Button
                  color="purple"
                  onClick={() => {
                    window.open(designUrl, '_blank')
                  }}
                  className="w-full max-w-xs"
                >
                  Edit Campaign
                </Button>
              ) : (
                previewUrl && (
                  <Button
                    color="light"
                    onClick={() => {
                      window.open(previewUrl, '_blank')
                    }}
                    className="w-full max-w-xs"
                  >
                    Edit Template
                  </Button>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="mb-6 flex items-center">
              <div className="flex h-12 w-12 items-center justify-center">
                <img src="/mailchimp-icon.svg" alt="Mailchimp" className="h-10 w-10" />
              </div>
              <Text className="ml-4 text-xl font-medium">Send to Mailchimp</Text>
            </div>

            <Text className="mb-6 text-gray-600">{email?.preview || 'Your email template'}</Text>

            {isFoldersLoading ? (
              <div className="my-4 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                <Text className="ml-2">Loading folders...</Text>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <Text className="mb-2 font-medium">Mailchimp template folder</Text>
                  <Select
                    value={selectedTemplateFolder}
                    onChange={(e) => setSelectedTemplateFolder(e.target.value)}
                    className="w-full"
                  >
                    <option value="unfiled">[Unfiled]</option>
                    {templateFolders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="mb-6 flex items-center">
                  <Text className="mr-4 font-medium">Create a campaign along with the template</Text>
                  <div
                    className={`relative h-6 w-12 cursor-pointer rounded-full ${
                      createCampaign ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    onClick={() => setCreateCampaign(!createCampaign)}
                  >
                    <div
                      className={`absolute top-1 h-4 w-4 transform rounded-full bg-white transition-transform ${
                        createCampaign ? 'left-7' : 'left-1'
                      }`}
                    />
                  </div>
                </div>

                {createCampaign && (
                  <div className="mb-6">
                    <Text className="mb-2 font-medium">Campaign folder</Text>
                    <Select
                      value={selectedCampaignFolder}
                      onChange={(e) => setSelectedCampaignFolder(e.target.value)}
                      className="w-full"
                    >
                      <option value="unfiled">[Unfiled]</option>
                      {campaignFolders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </>
            )}

            <div className="mt-8 flex justify-end">
              <Button color="purple" onClick={handleExport} disabled={isFoldersLoading || isExporting}>
                {isExporting ? 'Exporting...' : 'Create'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Export both the component and the metadata
export const mailchimpExportType = {
  name: 'mailchimp',
  icon: <img src="/mailchimp-icon.svg" alt="Mailchimp" className="mr-3 h-12 w-12" />,
  title: 'Mailchimp',
  description: 'Export to Mailchimp',
  component: MailchimpExport,
}

export default MailchimpExport
