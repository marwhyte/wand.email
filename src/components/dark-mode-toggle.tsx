import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SidebarItem, SidebarLabel } from './sidebar'

type Props = {
  sideBarItem?: boolean
}

const DarkModeToggle = ({ sideBarItem }: Props) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  console.log(theme)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (sideBarItem) {
    return (
      <SidebarItem onClick={handleToggle}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        <SidebarLabel>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</SidebarLabel>
      </SidebarItem>
    )
  }

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input type="checkbox" checked={theme === 'light'} onChange={handleToggle} className="hidden" />
      {theme === 'dark' ? (
        <SunIcon className="swap-on h-7 w-7 text-yellow-500" />
      ) : (
        <MoonIcon className="swap-off h-7 w-7 text-gray-400" />
      )}
    </label>
  )
}

export default DarkModeToggle
