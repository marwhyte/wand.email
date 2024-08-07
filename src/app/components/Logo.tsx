import Image from 'next/image'
import { Text } from './text'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'> & {
  src?: string
  alt?: string
}

export function Logo(props: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="SwiftMailer" width={50} height={50} {...props} />
      <Text className="!text-2xl font-bold !text-zinc-950 dark:!text-white">SwiftMailer</Text>
    </div>
  )
}
