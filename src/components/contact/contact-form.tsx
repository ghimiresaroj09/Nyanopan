"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you for reaching out! We'll get back to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        // Handle specific error messages from backend
        const errorMessage = data.error || "Failed to submit form";
        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Unable to submit the form. Please try again or email us directly at hello@nyanopan.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#ece4d5] p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-normal text-[#28221c] mb-6">
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#28221c] mb-2"
          >
            Name <span className="text-[#c85a54]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-[#d8ccb6] bg-[#fbf9f5] text-[#28221c] placeholder-[#a39885] focus:outline-none focus:ring-2 focus:ring-[#a4642d] focus:border-transparent transition-all"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#28221c] mb-2"
          >
            Email <span className="text-[#c85a54]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-[#d8ccb6] bg-[#fbf9f5] text-[#28221c] placeholder-[#a39885] focus:outline-none focus:ring-2 focus:ring-[#a4642d] focus:border-transparent transition-all"
            placeholder="your@email.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[#28221c] mb-2"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-[#d8ccb6] bg-[#fbf9f5] text-[#28221c] placeholder-[#a39885] focus:outline-none focus:ring-2 focus:ring-[#a4642d] focus:border-transparent transition-all"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-[#28221c] mb-2"
          >
            Subject <span className="text-[#c85a54]">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-[#d8ccb6] bg-[#fbf9f5] text-[#28221c] focus:outline-none focus:ring-2 focus:ring-[#a4642d] focus:border-transparent transition-all"
          >
            <option value="">Select a subject</option>
            <option value="Product Inquiry">Product Inquiry</option>
            <option value="Order Status">Order Status</option>
            <option value="Shipping">Shipping</option>
            <option value="Returns & Exchanges">Returns & Exchanges</option>
            <option value="Wholesale">Wholesale Inquiry</option>
            <option value="Partnership">Partnership Opportunity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-[#28221c] mb-2"
          >
            Message <span className="text-[#c85a54]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2.5 rounded-lg border border-[#d8ccb6] bg-[#fbf9f5] text-[#28221c] placeholder-[#a39885] focus:outline-none focus:ring-2 focus:ring-[#a4642d] focus:border-transparent transition-all resize-none"
            placeholder="Tell us how we can help you..."
          />
        </div>

        {/* Submit Status Messages */}
        {submitStatus.type && (
          <div
            className={`p-4 rounded-lg text-sm ${
              submitStatus.type === "success"
                ? "bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7]"
                : "bg-[#ffebee] text-[#c62828] border border-[#ef9a9a]"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#28221c] text-[#fbf9f5] hover:bg-[#3d362e] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm rounded-full h-12 px-6 text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-[#a39885] text-center">
          By submitting this form, you agree to our{" "}
          <a href="/privacy-policy" className="text-[#a4642d] hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}
