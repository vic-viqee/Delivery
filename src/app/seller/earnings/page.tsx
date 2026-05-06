"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Calendar, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SellerLayout } from "@/components/seller/seller-layout";
import { useAuthStore } from "@/stores/auth";

const EARNINGS_DATA = {
  today: 2450,
  week: 12350,
  month: 45600,
  pendingPayout: 8900,
  totalOrders: 156,
};

const RECENT_TRANSACTIONS = [
  { id: "1", order: "ORD-001", amount: 250, status: "completed", date: "Today, 10:30 AM" },
  { id: "2", order: "ORD-002", amount: 380, status: "completed", date: "Today, 09:15 AM" },
  { id: "3", order: "ORD-003", amount: 120, status: "pending", date: "Yesterday" },
  { id: "4", order: "ORD-004", amount: 450, status: "completed", date: "Yesterday" },
];

export default function SellerEarningsPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const getAmount = () => {
    switch (period) {
      case "today":
        return EARNINGS_DATA.today;
      case "week":
        return EARNINGS_DATA.week;
      case "month":
        return EARNINGS_DATA.month;
    }
  };

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
        <h1 className="text-xl font-bold">Earnings</h1>

        <div className="flex gap-2">
          <Button
            variant={period === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("today")}
            className={period === "today" ? "bg-orange-600" : ""}
          >
            Today
          </Button>
          <Button
            variant={period === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("week")}
            className={period === "week" ? "bg-orange-600" : ""}
          >
            This Week
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("month")}
            className={period === "month" ? "bg-orange-600" : ""}
          >
            This Month
          </Button>
        </div>

        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {period === "today" && "Today's Earnings"}
              {period === "week" && "This Week's Earnings"}
              {period === "month" && "This Month's Earnings"}
            </p>
            <p className="mt-2 text-4xl font-bold">KES {getAmount().toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-xl font-bold">KES {EARNINGS_DATA.pendingPayout.toLocaleString()}</p>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Request Payout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{EARNINGS_DATA.totalOrders}</p>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>

        <div className="space-y-2">
          {RECENT_TRANSACTIONS.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{tx.order}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KES {tx.amount}</p>
                    <p
                      className={`text-xs ${
                        tx.status === "completed" ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {tx.status === "completed" ? "Paid" : "Pending"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SellerLayout>
  );
}