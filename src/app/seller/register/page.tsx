"use client";

import { Store } from "lucide-react";
import { AuthRegisterForm } from "@/components/auth/auth-register-form";

export default function SellerRegisterPage() {
  return (
    <AuthRegisterForm
      role="SELLER"
      color="bg-orange-600 hover:bg-orange-700"
      icon={<Store className="h-7 w-7 text-white" />}
      title="Start Selling"
      subtitle="Create your store account"
      successRedirect="/seller"
      benefits={[
        "Why sell on Delivery?",
        "Reach thousands of customers in Embu",
        "Easy product management",
        "Quick payments to your M-Pesa",
      ]}
    />
  );
}