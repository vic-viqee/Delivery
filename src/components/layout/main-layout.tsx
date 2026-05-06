"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart";
import { useAuthStore, useLocationStore } from "@/stores/auth";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Package,
  MapPin,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/orders", icon: Package, label: "Orders" },
  { href: "/account", icon: User, label: "Account" },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getItemCount } = useCartStore();
  const { isAuthenticated, user, logout, token } = useAuthStore();
  const { syncQueue, removeFromSyncQueue } = useLocationStore();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCartCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    if (!mounted) return;

    const handleOnline = async () => {
      if (syncQueue.length > 0 && token) {
        toast.info(`Syncing ${syncQueue.length} saved addresses...`);
        const queueCopy = [...syncQueue];
        for (const address of queueCopy) {
          try {
            const { tempId, ...addressData } = address;
            await api.addresses.create(token, addressData);
            removeFromSyncQueue(tempId);
          } catch (e) {
            console.error("Failed to sync address", e);
          }
        }
      }
    };

    window.addEventListener("online", handleOnline);
    if (navigator.onLine) {
      handleOnline();
    }

    return () => window.removeEventListener("online", handleOnline);
  }, [syncQueue, token, removeFromSyncQueue, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">D</span>
              </div>
              <span className="hidden font-semibold sm:inline-block">Delivery</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">D</span>
              </div>
              Delivery
            </SheetTitle>
            <SheetDescription className="text-left">
              Grocery delivery in Embu
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 px-2 py-4">
              <Avatar>
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.name?.[0] || user.phone[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 px-2 py-4">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
          
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/addresses" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <MapPin className="h-5 w-5" />
                My Addresses
              </Button>
            </Link>
            {isAuthenticated && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="pb-20 md:pb-4">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.href === "/" && cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-[8px] flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}