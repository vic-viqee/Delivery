"use client";

import { Store } from "lucide-react";
import { AuthLoginForm } from "@/components/auth/auth-login-form";

export default function SellerLoginPage() {
  return (
    <AuthLoginForm
      role="SELLER"
      color="bg-orange-600"
      icon={<Store className="h-7 w-7 text-white" />}
      title="Seller Login"
      subtitle="Manage your store"
      successRedirect="/seller"
      customerLink="/login"
    />
  );
}