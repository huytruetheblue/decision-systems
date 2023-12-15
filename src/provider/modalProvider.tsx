"use client";

import { useEffect, useState } from "react";
import ResultModal from "@/components/modal/ResultModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <ResultModal />
    </>
  );
};
