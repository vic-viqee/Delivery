"use client";

import { useState } from "react";
import {
  Users,
  Bike,
  Store,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
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

interface User {
  id: string;
  name: string;
  phone: string;
  role: "RIDER" | "SELLER";
  status: "active" | "pending" | "suspended";
  createdAt: string;
  ordersCompleted?: number;
  rating?: number;
}

const DEMO_USERS: User[] = [
  { id: "1", name: "Paul Rider", phone: "0712 345 678", role: "RIDER", status: "active", createdAt: "2024-01-01", ordersCompleted: 156, rating: 4.8 },
  { id: "2", name: "Sarah Shop", phone: "0712 987 654", role: "SELLER", status: "active", createdAt: "2024-01-15", ordersCompleted: 89, rating: 4.5 },
  { id: "3", name: "Mike Deliver", phone: "0712 111 222", role: "RIDER", status: "pending", createdAt: "2024-02-01" },
  { id: "4", name: "Jane Store", phone: "0712 333 444", role: "SELLER", status: "active", createdAt: "2024-02-10", ordersCompleted: 45, rating: 4.2 },
  { id: "5", name: "Tom Rider", phone: "0712 555 666", role: "RIDER", status: "suspended", createdAt: "2024-01-20", ordersCompleted: 12 },
  { id: "6", name: "Amy Market", phone: "0712 777 888", role: "SELLER", status: "pending", createdAt: "2024-02-15" },
];

export default function AdminUsersPage() {
  const [users] = useState(DEMO_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeRiders = users.filter((u) => u.role === "RIDER" && u.status === "active").length;
  const activeSellers = users.filter((u) => u.role === "SELLER" && u.status === "active").length;
  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage riders and sellers</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bike className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Riders</p>
                  <p className="text-xl font-bold">{activeRiders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Sellers</p>
                  <p className="text-xl font-bold">{activeSellers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={pendingCount > 0 ? "border-yellow-500" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <CardTitle>All Users</CardTitle>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 md:w-48"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v || "all")}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="RIDER">Riders</SelectItem>
                    <SelectItem value="SELLER">Sellers</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {user.role === "RIDER" ? (
                        <Bike className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Store className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {user.ordersCompleted !== undefined && (
                      <div className="hidden md:block text-sm text-muted-foreground">
                        {user.ordersCompleted} orders
                      </div>
                    )}
                    {user.rating !== undefined && (
                      <div className="hidden md:block text-sm">
                        ★ {user.rating}
                      </div>
                    )}
                    <Badge
                      variant="outline"
                      className={
                        user.status === "active"
                          ? "border-green-500 text-green-500"
                          : user.status === "pending"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-red-500 text-red-500"
                      }
                    >
                      {user.status}
                    </Badge>
                    <div className="flex gap-1">
                      {user.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="h-8">
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {user.status === "active" && (
                        <Button size="sm" variant="outline" className="h-8 text-red-500">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status === "suspended" && (
                        <Button size="sm" className="h-8 bg-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No users found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}