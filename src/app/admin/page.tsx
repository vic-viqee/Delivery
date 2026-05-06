"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Bike,
  Store,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/admin-layout";

const STATS = {
  totalOrders: 1247,
  totalRevenue: 2456000,
  activeRiders: 24,
  activeSellers: 12,
  pendingApplications: 5,
};

const RECENT_ORDERS = [
  { id: "ORD-001", customer: "Wanjiru", seller: "Embu Fresh Mart", total: 450, status: "DELIVERED" },
  { id: "ORD-002", customer: "John", seller: "Green Grocers", total: 280, status: "IN_TRANSIT" },
  { id: "ORD-003", customer: "Mary", seller: "Farm Fresh", total: 890, status: "PREPARING" },
  { id: "ORD-004", customer: "Peter", seller: "Embu Fresh Mart", total: 150, status: "PENDING" },
  { id: "ORD-005", customer: "Jane", seller: "Organic Store", total: 620, status: "READY" },
];

const PENDING_USERS = [
  { id: "1", name: "Paul Rider", phone: "0712 345 678", role: "RIDER", appliedAt: "2 hours ago" },
  { id: "2", name: "Sarah Shop", phone: "0712 987 654", role: "SELLER", appliedAt: "5 hours ago" },
  { id: "3", name: "Mike Deliver", phone: "0712 111 222", role: "RIDER", appliedAt: "1 day ago" },
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

export default function AdminDashboardPage() {
  const [stats] = useState(STATS);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of the platform</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold">
                    KES {(stats.totalRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                  <Bike className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Riders</p>
                  <p className="text-xl font-bold">{stats.activeRiders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                  <Store className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Sellers</p>
                  <p className="text-xl font-bold">{stats.activeSellers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {stats.pendingApplications > 0 && (
          <Card className="border-yellow-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pending Applications</CardTitle>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  {stats.pendingApplications} new
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PENDING_USERS.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.phone} • {user.role}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.appliedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {RECENT_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} • {order.seller}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${STATUS_CONFIG[order.status]?.color || "bg-muted"} text-white`}>
                      {STATUS_CONFIG[order.status]?.label || order.status}
                    </Badge>
                    <p className="mt-1 text-sm font-medium">KES {order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}