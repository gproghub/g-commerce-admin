// This hoow allows us to access the window object without hydration errors (window does not exist in the server, only on the browser)

import { useState, useEffect } from 'react';

const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false);
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return '';
  }
  return origin;
};

export default useOrigin;