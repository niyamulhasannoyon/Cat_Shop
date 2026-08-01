"use client";

import React, { useEffect } from "react";

interface ToastNotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function ToastNotification({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeStyles = {
    success: "bg-emerald-900/90 border-emerald-500/30 text-emerald-100",
    error: "bg-rose-900/90 border-rose-500/30 text-rose-100",
    info: "bg-sky-900/90 border-sky-500/30 text-sky-100",
  };

  const icons = {
    success: "✓",
    error: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${typeStyles[type]} text-xs font-semibold`}
      >
        <span className="text-sm">{icons[type]}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
