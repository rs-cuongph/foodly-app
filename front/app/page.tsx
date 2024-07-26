"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ROUTES } from "@/shared/constants";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(ROUTES.HOME);
  }, []);

  return <></>;
}
