import { doLogout } from '@/app/actions/authentication'
import { useEffect } from 'react'

const Signout = () => {
  useEffect(() => {
    doLogout()
  }, [])
  return null
}

export default Signout
