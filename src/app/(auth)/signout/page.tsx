'use client'

import { doLogout } from '@/app/actions/authentication'
import { useEffect } from 'react'

const Signout = () => {
  useEffect(() => {
    doLogout().then(() => {
      window.location.href = '/'
    })
  }, [])
  return null
}

export default Signout
