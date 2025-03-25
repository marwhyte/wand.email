import Image from 'next/image'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'> & {
  icon?: boolean
}

export function Logo({ icon = false, ...props }: LogoProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white">
      {icon ? (
        <Image src="/logo-icon.svg" alt="wand.email" width={35} height={35} {...props} />
      ) : (
        <Image src="/logo.svg" alt="wand.email" width={142} height={35} {...props} />
      )}
    </div>
  )
}
