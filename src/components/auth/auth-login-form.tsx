"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth";

interface AuthLoginFormProps {
  role: "RIDER" | "SELLER" | "ADMIN";
  color: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  successRedirect: string;
  customerLink?: string;
  onCheckRole?: (user: any) => boolean;
  adminCredentials?: { phone: string; password: string };
}

export function AuthLoginForm({
  role,
  color,
  icon,
  title,
  subtitle,
  successRedirect,
  customerLink = "/login",
  onCheckRole,
  adminCredentials,
}: AuthLoginFormProps) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check admin credentials if provided
    if (adminCredentials) {
      if (formData.phone === adminCredentials.phone && formData.password === adminCredentials.password) {
        const adminUser = {
          id: "admin-1",
          phone: formData.phone,
          name: "Admin",
          role: role,
          createdAt: new Date().toISOString(),
        };
        setUser(adminUser, "admin-token");
        router.push(successRedirect);
        setIsLoading(false);
        return;
      }
    }

    const mockUser = {
      id: `${role.toLowerCase()}-1`,
      phone: formData.phone,
      name: formData.phone,
      role: role,
      createdAt: new Date().toISOString(),
    };

    if (onCheckRole && !onCheckRole(mockUser)) {
      setError(`This account is not a ${role.toLowerCase()} account`);
      setIsLoading(false);
      return;
    }

    setUser(mockUser, "mock-token");
    router.push(successRedirect);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${color}`}>
            {icon}
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712 345 678"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-6 pb-6">
              <Button type="submit" className={`w-full ${color.replace("bg-", "hover:bg-").replace("-600", "-700")}`} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {role === "RIDER" && "Want to shop instead? "}
                {role === "SELLER" && "Want to shop instead? "}
                {role === "ADMIN" && "Need to shop? "}
                <Link href={customerLink} className="font-medium text-primary hover:underline">
                  {role === "ADMIN" ? "Customer app" : "Customer login"}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}