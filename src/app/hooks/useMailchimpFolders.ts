import { MailchimpFolder } from '@/lib/oauth/types'
import { useCallback, useEffect, useRef, useState } from 'react'

// Global cache to persist folder data between component instances
const GLOBAL_CACHE = {
  templateFolders: null as MailchimpFolder[] | null,
  campaignFolders: null as MailchimpFolder[] | null,
  lastFetchTime: 0,
}

// Cache expiry time (15 minutes)
const CACHE_TTL = 15 * 60 * 1000

interface UseMailchimpFoldersResult {
  templateFolders: MailchimpFolder[]
  campaignFolders: MailchimpFolder[]
  isLoading: boolean
  error: string | null
  fetchFolders: (force?: boolean) => Promise<void>
  hasLoadedFolders: boolean
}

/**
 * Hook to fetch Mailchimp folders
 */
export function useMailchimpFolders(): UseMailchimpFoldersResult {
  const [templateFolders, setTemplateFolders] = useState<MailchimpFolder[]>(GLOBAL_CACHE.templateFolders || [])
  const [campaignFolders, setCampaignFolders] = useState<MailchimpFolder[]>(GLOBAL_CACHE.campaignFolders || [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedFolders, setHasLoadedFolders] = useState(!!GLOBAL_CACHE.templateFolders)

  // Use a ref to track if a fetch is already in progress
  const isFetchingRef = useRef(false)

  const fetchFolders = useCallback(
    async (force = false) => {
      // Check if cache is valid and not forced refresh
      const now = Date.now()
      const isCacheValid =
        GLOBAL_CACHE.lastFetchTime > 0 &&
        now - GLOBAL_CACHE.lastFetchTime < CACHE_TTL &&
        GLOBAL_CACHE.templateFolders?.length

      // If we have cached data and it's not a forced refresh, use the cache
      if (!force && isCacheValid) {
        if (!templateFolders.length && GLOBAL_CACHE.templateFolders) {
          setTemplateFolders(GLOBAL_CACHE.templateFolders)
        }
        if (!campaignFolders.length && GLOBAL_CACHE.campaignFolders) {
          setCampaignFolders(GLOBAL_CACHE.campaignFolders)
        }
        setHasLoadedFolders(true)
        return
      }

      // Prevent concurrent fetches
      if (isFetchingRef.current) {
        console.log('Fetch already in progress, skipping')
        return
      }

      isFetchingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        console.log('Fetching Mailchimp folders')

        // Fetch template folders
        const templateResponse = await fetch('/api/oauth/mailchimp/folders?type=template', {
          // Add cache-control headers
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        if (!templateResponse.ok) {
          const errorData = await templateResponse.json()
          throw new Error(errorData.error || 'Failed to fetch template folders')
        }

        const templateData = await templateResponse.json()
        const newTemplateFolders = templateData.folders || []
        setTemplateFolders(newTemplateFolders)
        GLOBAL_CACHE.templateFolders = newTemplateFolders

        // Fetch campaign folders
        const campaignResponse = await fetch('/api/oauth/mailchimp/folders?type=campaign', {
          // Add cache-control headers
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        if (!campaignResponse.ok) {
          const errorData = await campaignResponse.json()
          throw new Error(errorData.error || 'Failed to fetch campaign folders')
        }

        const campaignData = await campaignResponse.json()
        const newCampaignFolders = campaignData.folders || []
        setCampaignFolders(newCampaignFolders)
        GLOBAL_CACHE.campaignFolders = newCampaignFolders

        // Update cache timestamp
        GLOBAL_CACHE.lastFetchTime = Date.now()
        setHasLoadedFolders(true)
      } catch (error) {
        console.error('Error fetching Mailchimp folders:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch Mailchimp folders')
        setHasLoadedFolders(false)
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    },
    [templateFolders.length, campaignFolders.length]
  )

  // Initialize from cache on first mount, if available
  useEffect(() => {
    if (GLOBAL_CACHE.templateFolders && GLOBAL_CACHE.campaignFolders) {
      setTemplateFolders(GLOBAL_CACHE.templateFolders)
      setCampaignFolders(GLOBAL_CACHE.campaignFolders)
      setHasLoadedFolders(true)
    }
  }, [])

  return {
    templateFolders,
    campaignFolders,
    isLoading,
    error,
    fetchFolders,
    hasLoadedFolders,
  }
}
