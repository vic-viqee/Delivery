"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Clock, Package, ShoppingBag, Star, Bike, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart";
import { api } from "@/lib/api";
import type { Product, Category } from "@/types";

export default function HomePage() {
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          api.products.categories(),
          api.products.list({ limit: 8 })
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        console.error("Failed to load home data:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (!mounted || loading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-primary px-5 py-8 text-primary-foreground">
        <div className="relative z-10">
          <Badge variant="secondary" className="mb-3 bg-primary-foreground/20 text-primary-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            Delivering in Embu
          </Badge>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            Fresh groceries<br />delivered to your door
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Shop from local stores and get deliveries in under 45 minutes
          </p>
          <Link href="/search" className="mt-4 inline-block">
            <Button variant="secondary" size="lg" className="gap-2">
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary-foreground/5" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/rider/apply">
          <Card className="h-full border-orange-200 bg-orange-50 hover:border-orange-300 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                <Bike className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">Become a Rider</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Earn up to KES 500 per delivery
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-orange-400" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/seller/apply">
          <Card className="h-full border-purple-200 bg-purple-50 hover:border-purple-300 dark:border-purple-800 dark:bg-purple-950">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <Store className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Become a Seller</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Reach more customers in Embu
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-purple-400" />
            </CardContent>
          </Card>
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Link href="/search" className="text-sm text-muted-foreground hover:text-primary">
            See all
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Link key={category.id} href={`/search?category=${category.slug}`}>
              <div className="flex min-w-[100px] flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:border-primary hover:bg-primary/5">
                <span className="text-3xl">{category.icon || "📦"}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Popular Products</h2>
          <Link href="/search" className="text-sm text-muted-foreground hover:text-primary">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addItem(product)} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Clock className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Delivery in 45 minutes</h3>
            <p className="text-sm text-muted-foreground">
              Get your groceries delivered fast within Embu
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold">500+</div>
            <div className="text-xs text-muted-foreground">Products</div>
          </div>
          <div>
            <div className="text-lg font-bold">4.8</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div>
            <div className="text-lg font-bold">1hr</div>
            <div className="text-xs text-muted-foreground">Avg Delivery</div>
          </div>
        </div>
      </section>
    </div>
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
        <CardFooter className="flex flex-col items-start gap-1 p-3">
          <h4 className="line-clamp-1 text-sm font-medium">{product.name}</h4>
          <div className="flex w-full items-center justify-between">
            <div>
              <span className="text-sm font-bold">KES {product.price}</span>
              {product.originalPrice && (
                <span className="ml-1 text-xs text-muted-foreground line-through">
                  KES {product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">/ {product.unit}</span>
          </div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}
        </CardFooter>
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

function HomePageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-48 rounded-2xl bg-muted animate-pulse" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-24 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}