"use client";

import { Bike } from "lucide-react";
import { AuthRegisterForm } from "@/components/auth/auth-register-form";

export default function RiderRegisterPage() {
  return (
    <AuthRegisterForm
      role="RIDER"
      color="bg-green-600 hover:bg-green-700"
      icon={<Bike className="h-7 w-7 text-white" />}
      title="Become a Rider"
      subtitle="Join our delivery team"
      successRedirect="/rider"
      benefits={[
        "Why become a rider?",
        "Earn up to KES 500 per delivery",
        "Flexible working hours",
        "Weekly payments",
      ]}
    />
  );
}