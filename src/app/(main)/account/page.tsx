"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Package,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Bell,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth";
import { Skeleton } from "@/components/ui/skeleton";

const MENU_ITEMS = [
  { icon: User, label: "Personal Info", href: "/account/profile" },
  { icon: MapPin, label: "Saved Addresses", href: "/addresses" },
  { icon: Bell, label: "Notifications", href: "/account/notifications" },
  { icon: Star, label: "My Reviews", href: "/account/reviews" },
];

const SECONDARY_ITEMS = [
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
  { icon: Settings, label: "Settings", href: "/account/settings" },
];

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Sign in to your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Track orders, save addresses, and more
        </p>
        <Link href="/login" className="mt-6">
          <Button size="lg">Sign In</Button>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary-foreground">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-primary-foreground text-primary">
                {user?.name?.[0] || user?.phone[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{user?.name || "User"}</h2>
              <p className="text-sm text-primary-foreground/80">{user?.phone}</p>
            </div>
            <Link href="/account/profile">
              <Button variant="secondary" size="sm" className="text-xs">
                Edit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-1">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
        ))}
      </div>

      <Separator />

      <div className="space-y-1">
        {SECONDARY_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
        ))}
      </div>

      <Separator />

      <Button
        variant="ghost"
        className="w-full justify-start text-destructive hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Log Out
      </Button>
    </div>
  );
}