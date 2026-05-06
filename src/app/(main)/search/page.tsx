"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/stores/cart";
import { api } from "@/lib/api";
import type { Product, Category } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { addItem } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.products.categories();
        setCategories([{ id: "all", name: "All", slug: "all", icon: "✨" }, ...data]);
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory !== "all") params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        
        const data = await api.products.list(params);
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 p-4">
      <div className="sticky top-14 z-40 -mx-4 bg-background px-4 py-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for groceries..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.slug)}
            className="whitespace-nowrap"
          >
            <span className="mr-1">{category.icon || "📦"}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No products found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addItem(product)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-10 w-full" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  return (
    <Card className="group cursor-pointer overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
              </div>
            )}
            {product.originalPrice && (
              <Badge className="absolute left-2 top-2 bg-destructive">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>
        </CardContent>
        <div className="p-3">
          <h4 className="line-clamp-1 text-sm font-medium">{product.name}</h4>
          <div className="mt-1 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold">KES {product.price}</span>
              {product.originalPrice && (
                <span className="ml-1 text-xs text-muted-foreground line-through">
                  KES {product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">/ {product.unit}</p>
        </div>
      </Link>
      <Button
        size="sm"
        className="absolute bottom-20 right-3 h-8 w-8 rounded-full p-0 shadow-lg opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.preventDefault();
          onAddToCart();
        }}
      >
        <Package className="h-4 w-4" />
      </Button>
    </Card>
  );
}
