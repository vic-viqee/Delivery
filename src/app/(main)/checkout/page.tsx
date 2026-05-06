"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CreditCard, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/auth";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { currentAddress } = useLocationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(currentAddress?.id || "");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/orders");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add items before checking out
        </p>
        <Link href="/" className="mt-4">
          <Button>Browse Groceries</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4">
        <Link href="/cart">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="flex-1 text-lg font-semibold">Checkout</h1>
      </header>

      <div className="space-y-4 p-4">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            Delivery Address
          </h2>
          <Card
            className={`cursor-pointer transition-all ${
              selectedAddress ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => router.push("/addresses?select=true")}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                {currentAddress ? (
                  <>
                    <h4 className="font-medium">{currentAddress.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentAddress.landmark}
                      {currentAddress.neighborhood && `, ${currentAddress.neighborhood}`}
                    </p>
                  </>
                ) : (
                  <h4 className="font-medium text-muted-foreground">
                    Add delivery address
                  </h4>
                )}
              </div>
              <span className="text-xs text-primary">Change</span>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            Payment Method
          </h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <Card className={`mb-2 cursor-pointer ${paymentMethod === "mpesa" ? "border-primary bg-primary/5" : ""}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <RadioGroupItem value="mpesa" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">M-Pesa</h4>
                  <p className="text-sm text-muted-foreground">Pay with M-Pesa mobile money</p>
                </div>
                <Check className={`h-5 w-5 ${paymentMethod === "mpesa" ? "text-primary" : "text-transparent"}`} />
              </CardContent>
            </Card>

            <Card className={`cursor-pointer ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <RadioGroupItem value="card" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Card</h4>
                  <p className="text-sm text-muted-foreground">Pay with Visa or Mastercard</p>
                </div>
                <Check className={`h-5 w-5 ${paymentMethod === "card" ? "text-primary" : "text-transparent"}`} />
              </CardContent>
            </Card>
          </RadioGroup>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            Order Summary
          </h2>
          <Card>
            <CardContent className="divide-y p-0">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{item.quantity}x</span>
                    <span className="text-sm">{item.product.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    KES {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 p-4">
              <div className="flex w-full justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex w-full justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>KES {deliveryFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex w-full justify-between font-semibold">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </CardFooter>
          </Card>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handlePlaceOrder}
          disabled={isLoading || !selectedAddress}
        >
          {isLoading ? "Placing Order..." : `Place Order - KES ${total.toLocaleString()}`}
        </Button>
      </div>
    </div>
  );
}