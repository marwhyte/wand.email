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
      <Image src="/logo.svg" alt="SentSwiftly" width={40} height={40} {...props} />
      {text && (
        <Text
          className={`font-nextsunday pt-1 !text-2xl font-bold ${textColor === 'dark' ? '!text-zinc-950' : '!text-white'}`}
        >
          SentSwiftly
        </Text>
      )}
    </div>
  )
}
