"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Package,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RiderLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/rider", icon: Package, label: "Orders", exact: true },
  { href: "/rider/earnings", icon: DollarSign, label: "Earnings" },
  { href: "/rider/profile", icon: User, label: "Profile" },
];

export function RiderLayout({ children }: RiderLayoutProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground">D</span>
            </div>
            <span className="font-semibold">Rider App</span>
          </div>

          <Button
            variant={isOnline ? "default" : "outline"}
            size="sm"
            onClick={() => setIsOnline(!isOnline)}
            className={isOnline ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isOnline ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Online
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Offline
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}