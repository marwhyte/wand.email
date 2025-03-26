import Image from 'next/image'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'> & {
  icon?: boolean
}

export function Logo({ icon = false, ...props }: LogoProps) {
  if (icon) {
    return <Image src="/brand-kit/logo-icon.svg" alt="wand.email" width={35} height={35} {...props} />
  }

  return <Image src="/brand-kit/logo-dark.svg" alt="wand.email" width={167} height={33} {...props} />
}
