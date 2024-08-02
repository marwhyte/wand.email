import Image from "next/image";

type LogoProps = Omit<
  React.ComponentPropsWithoutRef<typeof Image>,
  "src" | "alt"
> & {
  src?: string;
  alt?: string;
};

export function Logo(props: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="SwiftMailer"
      width={150}
      height={100}
      {...props}
    />
  );
}
