import { Metadata } from "next";

import { SignUpPage } from ".";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return <SignUpPage />;
}
