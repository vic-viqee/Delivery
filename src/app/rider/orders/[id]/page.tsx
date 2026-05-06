"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Package,
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Warehouse,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RiderLayout } from "@/components/rider/rider-layout";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";

const STATUS_STEPS = [
  { key: "PICKED_UP", label: "Picked Up" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function RiderOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (!token) return;
    loadOrder();
  }, [token, orderId]);

  const loadOrder = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const orders = await api.rider.getMyOrders(token);
      const found = orders.find((o: any) => o.id === orderId);
      setOrder(found);
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!token || !orderId) return;
    setUpdating(true);
    try {
      await api.rider.updateOrderStatus(token, orderId, newStatus);
      await loadOrder();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  if (loading) {
    return (
      <RiderLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </RiderLayout>
    );
  }

  if (!order) {
    return (
      <RiderLayout>
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-bold">Order Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This order doesn't exist or isn't assigned to you
          </p>
          <Button onClick={() => router.push("/rider")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </RiderLayout>
    );
  }

  return (
    <RiderLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/rider")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Order #{order.id.slice(-6)}</h1>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant={order.status === "DELIVERED" ? "default" : "outline"}
            className={
              order.status === "DELIVERED"
                ? "bg-green-600"
                : order.status === "CANCELLED"
                  ? "destructive"
                  : ""
            }
          >
            {order.status.replace("_", " ")}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleString()}</span>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold">{order.address?.name}</h4>
                <p className="text-sm text-muted-foreground">{order.address?.neighborhood}</p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${order.user_phone || ""}`}>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Phone className="h-4 w-4" />
                  </Button>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.address?.latitude},${order.address?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="default" size="icon" className="h-9 w-9">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Nearest Stage</p>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Warehouse className="h-3 w-3 text-primary" />
                  {order.address?.nearest_stage || "Main Stage"}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Plus Code</p>
                <div className="flex items-center gap-1 text-sm font-mono">
                  <Navigation className="h-3 w-3 text-primary" />
                  {order.address?.plus_code || "Unavailable"}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Landmark & Instructions</p>
              <p className="text-sm font-medium">{order.address?.landmark}</p>
              {order.address?.instructions && (
                <p className="text-xs italic text-muted-foreground">"{order.address.instructions}"</p>
              )}
            </div>

            {order.address?.voice_note_url && (
              <Button variant="secondary" className="w-full gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                <Volume2 className="h-4 w-4" />
                Play Voice Directions
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-1">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>• {item.product_name || item}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Customer Payment</span>
              <span className="text-lg font-bold">KES {order.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      isCompleted ? "bg-green-50 dark:bg-green-950" : "bg-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span
                      className={
                        isCurrent ? "font-bold text-primary" : isCompleted ? "text-green-600 font-medium" : "text-muted-foreground"
                      }
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
          <div className="sticky bottom-4 space-y-2">
            <div className="flex gap-2">
              {currentStepIndex < STATUS_STEPS.length - 1 && (
                <Button
                  className="flex-1 h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={() =>
                    handleStatusUpdate(STATUS_STEPS[currentStepIndex + 1].key)
                  }
                  disabled={updating}
                >
                  {updating ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Package className="mr-2 h-5 w-5" />
                  )}
                  {currentStepIndex === 0
                    ? "Start Delivery"
                    : "Complete Delivery"}
                </Button>
              )}
              <Button
                variant="outline"
                className="h-12 border-destructive text-destructive"
                onClick={() => handleStatusUpdate("CANCELLED")}
                disabled={updating}
              >
                <AlertTriangle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        </div>
        </RiderLayout>
        );
        }