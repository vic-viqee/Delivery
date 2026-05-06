"use client";

import { Lock } from "lucide-react";
import { AuthLoginForm } from "@/components/auth/auth-login-form";

export default function AdminLoginPage() {
  return (
    <AuthLoginForm
      role="ADMIN"
      color="bg-blue-600"
      icon={<Lock className="h-7 w-7 text-white" />}
      title="Delivery Admin"
      subtitle="Platform management"
      successRedirect="/admin"
      customerLink="/"
      adminCredentials={{ phone: "0712345678", password: "admin123" }}
    />
  );
}