"use client";

import { Logo } from "./Logo";
import { Button } from "./button";

type Props = {
  isLogin?: boolean;
  isSignup?: boolean;
};

export default function UnauthenticatedHeader({ isLogin, isSignup }: Props) {
  return (
    <header className="bg-white border-b">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a
            href={process.env.NEXT_PUBLIC_MARKETING_URL}
            className="-m-1.5 p-1.5"
          >
            <span className="sr-only">SwiftMailer</span>
            <Logo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {!isLogin && <Button href="/">Log in</Button>}
          {!isSignup && (
            <Button color="dark" href="/signup">
              Sign up
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
