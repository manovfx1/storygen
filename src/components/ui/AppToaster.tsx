"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      theme="dark"
      richColors
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "glass-card border border-border/60",
        },
      }}
    />
  );
}
