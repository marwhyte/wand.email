import clsx from 'clsx'

type HeadingProps = { level?: 1 | 2 | 3 | 4 | 5 | 6 } & React.ComponentPropsWithoutRef<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export function Heading({ className, level = 1, ...props }: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  // Define size classes based on heading level
  const sizeClasses = {
    1: 'text-2xl sm:text-3xl',
    2: 'text-xl sm:text-2xl',
    3: 'text-lg sm:text-xl',
    4: 'text-base sm:text-lg',
    5: 'text-xs sm:text-xs',
    6: 'text-xs sm:text-xs',
  }[level]

  return <Element {...props} className={clsx(sizeClasses, 'font-semibold text-zinc-950 dark:text-white', className)} />
}

export function Subheading({ className, level = 2, ...props }: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  // Define size classes based on subheading level
  const sizeClasses = {
    1: 'text-lg sm:text-base',
    2: 'text-base sm:text-sm',
    3: 'text-sm sm:text-xs',
    4: 'text-xs sm:text-xs',
    5: 'text-xs sm:text-xs',
    6: 'text-xs sm:text-xs',
  }[level]

  return <Element {...props} className={clsx(className, sizeClasses, 'font-semibold text-zinc-950 dark:text-white')} />
}
