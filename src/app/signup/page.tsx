import { Link } from "@/components/link";
import RegistrationForm from "@/components/RegistrationForm";
import UnauthenticatedHeader from "@/components/UnauthenticatedHeader";
import React from "react";

const SignupPage = () => {
  return (
    <div>
      <UnauthenticatedHeader isSignup />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <RegistrationForm />

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member? <Link href="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
