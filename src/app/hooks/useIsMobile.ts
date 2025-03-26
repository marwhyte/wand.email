import { useEffect, useState } from 'react'

export function useIsMobile() {
  // Start with false as the default state (desktop view)
  const [isMobile, setIsMobile] = useState(false)
  // Add a state to track if we're in the browser environment
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted (client-side)
    setIsMounted(true)

    console.log('isMounted', isMounted)

    // Set initial value
    const checkIsMobile = () => {
      const mobileMediaQuery = window.matchMedia('(max-width: 767px)')
      setIsMobile(mobileMediaQuery.matches)
    }

    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  // Only return the actual state when mounted (client-side)
  return isMounted ? isMobile : false
}
