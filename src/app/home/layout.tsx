import { auth } from "@/auth";
import Content from "./content";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div>
      <Content session={session}>
        <>{children}</>
      </Content>
    </div>
  );
}
