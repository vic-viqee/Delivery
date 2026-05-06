"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/types";

const STATUS_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Order Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PREPARING", label: "Preparing" },
  { status: "READY", label: "Ready" },
  { status: "PICKED_UP", label: "Picked Up" },
  { status: "IN_TRANSIT", label: "On the Way" },
  { status: "DELIVERED", label: "Delivered" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-500" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500" },
  PREPARING: { label: "Preparing", color: "bg-orange-500" },
  READY: { label: "Ready", color: "bg-purple-500" },
  PICKED_UP: { label: "Picked Up", color: "bg-indigo-500" },
  IN_TRANSIT: { label: "On the Way", color: "bg-primary" },
  DELIVERED: { label: "Delivered", color: "bg-green-500" },
  CANCELLED: { label: "Cancelled", color: "bg-destructive" },
};

const DEMO_ORDERS: Record<string, Order> = {
  "ORD-001": {
    id: "ORD-001",
    userId: "user-1",
    sellerId: "seller-1",
    sellerName: "Embu Fresh Mart",
    items: [
      { id: "1", productId: "p1", productName: "Fresh Tomatoes (1kg)", price: 120, quantity: 2, total: 240 },
      { id: "2", productId: "p2", productName: "Organic Bananas", price: 80, quantity: 1, total: 80 },
      { id: "3", productId: "p3", productName: "Brown Bread", price: 60, quantity: 1, total: 60 },
    ],
    address: {
      id: "addr-1",
      userId: "user-1",
      name: "Home",
      landmark: "Near bus station, Kiamuriuki",
      latitude: -0.5389,
      longitude: 37.4586,
      neighborhood: "Kiamuriuki",
      isDefault: true,
      createdAt: "2024-01-01",
    },
    status: "IN_TRANSIT",
    subtotal: 380,
    deliveryFee: 50,
    total: 430,
    createdAt: "2024-01-15T10:30:00",
    estimatedDelivery: "2024-01-15T11:30:00",
  },
  "ORD-002": {
    id: "ORD-002",
    userId: "user-1",
    sellerId: "seller-1",
    sellerName: "Embu Fresh Mart",
    items: [
      { id: "4", productId: "p4", productName: "Chicken Breast (500g)", price: 350, quantity: 1, total: 350 },
      { id: "5", productId: "p5", productName: "Fresh Milk (1L)", price: 90, quantity: 2, total: 180 },
    ],
    address: {
      id: "addr-2",
      userId: "user-1",
      name: "Office",
      landmark: "Near market, Town",
      latitude: -0.5395,
      longitude: 37.459,
      neighborhood: "Town",
      isDefault: false,
      createdAt: "2024-01-01",
    },
    status: "DELIVERED",
    subtotal: 530,
    deliveryFee: 50,
    total: 580,
    createdAt: "2024-01-14T14:00:00",
    estimatedDelivery: "2024-01-14T15:00:00",
  },
  "ORD-003": {
    id: "ORD-003",
    userId: "user-1",
    sellerId: "seller-1",
    sellerName: "Embu Fresh Mart",
    items: [
      { id: "6", productId: "p6", productName: "Rice (1kg)", price: 150, quantity: 2, total: 300 },
    ],
    address: {
      id: "addr-1",
      userId: "user-1",
      name: "Home",
      landmark: "Near hospital, Kiamuriuki",
      latitude: -0.5385,
      longitude: 37.458,
      neighborhood: "Kiamuriuki",
      isDefault: true,
      createdAt: "2024-01-01",
    },
    status: "PENDING",
    subtotal: 300,
    deliveryFee: 50,
    total: 350,
    createdAt: "2024-01-16T09:00:00",
    estimatedDelivery: "2024-01-16T10:00:00",
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showItems, setShowItems] = useState(true);

  const orderId = params.id as string;

  useEffect(() => {
    loadOrder();
  }, [orderId, token]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);

    if (token) {
      try {
        const data = await api.orders.get(token, orderId);
        setOrder(data);
      } catch (err: any) {
        if (err.message.includes("404")) {
          setOrder(null);
        }
      } finally {
        setLoading(false);
      }
    } else {
      const demoOrder = DEMO_ORDERS[orderId];
      if (demoOrder) {
        setOrder(demoOrder);
      } else {
        setError("Order not found");
      }
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return STATUS_STEPS.findIndex((s) => s.status === order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <Package className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Order Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This order doesn't exist or you don't have access
        </p>
        <Link href="/orders" className="mt-4">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Link href="/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Order #{order.id}</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${STATUS_CONFIG[order.status]?.color || "bg-muted"} text-white`}>
                {STATUS_CONFIG[order.status]?.label || order.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <span className="font-semibold">KES {order.total}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Order Progress</p>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-4">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isPending = index > currentStepIndex;

                  return (
                    <div key={step.status} className="relative flex items-start gap-3 pl-2">
                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted
                            ? "bg-green-500"
                            : isCurrent
                              ? "bg-primary"
                                : "bg-muted"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <span className={`text-xs ${isCurrent ? "text-white" : "text-muted-foreground"}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className={`flex-1 pb-4 ${isPending ? "text-muted-foreground" : ""}`}>
                        <p className={`text-sm ${isCurrent ? "font-medium" : ""}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-muted-foreground">
                            {step.status === "PENDING" && "Waiting for seller confirmation"}
                            {step.status === "CONFIRMED" && "Seller has confirmed your order"}
                            {step.status === "PREPARING" && "Seller is preparing your order"}
                            {step.status === "READY" && "Order is ready for pickup"}
                            {step.status === "PICKED_UP" && "Rider has picked up your order"}
                            {step.status === "IN_TRANSIT" && "Order is on the way"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setShowItems(!showItems)}
          >
            <div className="text-sm font-medium">
              Order Items ({order.items.length})
            </div>
            {showItems ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showItems && (
            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">{item.quantity}x </span>
                    <span>{item.productName}</span>
                  </div>
                  <span>KES {item.total}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>KES {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery Fee</span>
                <span>KES {order.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>KES {order.total}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{order.address.name}</p>
                <p className="text-sm text-muted-foreground">{order.address.landmark}</p>
                {order.address.neighborhood && (
                  <p className="text-xs text-muted-foreground">
                    {order.address.neighborhood}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {order.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleString()
                    : "Calculating..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{order.sellerName}</p>
              <p className="text-xs text-muted-foreground">Store</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}