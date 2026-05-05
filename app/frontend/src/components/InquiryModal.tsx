import { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import { createClient } from "@metagptx/web-sdk";
import type { Product } from "@/data/products";

interface InquiryModalProps {
  product: Product;
  selectedVolume: number;
  isOpen: boolean;
  onClose: () => void;
}

const client = createClient();

export default function InquiryModal({ product, selectedVolume, isOpen, onClose }: InquiryModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Пожалуйста, укажите ваше имя");
      return;
    }
    if (!customerPhone.trim() && !customerEmail.trim()) {
      setError("Пожалуйста, укажите телефон или email для связи");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await client.apiCall.invoke({
        url: "/api/v1/inquiry/submit",
        method: "POST",
        data: {
          product_name: product.name,
          product_brand: product.brand,
          volume: `${selectedVolume} мл`,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email: customerEmail.trim(),
          message: message.trim(),
        },
      });
      setSubmitted(true);
    } catch {
      setError("Произошла ошибка при отправке. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setMessage("");
    setSubmitted(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1A1A1A] border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h2 className="text-white text-base font-medium">Уточнить наличие</h2>
            <p className="text-[#C69B56]/70 text-xs mt-0.5">
              {product.brand} — {product.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="p-8 flex flex-col items-center text-center">
            <CheckCircle size={48} className="text-[#C69B56] mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">Запрос отправлен!</h3>
            <p className="text-white/50 text-sm mb-6">
              Мы свяжемся с вами в ближайшее время для уточнения наличия товара.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-[#C69B56] text-black text-sm font-medium hover:bg-[#d4aa65] transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Selected volume info */}
            <div className="bg-white/5 border border-white/5 px-4 py-3">
              <span className="text-white/40 text-xs">Объём:</span>
              <span className="text-[#C69B56] text-sm ml-2">{selectedVolume} мл</span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-white/60 text-xs mb-1.5">
                Ваше имя <span className="text-[#C69B56]">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none transition-colors placeholder:text-white/20"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/60 text-xs mb-1.5">
                Телефон
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+375 (29) 123-45-67"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none transition-colors placeholder:text-white/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none transition-colors placeholder:text-white/20"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-white/60 text-xs mb-1.5">
                Сообщение
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Дополнительные пожелания или вопросы..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none transition-colors placeholder:text-white/20 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#C69B56] text-black text-sm font-medium py-3 hover:bg-[#d4aa65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {submitting ? "Отправка..." : "Отправить запрос"}
            </button>

            <p className="text-white/30 text-[10px] text-center">
              Укажите телефон или email, чтобы мы могли связаться с вами
            </p>
          </form>
        )}
      </div>
    </div>
  );
}