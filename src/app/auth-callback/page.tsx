'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { trpc } from '../_trpc/client';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');
  const { data, error } = trpc.authCallback.useQuery();

  useEffect(() => {
    if (error) {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in');
      }
    } else if (data && data.success) {
      router.push(origin ? `/${origin}` : '/dashboard');
    }
  }, [router, error, data, origin]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

const SuspensePage = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
};

export default SuspensePage;
