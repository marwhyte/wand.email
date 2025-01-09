'use client'

import { getFile } from '@/lib/database/queries/files'
import { File, User } from '@/lib/database/types'
import { useEffect, useState } from 'react'
import { OnboardingSteps } from './onboarding-steps'

export function LogoProvider({ user }: { user: User | null }) {
  const [logo, setLogo] = useState<File | null>(null)

  useEffect(() => {
    async function fetchLogo() {
      if (user?.logo_file_id) {
        const logoFile = await getFile(user.logo_file_id)
        setLogo(logoFile ?? null)
      } else {
        const storedLogoId = localStorage.getItem('logoFileId')
        if (storedLogoId) {
          const logoFile = await getFile(storedLogoId)
          setLogo(logoFile ?? null)
        }
      }
    }
    fetchLogo()
  }, [user])

  return <OnboardingSteps user={user} logo={logo} />
}
