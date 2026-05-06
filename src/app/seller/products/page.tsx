"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Package, Search, Edit, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SellerLayout } from "@/components/seller/seller-layout";
import { useAuthStore } from "@/stores/auth";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
}

const DEMO_PRODUCTS: Product[] = [
  { id: "1", name: "Fresh Tomatoes", price: 150, stock: 50, category: "Vegetables", isActive: true },
  { id: "2", name: "Bananas", price: 100, stock: 30, category: "Fruits", isActive: true },
  { id: "3", name: "Fresh Milk (1L)", price: 120, stock: 20, category: "Dairy", isActive: true },
  { id: "4", name: "Brown Bread", price: 80, stock: 0, category: "Bakery", isActive: false },
];

export default function SellerProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Products</h1>
          <Link href="/seller/products/add">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-1 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center p-4 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Products</h3>
            <p className="text-sm text-muted-foreground">
              Add your first product to start selling
            </p>
            <Link href="/seller/products/add">
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                <Plus className="mr-1 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={product.isActive ? "default" : "destructive"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <h3 className="mt-2 font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.stock} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">KES {product.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}