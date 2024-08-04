import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const handleToggle = () => {
    console.log('happens')

    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  console.log(resolvedTheme)

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input type="checkbox" checked={resolvedTheme === 'light'} onChange={handleToggle} className="hidden" />
      {resolvedTheme === 'dark' ? (
        <SunIcon className="swap-on h-7 w-7 text-yellow-500" />
      ) : (
        <MoonIcon className="swap-off h-7 w-7 text-gray-400" />
      )}
    </label>
  )
}

export default ThemeToggle
