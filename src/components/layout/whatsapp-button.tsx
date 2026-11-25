"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string;
}

export function WhatsAppButton({ phone }: WhatsAppButtonProps) {
  const number = phone.replace(/\D/g, "");

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="whatsapp-float fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:bottom-7 sm:right-7"
    >
      <MessageCircle aria-hidden="true" className="size-7 fill-white stroke-[#25D366]" strokeWidth={2.5} />
      <span className="sr-only">Open WhatsApp chat</span>
    </a>
  );
}
