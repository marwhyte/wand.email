import { auth } from "@/auth";
import CustomIframe from "@/components/custom-iframe";
import GoingEmail from "./EmailTemplate";

export default async function GoingPage() {
  const session = await auth();

  return (
    <CustomIframe>
      <GoingEmail />
    </CustomIframe>
  );
}
