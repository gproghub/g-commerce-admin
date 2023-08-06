"use client";

import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modals/store-modal";

// We will use this component in the root layout to have it available in all the app.
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // This avoids hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <StoreModal />;
};
