import { auth } from "@/auth";

export default async function TemplatesPage() {
  const session = await auth();

  return <div>templates</div>;
}
