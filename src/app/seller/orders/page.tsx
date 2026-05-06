"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SellerLayout } from "@/components/seller/seller-layout";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";

interface Order {
  id: string;
  user_name: string;
  items: { product_name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  created_at: string;
}

const STATUS_ORDER = ["PENDING", "CONFIRMED", "PREPARING", "READY"];

export default function SellerOrdersPage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (token && user?.role === "SELLER") {
      fetchOrders();
    }
  }, [token, user]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const data = await api.seller.orders(token);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    setUpdating(orderId);
    try {
      await api.orders.updateStatus(token, orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const idx = STATUS_ORDER.indexOf(currentStatus);
    return idx >= 0 && idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Orders</h1>

        {orders.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center p-4 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Orders</h3>
            <p className="text-sm text-muted-foreground">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
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
                            order.status === "READY"
                              ? "bg-green-600"
                              : ""
                          }
                        >
                          {order.status === "PENDING" && <Clock className="mr-1 h-3 w-3" />}
                          {order.status === "CONFIRMED" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {order.status === "PREPARING" && <Clock className="mr-1 h-3 w-3" />}
                          {order.status === "READY" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {order.status.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <h3 className="mt-2 font-medium">{order.user_name || "Customer"}</h3>
                      <div className="mt-1 space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            {item.quantity}x {item.product_name} - KES {item.price}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KES {order.total}</p>
                    </div>
                  </div>

                  {getNextStatus(order.status) && (
                    <Button
                      size="sm"
                      className="mt-3 w-full bg-primary hover:bg-primary/90"
                      onClick={() => updateStatus(order.id, getNextStatus(order.status)!)}
                      disabled={updating === order.id}
                    >
                      {updating === order.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        order.status === "PENDING" ? "Confirm Order" :
                        order.status === "CONFIRMED" ? "Start Preparing" :
                        order.status === "PREPARING" ? "Mark as Ready" : "Next Step"
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
  }