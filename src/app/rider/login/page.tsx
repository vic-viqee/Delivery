"use client";

import { Bike } from "lucide-react";
import { AuthLoginForm } from "@/components/auth/auth-login-form";

export default function RiderLoginPage() {
  return (
    <AuthLoginForm
      role="RIDER"
      color="bg-green-600"
      icon={<Bike className="h-7 w-7 text-white" />}
      title="Rider Login"
      subtitle="Sign in to start delivering"
      successRedirect="/rider"
    />
  );
}