'use client';

import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/use-store-modal';

// This components is to trigger the modal
const SetupPage = () => {
  const { isOpen, onOpen } = useStoreModal();

  // Ensures the store modal is always open
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};
export default SetupPage;
