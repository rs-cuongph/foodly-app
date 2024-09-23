import { Metadata } from "next";

import { SignInPage } from ".";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return <SignInPage />;
}
