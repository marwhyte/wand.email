import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import { Logo } from "@/components/Logo";
import UnauthenticatedHeader from "@/components/UnauthenticatedHeader";
import { Link } from "@/components/link";

export default function Home() {
  return (
    <div>
      <UnauthenticatedHeader isLogin />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <LoginForm />

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member? <Link href="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
