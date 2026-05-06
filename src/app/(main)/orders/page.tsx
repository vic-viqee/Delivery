"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Package, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const DEMO_ORDERS = [
  {
    id: "ORD-001",
    status: "IN_TRANSIT",
    items: [
      { name: "Fresh Tomatoes (1kg)", quantity: 2, price: 120 },
      { name: "Organic Bananas", quantity: 1, price: 80 },
      { name: "Brown Bread", quantity: 1, price: 60 },
    ],
    total: 380,
    deliveryFee: 50,
    address: { name: "Home", landmark: "Near bus station", neighborhood: "Kiamuriuki" },
    sellerName: "Embu Fresh Mart",
    createdAt: "2024-01-15T10:30:00",
    estimatedDelivery: "2024-01-15T11:30:00",
  },
  {
    id: "ORD-002",
    status: "DELIVERED",
    items: [
      { name: "Chicken Breast (500g)", quantity: 1, price: 350 },
      { name: "Fresh Milk (1L)", quantity: 2, price: 180 },
    ],
    total: 710,
    deliveryFee: 50,
    address: { name: "Office", landmark: "Near market", neighborhood: "Town" },
    sellerName: "Embu Fresh Mart",
    createdAt: "2024-01-14T14:00:00",
    estimatedDelivery: "2024-01-14T15:00:00",
  },
  {
    id: "ORD-003",
    status: "PENDING",
    items: [
      { name: "Rice (1kg)", quantity: 2, price: 150 },
    ],
    total: 350,
    deliveryFee: 50,
    address: { name: "Home", landmark: "Near hospital", neighborhood: "Kiamuriuki" },
    sellerName: "Embu Fresh Mart",
    createdAt: "2024-01-16T09:00:00",
    estimatedDelivery: "2024-01-16T10:00:00",
  },
];

const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "bg-yellow-500", text: "text-yellow-500" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500", text: "text-blue-500" },
  PREPARING: { label: "Preparing", color: "bg-orange-500", text: "text-orange-500" },
  READY: { label: "Ready", color: "bg-purple-500", text: "text-purple-500" },
  PICKED_UP: { label: "Picked Up", color: "bg-indigo-500", text: "text-indigo-500" },
  IN_TRANSIT: { label: "On the Way", color: "bg-primary", text: "text-primary" },
  DELIVERED: { label: "Delivered", color: "bg-green-500", text: "text-green-500" },
  CANCELLED: { label: "Cancelled", color: "bg-destructive", text: "text-destructive" },
};

export default function OrdersPage() {
  const [orders] = useState(DEMO_ORDERS);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No orders yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your order history will appear here
          </p>
          <Link href="/" className="mt-4">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="transition-all hover:border-primary/50">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {order.id}
                      </Badge>
                      <Badge className={`${STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.color || "bg-muted"} text-white`}>
                        {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.label || order.status}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="mb-3 space-y-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                        <span>KES {item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">{order.address.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold">KES {order.total}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}