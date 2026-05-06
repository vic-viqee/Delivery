"use client";

import { useState } from "react";
import {
  DollarSign,
  Package,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RiderLayout } from "@/components/rider/rider-layout";

interface EarningsDay {
  date: string;
  orders: number;
  earnings: number;
}

const WEEK_DATA: EarningsDay[] = [
  { date: "Mon", orders: 12, earnings: 3200 },
  { date: "Tue", orders: 8, earnings: 2100 },
  { date: "Wed", orders: 15, earnings: 4100 },
  { date: "Thu", orders: 10, earnings: 2800 },
  { date: "Fri", orders: 18, earnings: 5200 },
  { date: "Sat", orders: 22, earnings: 6800 },
  { date: "Sun", orders: 5, earnings: 1450 },
];

export default function RiderEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("week");

  const weekEarnings = WEEK_DATA.reduce((sum, d) => sum + d.earnings, 0);
  const weekOrders = WEEK_DATA.reduce((sum, d) => sum + d.orders, 0);
  const avgPerOrder = Math.round(weekEarnings / weekOrders);
  const maxEarnings = Math.max(...WEEK_DATA.map((d) => d.earnings));

  return (
    <RiderLayout>
      <div className="space-y-4 p-4">
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("today")}
          >
            Today
          </Button>
          <Button
            variant={selectedPeriod === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("week")}
          >
            This Week
          </Button>
          <Button
            variant={selectedPeriod === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("month")}
          >
            This Month
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-green-50 dark:bg-green-950">
            <CardContent className="p-4">
              <DollarSign className="h-5 w-5 text-green-600 mb-1" />
              <p className="text-2xl font-bold">KES {weekEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardContent className="p-4">
              <Package className="h-5 w-5 text-blue-600 mb-1" />
              <p className="text-2xl font-bold">{weekOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-1 h-32">
              {WEEK_DATA.map((day) => (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{
                      height: `${(day.earnings / maxEarnings) * 100}%`,
                      minHeight: day.earnings > 0 ? "8px" : "0",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average per Order</span>
              <span className="font-medium">KES {avgPerOrder}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="font-medium">{weekOrders} orders</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Day</span>
              <span className="font-medium">KES 6,800 (Sat)</span>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg">
          <DollarSign className="mr-2 h-4 w-4" />
          Withdraw Earnings
        </Button>
      </div>
    </RiderLayout>
  );
}