import Image from 'next/image'
import { Text } from './text'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'> & {
  src?: string
  alt?: string
  text?: boolean
  textColor?: 'dark' | 'light'
}

export function Logo({ text = true, textColor = 'dark', ...props }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="wand.email" width={40} height={40} {...props} />
      {text && (
        <Text
          className={`pt-1 font-nextsunday !text-2xl font-bold ${textColor === 'dark' ? '!text-zinc-950' : '!text-white'}`}
        >
          wand.email
        </Text>
      )}
    </div>
  )
}
