"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail, MessageCircle, Send } from "lucide-react";
import { submitContactForm } from "@/actions/contact.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ContactSectionProps {
  showBackButton?: boolean;
}

export default function ContactSection({ showBackButton = false }: ContactSectionProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return toast.error("Please fill in all fields.");
    }

    setIsSubmitting(true);

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        toast.success("Thank you! Your message has been sent successfully.");
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(res.error || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden border-y border-blue-100 bg-slate-50 px-4 py-20 text-slate-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-cyan-50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Optional Back Button */}
        {showBackButton && (
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={() => router.back()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-100 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition-all hover:border-cyan-300 hover:text-cyan-700"
            >
              <ArrowLeft className="h-4 w-4 text-cyan-600" />
              <span>Back</span>
            </button>
          </div>
        )}

        <div className="mb-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-1 w-7 rounded-full bg-cyan-500"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
              CONTACT US
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Get In Touch
          </h2>
          <p className="text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
            Any question? Reach out to us and we&apos;ll get back to you shortly.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
          {/* WhatsApp / Phone */}
          <a
            href="https://wa.me/+16038157315"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 transition-transform group-hover:scale-105">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="text-base font-bold text-slate-800 transition-colors group-hover:text-cyan-700 sm:text-lg">
              +1 (603) 815-7315
            </span>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/qfs_secureguard_portal"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 transition-transform group-hover:scale-105">
              <Send className="ml-0.5 h-5 w-5" />
            </div>
            <span className="text-base font-bold text-slate-800 transition-colors group-hover:text-cyan-700 sm:text-lg">
              Join us on Telegram
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:qauntumsecureguard@gmail.com"
            className="group flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 transition-transform group-hover:scale-105">
              <Mail className="h-5 w-5" />
            </div>
            <span className="break-all text-xs font-bold text-slate-800 transition-colors group-hover:text-cyan-700 sm:text-sm">
              qauntumsecureguard@gmail.com
            </span>
          </a>
          </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full rounded-xl border border-blue-100 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-900 placeholder-slate-400 shadow-inner transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded-xl border border-blue-100 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-900 placeholder-slate-400 shadow-inner transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-blue-100 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-900 placeholder-slate-400 shadow-inner transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          {/* Success Notification */}
          {submitted && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>Your message has been sent successfully. We will get back to you shortly!</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-cyan-600 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-cyan-500 hover:shadow-cyan-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <span>Submit Message</span>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </section>
  );
}
