"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { queryClient } from '@/lib/query-client';

export function Providers({ children }: { children: ReactNode }) {
  // Ensure the client is stable across re-renders in App Router
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
