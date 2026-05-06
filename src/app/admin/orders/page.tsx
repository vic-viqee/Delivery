"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  User,
  Store,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/admin-layout";

interface Order {
  id: string;
  customer: string;
  customerPhone: string;
  seller: string;
  rider?: string;
  status: string;
  total: number;
  payment: string;
  createdAt: string;
  items: string[];
}

const DEMO_ORDERS: Order[] = [
  { id: "ORD-001", customer: "Wanjiru", customerPhone: "0712 111 111", seller: "Embu Fresh Mart", rider: "Paul R.", status: "DELIVERED", total: 450, payment: "mpesa", createdAt: "2024-02-01 10:30", items: ["Tomatoes", "Bananas"] },
  { id: "ORD-002", customer: "John", customerPhone: "0712 222 222", seller: "Green Grocers", rider: undefined, status: "IN_TRANSIT", total: 280, payment: "mpesa", createdAt: "2024-02-01 11:00", items: ["Milk", "Eggs"] },
  { id: "ORD-003", customer: "Mary", customerPhone: "0712 333 333", seller: "Farm Fresh", rider: "Mike D.", status: "PREPARING", total: 890, payment: "card", createdAt: "2024-02-01 11:30", items: ["Chicken", "Vegetables"] },
  { id: "ORD-004", customer: "Peter", customerPhone: "0712 444 444", seller: "Embu Fresh Mart", rider: undefined, status: "PENDING", total: 150, payment: "mpesa", createdAt: "2024-02-01 12:00", items: ["Bread"] },
  { id: "ORD-005", customer: "Jane", customerPhone: "0712 555 555", seller: "Organic Store", rider: undefined, status: "READY", total: 620, payment: "mpesa", createdAt: "2024-02-01 12:30", items: ["Organic Veg", "Fruits"] },
  { id: "ORD-006", customer: "Bob", customerPhone: "0712 666 666", seller: "Green Grocers", rider: "Tom R.", status: "CANCELLED", total: 320, payment: "mpesa", createdAt: "2024-01-31 09:00", items: ["Snacks"] },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-500" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500" },
  PREPARING: { label: "Preparing", color: "bg-orange-500" },
  READY: { label: "Ready", color: "bg-purple-500" },
  PICKED_UP: { label: "Picked Up", color: "bg-indigo-500" },
  IN_TRANSIT: { label: "In Transit", color: "bg-primary" },
  DELIVERED: { label: "Delivered", color: "bg-green-500" },
  CANCELLED: { label: "Cancelled", color: "bg-destructive" },
};

export default function AdminOrdersPage() {
  const [orders] = useState(DEMO_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">All orders on the platform</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold">KES {totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{statusCounts.PENDING || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">
                {(statusCounts.PREPARING || 0) + (statusCounts.READY || 0) + (statusCounts.IN_TRANSIT || 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{statusCounts.DELIVERED || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PREPARING">Preparing</SelectItem>
                    <SelectItem value="READY">Ready</SelectItem>
                    <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.id}</p>
                      <Badge className={`${STATUS_CONFIG[order.status]?.color || "bg-muted"} text-white`}>
                        {STATUS_CONFIG[order.status]?.label || order.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {order.customer}
                      </div>
                      <div className="flex items-center gap-1">
                        <Store className="h-3 w-3" />
                        {order.seller}
                      </div>
                      {order.rider && (
                        <div className="flex items-center gap-1">
                          <span>Rider: {order.rider}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.items.join(", ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KES {order.total}</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {order.payment}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt}
                    </p>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No orders found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}