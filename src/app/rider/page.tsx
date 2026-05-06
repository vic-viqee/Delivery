"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  CheckCircle,
  XCircle,
  Power,
  PowerOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RiderLayout } from "@/components/rider/rider-layout";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";

interface Order {
  id: string;
  seller_name: string;
  address: {
    name: string;
    landmark: string;
    neighborhood?: string;
    latitude: number;
    longitude: number;
    plus_code?: string;
    nearest_stage?: string;
    voice_note_url?: string;
  };
  items: string[];
  total: number;
  created_at: string;
}

export default function RiderOrdersPage() {
  const { token, user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [earningsToday, setEarningsToday] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      api.rider.profile(token)
        .then((profile) => {
          setIsOnline(profile.is_online || false);
          if (profile.is_online) {
            fetchOrders();
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [token]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const [available, my] = await Promise.all([
        api.rider.getAvailableOrders(token),
        api.rider.getMyOrders(token),
      ]);
      setAvailableOrders(available);
      setMyOrders(my);
      
      // Calculate earnings (mock logic for now since we don't have detailed earnings API yet)
      const completed = my.filter((o: any) => o.status === "DELIVERED").length;
      setCompletedToday(completed);
      setEarningsToday(completed * 50); // 50 KES per delivery
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (isOnline) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [isOnline, token]);

  const handleToggleOnline = async () => {
    if (!token) return;
    try {
      const updated = await api.rider.toggleOnline(token, !isOnline);
      setIsOnline(updated.is_online);
      if (updated.is_online) fetchOrders();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    if (!token) return;
    try {
      await api.rider.acceptOrder(token, orderId);
      fetchOrders();
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  if (!user || user.role !== "RIDER") {
    return (
      <RiderLayout>
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
          <XCircle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-bold">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please login as a rider to access this page
          </p>
        </div>
      </RiderLayout>
    );
  }

  if (loading) {
    return (
      <RiderLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </RiderLayout>
    );
  }

  return (
    <RiderLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome, {user.name || "Rider"}</h1>
            <p className="text-sm text-muted-foreground">
              {isOnline ? "You're online" : "You're offline"}
            </p>
          </div>
          <Button
            variant={isOnline ? "destructive" : "default"}
            onClick={handleToggleOnline}
            className={isOnline ? "" : "bg-green-600 hover:bg-green-700"}
          >
            {isOnline ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                Go Offline
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Go Online
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-green-50 dark:bg-green-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Today's Earnings</p>
                  <p className="text-xl font-bold">KES {earningsToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Completed Today</p>
                  <p className="text-xl font-bold">{completedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {myOrders.some(o => (o as any).status !== "DELIVERED" && (o as any).status !== "CANCELLED") && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">My Active Orders</h2>
            <div className="space-y-3">
              {myOrders
                .filter(o => (o as any).status !== "DELIVERED" && (o as any).status !== "CANCELLED")
                .map((order) => (
                  <Card key={order.id} className="border-primary bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>{(order as any).status}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="font-bold">{order.seller_name}</h4>
                      <p className="text-sm text-muted-foreground">{order.address.name} ({order.address.neighborhood})</p>
                      
                      {order.address.nearest_stage && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                          <MapPin className="h-3 w-3" />
                          Stage: {order.address.nearest_stage}
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Link href={`/rider/orders/${order.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            View Details / Navigate
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <Separator />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">New Orders ({availableOrders.length})</h2>
          <p className="text-sm text-muted-foreground">Tap to accept an order</p>
        </div>

        {!isOnline ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center p-4 text-center">
            <XCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">You're Offline</h3>
            <p className="text-sm text-muted-foreground">
              Go online to see available orders
            </p>
          </div>
        ) : availableOrders.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center p-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <h3 className="mt-4 text-lg font-medium">No Orders Available</h3>
            <p className="text-sm text-muted-foreground">
              Check back soon for new orders
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer transition-all hover:border-primary/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {order.id}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="mt-1 font-medium">{order.seller_name}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.address.landmark}
                      </p>
                      
                      {order.address.nearest_stage && (
                        <p className="text-xs font-medium text-primary">
                          Near: {order.address.nearest_stage}
                        </p>
                      )}

                      <Separator className="my-2" />

                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            • {item}
                          </p>
                        ))}
                      </div>

                      <Separator className="my-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                          Total: KES {order.total}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <Navigation className="mr-1 h-4 w-4" />
                      Accept Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RiderLayout>
  );
}