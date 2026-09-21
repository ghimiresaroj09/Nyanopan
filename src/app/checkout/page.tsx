"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Building2, CheckCircle2, MapPin, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { cart, useCart, useCartSubtotal } from "@/hooks/use-cart";
import { placeOrder } from "@/lib/orders";
import {
  NEPAL_CITIES_AND_DISTRICTS,
  checkoutSchema,
  type CheckoutInput,
} from "@/lib/schemas/checkout";
import { formatPrice } from "@/lib/format";
import type { OrderDraft } from "@/types/user";
import { getSiteConfiguration, fallbackConfig } from "@/lib/api/config";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  orderNote: string;
  companyName: string;
  panVatNumber: string;
  cityOrDistrict: string;
  address: string;
  landmark: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  orderNote: "",
  companyName: "",
  panVatNumber: "",
  cityOrDistrict: "",
  address: "",
  landmark: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines } = useCart();
  const subtotal = useCartSubtotal();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");

  // Fetch WhatsApp number from configuration
  useEffect(() => {
    getSiteConfiguration().then((config) => {
      const number = config?.whatsapp || fallbackConfig.whatsapp;
      // Clean the number - remove any non-digits except leading +
      const cleanNumber = number.replace(/[^\d+]/g, '');
      setWhatsappNumber(cleanNumber);
    });
  }, []);

  // Delivery charges will be discussed via WhatsApp after order confirmation
  const shipping = 0; // Not calculated at checkout
  const total = subtotal; // Total shown without delivery charges

  if (lines.length === 0) {
    return (
      <div className="container-page py-16 md:py-24">
        <h1 className="font-serif text-3xl">Checkout</h1>
        <div className="mt-8 rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Your cart is empty. Add a pair of slippers before checking out.
          </p>
          <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/collections/all-slippers">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const data: CheckoutInput = parsed.data;

    // Build WhatsApp message
    const orderDetails = lines.map((line) => 
      `- ${line.name}\n  Color: ${line.colorName} | Size: ${line.size}\n  Qty: ${line.quantity} x ${formatPrice(line.unitPrice)} = ${formatPrice(line.unitPrice * line.quantity)}`
    ).join('\n\n');

    const message = `*NEW ORDER REQUEST*

*ORDER DETAILS:*
${orderDetails}

*Order Total:* ${formatPrice(subtotal)}
*Delivery charges:* To be confirmed

*CUSTOMER INFORMATION:*
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
${data.alternatePhone ? `Alternate Phone: ${data.alternatePhone}\n` : ''}
*DELIVERY ADDRESS:*
${data.address}
${data.landmark ? `Landmark: ${data.landmark}\n` : ''}City/District: ${data.cityOrDistrict}
${data.companyName ? `\n*COMPANY DETAILS:*\nCompany: ${data.companyName}\n` : ''}${data.panVatNumber ? `PAN/VAT: ${data.panVatNumber}\n` : ''}${data.orderNote ? `\n*ORDER NOTE:*\n${data.orderNote}\n` : ''}
Thank you for your order!`;

    // Create WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Save order locally
    const draft: OrderDraft = {
      userId: "guest",
      email: data.email,
      lines: lines.map((line) => ({
        slug: line.productSlug,
        name: line.name,
        colorName: line.colorName,
        size: line.size,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        image: line.image,
      })),
      address: {
        fullName: data.fullName,
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        cityOrDistrict: data.cityOrDistrict,
        address: data.address,
        landmark: data.landmark,
        companyName: data.companyName,
        panVatNumber: data.panVatNumber,
        orderNote: data.orderNote,
      },
      subtotal,
      shipping: shipping ?? 0,
      total: total ?? subtotal,
    };

    const order = placeOrder(draft);
    cart.clear();
    
    // Redirect to WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      router.push(`/checkout/success?order=${order.number}`);
    }, 500);
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <div className="mt-4 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 border-b border-border/80 pb-4">
        <div>
          <span className="editorial-eyebrow">Direct Checkout</span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-foreground">Complete Your Order</h1>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          No account required &middot; Direct delivery
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start max-w-6xl">
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/* Section 1: General Information */}
          <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/70">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                1
              </span>
              <h2 className="font-serif text-xl text-foreground font-normal">General Information</h2>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  Full Name <span className="text-terracotta">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    id="fullName"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    className="h-11 pl-10 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta"
                  />
                </div>
                {errors.fullName && <p className="mt-1.5 text-xs text-destructive">{errors.fullName}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                    Email <span className="text-terracotta">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    className="h-11 mt-1.5 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                    Phone Number <span className="text-terracotta">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. 98XXXXXXXX"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    className="h-11 mt-1.5 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta"
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="alternatePhone" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  Alternate Phone Number <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                </Label>
                <Input
                  id="alternatePhone"
                  type="tel"
                  placeholder="Secondary phone / relative"
                  value={form.alternatePhone}
                  onChange={(e) => setField("alternatePhone", e.target.value)}
                  className="h-11 mt-1.5 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta"
                />
              </div>

              <div>
                <Label htmlFor="orderNote" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  Order Note <span className="text-muted-foreground font-normal normal-case">(any message for us)</span>
                </Label>
                <textarea
                  id="orderNote"
                  rows={3}
                  placeholder="Specific delivery timing, gift packaging requests, or special handling notes..."
                  value={form.orderNote}
                  onChange={(e) => setField("orderNote", e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border/80 bg-background/90 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Company Information */}
          <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/70">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                2
              </span>
              <div className="flex items-baseline gap-2">
                <h2 className="font-serif text-xl text-foreground font-normal">Company Information</h2>
                <span className="text-xs text-muted-foreground font-normal">(Optional for billing)</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="companyName" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  Company Name
                </Label>
                <div className="relative mt-1.5">
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    id="companyName"
                    placeholder="Registered business name"
                    value={form.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    className="h-11 pl-10 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="panVatNumber" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  PAN/VAT Number
                </Label>
                <Input
                  id="panVatNumber"
                  placeholder="e.g. 600XXXXXX"
                  value={form.panVatNumber}
                  onChange={(e) => setField("panVatNumber", e.target.value)}
                  className="h-11 mt-1.5 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta font-mono"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Delivery Address */}
          <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/70">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                3
              </span>
              <h2 className="font-serif text-xl text-foreground font-normal">Delivery Address</h2>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="cityOrDistrict" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  City / District <span className="text-terracotta">*</span>
                </Label>
                <Select
                  value={form.cityOrDistrict}
                  onValueChange={(value) => setField("cityOrDistrict", value)}
                >
                  <SelectTrigger id="cityOrDistrict" className="h-11 mt-1.5 border-border/80 bg-background/90 text-sm">
                    <SelectValue placeholder="Choose your city or district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {NEPAL_CITIES_AND_DISTRICTS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cityOrDistrict && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.cityOrDistrict}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  Address <span className="text-terracotta">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    id="address"
                    autoComplete="street-address"
                    placeholder="Street name, tole, ward number, house number"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    aria-invalid={Boolean(errors.address)}
                    className="h-11 pl-10 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta"
                  />
                </div>
                {errors.address && <p className="mt-1.5 text-xs text-destructive">{errors.address}</p>}
              </div>

              <div>
                <Label htmlFor="landmark" className="text-xs uppercase tracking-wider font-semibold text-foreground">
                  Landmark <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                </Label>
                <Input
                  id="landmark"
                  placeholder="Nearby temple, school, hospital, chowk or grocery store"
                  value={form.landmark}
                  onChange={(e) => setField("landmark", e.target.value)}
                  className="h-11 mt-1.5 border-border/80 bg-background/90 text-sm focus-visible:ring-terracotta"
                />
              </div>
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            className="w-full h-13 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium shadow-md transition-transform active:scale-[0.99]"
            disabled={submitting}
          >
            {submitting ? "Processing Order..." : `Place Order — ${formatPrice(subtotal)}`}
          </Button>
        </form>

        {/* Order Summary Aside */}
        <aside className="rounded-xl border border-border/80 bg-[#fbf8f2] p-6 shadow-xs sticky top-24">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">Order Summary</h2>
          <ul className="mt-4 divide-y divide-border/60">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-3 py-3">
                <div className="relative shrink-0">
                  <div className="relative h-14 w-14 rounded-md border border-border/70 bg-background p-1 overflow-hidden">
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground font-mono">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{line.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {line.colorName} &middot; Size {line.size}
                  </p>
                </div>
                <span className="font-serif text-sm text-foreground">
                  {formatPrice(line.unitPrice * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <Separator className="my-4 border-border/70" />

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-serif text-sm text-foreground">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-medium text-foreground text-right text-[11px] leading-tight max-w-[140px]">
                To be confirmed via WhatsApp
              </span>
            </div>

            {total !== null && (
              <div className="flex items-center justify-between border-t border-border/70 pt-3 text-sm">
                <span className="font-medium text-foreground">Order Total</span>
                <span className="font-serif text-lg font-semibold text-primary">{formatPrice(total)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-border/70 bg-background/80 p-3.5 space-y-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Cash on Delivery / Direct Bank Transfer</span>
            </div>
            <p>
              Your order is packed in our Kathmandu workshop and dispatched directly to your doorstep. Delivery charges will be confirmed via WhatsApp based on your location.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
