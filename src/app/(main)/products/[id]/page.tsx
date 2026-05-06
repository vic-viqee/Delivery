"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingBag,
  Star,
  Truck,
  Store,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import type { Product } from "@/types";

const DEMO_PRODUCTS: Record<string, Product> = {
  "p1": {
    id: "p1",
    sellerId: "seller-1",
    sellerName: "Embu Fresh Mart",
    name: "Fresh Tomatoes",
    description: "Fresh organic tomatoes grown locally in Embu. Perfect for cooking, salads, or making sauces. Sourced directly from local farmers.",
    price: 150,
    originalPrice: 200,
    category: "Vegetables",
    stock: 50,
    unit: "kg",
    rating: 4.5,
    reviewCount: 28,
  },
  "p2": {
    id: "p2",
    sellerId: "seller-1",
    sellerName: "Embu Fresh Mart",
    name: "Organic Bananas",
    description: "Sweet organic bananas from local farms. Great for smoothies, baking, or snacking.",
    price: 80,
    category: "Fruits",
    stock: 30,
    unit: "bunch",
    rating: 4.2,
    reviewCount: 15,
  },
  "p3": {
    id: "p3",
    sellerId: "seller-1",
    sellerName: "Embu Fresh Mart",
    name: "Fresh Milk (1L)",
    description: "Fresh milk delivered daily from local dairy farms.",
    price: 120,
    originalPrice: 150,
    category: "Dairy",
    stock: 20,
    unit: "liter",
    rating: 4.8,
    reviewCount: 42,
  },
  "p4": {
    id: "p4",
    sellerId: "seller-1",
    sellerName: "Embu Fresh Mart",
    name: "Brown Bread",
    description: "Freshly baked brown bread. Perfect for sandwiches.",
    price: 60,
    category: "Bakery",
    stock: 15,
    unit: "loaf",
    rating: 4.0,
    reviewCount: 8,
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, items } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const token = useAuthStore.getState().token;
      if (token) {
        const data = await api.products.get(productId);
        setProduct(data);
      } else {
        const demoProduct = DEMO_PRODUCTS[productId];
        if (demoProduct) {
          setProduct(demoProduct);
        } else {
          setProduct(null);
        }
      }
    } catch (error) {
      const demoProduct = DEMO_PRODUCTS[productId];
      if (demoProduct) {
        setProduct(demoProduct);
      } else {
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    addItem(product, quantity);
    setTimeout(() => {
      setAdding(false);
    }, 500);
  };

  const currentInCart = items.find((item) => item.product.id === productId)?.quantity || 0;

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Product Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This product doesn't exist
        </p>
        <Link href="/" className="mt-4">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <Link href="/cart">
          <Button variant="outline" size="sm">
            Cart ({items.length})
          </Button>
        </Link>
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        {discount > 0 && (
          <Badge className="absolute right-2 top-2 bg-destructive">
            -{discount}%
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{product.category}</Badge>
          {product.stock > 0 ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              In Stock ({product.stock})
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">KES {product.price}</span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              KES {product.originalPrice}
            </span>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>
        )}
      </div>

      <Separator />

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{product.sellerName}</p>
              <p className="text-xs text-muted-foreground">Seller</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Delivery Available</p>
              <p className="text-xs text-muted-foreground">
                Delivered within Embu area
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentInCart > 0 && (
        <Card className="bg-green-50 dark:bg-green-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentInCart} in your cart
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {adding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="mr-2 h-4 w-4" />
            )}
            Add to Cart - KES {product.price * quantity}
          </Button>
        </div>
      </div>
    </div>
  );
}