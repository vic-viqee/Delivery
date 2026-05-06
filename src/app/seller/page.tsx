"use client";

import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SellerLayout } from "@/components/seller/seller-layout";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";

interface Order {
  id: string;
  user_name: string;
  items: { product_name: string }[];
  total: number;
  status: string;
  created_at: string;
}

export default function SellerDashboardPage() {
  const { user, token } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && user?.role === "SELLER") {
      setLoading(true);
      api.seller.orders(token)
        .then((orders: any) => {
          setRecentOrders(orders);
          setPendingCount(orders.filter((o: any) => o.status === "PENDING").length);
          setTotalSales(orders.reduce((acc: number, o: any) => acc + o.total, 0));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, user]);

  if (!user || user.role !== "SELLER") {
    return (
      <SellerLayout>
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
          <XCircle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-bold">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please login as a seller to access this page
          </p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Welcome back!</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening today</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-orange-50 dark:bg-orange-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Pending Orders</p>
                  <p className="text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Today's Sales</p>
                  <p className="text-xl font-bold">KES {totalSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold">Recent Orders ({recentOrders.length})</h2>
          <p className="text-sm text-muted-foreground">Manage your incoming orders</p>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center p-4 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            order.status === "READY"
                              ? "default"
                              : order.status === "PENDING"
                                ? "destructive"
                                : "outline"
                          }
                          className={
                            order.status === "READY" ? "bg-green-600" : ""
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <h4 className="mt-1 font-medium">{order.user_name || "Customer"}</h4>
                      <div className="mt-1 space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            • {item.product_name}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KES {order.total}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator />

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Your store is performing well!</p>
                <p className="text-xs text-muted-foreground">
                  +15% more orders this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}