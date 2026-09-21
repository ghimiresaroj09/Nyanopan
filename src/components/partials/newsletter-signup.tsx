"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newsletterSchema } from "@/lib/schemas/newsletter";
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  className?: string;
}

export function NewsletterSignup({ className }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Validate email
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to subscribe. Please try again.");
        toast.error(data.message || "Subscription failed");
        return;
      }

      // Success
      setEmail("");
      toast.success("You are subscribed. Welcome aboard!");
    } catch (err) {
      console.error("Subscription error:", err);
      setError("An error occurred. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={cn("border-t border-border/70 bg-[#f7f2e8] py-18 md:py-24", className)}>
      <div className="container-page max-w-2xl text-center">
        <span className="editorial-eyebrow justify-center">The Himalayan Dispatch</span>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-foreground">
          Stories of craft, care, and mountain living
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Receive seasonal dispatches from our Kathmandu atelier, notes on natural wool care,
          and early access to small-batch Lungta releases.
        </p>
        <form onSubmit={onSubmit} noValidate className="mx-auto mt-8 max-w-md">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="newsletter-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={Boolean(error)}
                className="h-12 border-border/80 bg-background/90 px-4 text-sm shadow-2xs focus-visible:ring-terracotta"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 bg-primary px-7 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          {error && (
            <p role="alert" className="mt-2 text-left text-xs text-destructive">
              {error}
            </p>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground/80">
            Never spam. Respectful notes twice a month. Unsubscribe with one click.
          </p>
        </form>
      </div>
    </section>
  );
}
