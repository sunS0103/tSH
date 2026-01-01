"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader } from "@/components/ui/loader";

function RouteLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return <Loader show={isLoading} />;
}

export function RouteLoader() {
  return (
    <Suspense fallback={null}>
      <RouteLoaderContent />
    </Suspense>
  );
}
