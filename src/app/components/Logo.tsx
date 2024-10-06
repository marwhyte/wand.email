import Image from 'next/image'
import { Text } from './text'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'> & {
  src?: string
  alt?: string
  text?: boolean
}

export function Logo({ text = true, ...props }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="SentSwiftly" width={40} height={40} {...props} />
      {text && <Text className="!text-2xl font-bold !text-zinc-950 dark:!text-white">SentSwiftly</Text>}
    </div>
  )
}
