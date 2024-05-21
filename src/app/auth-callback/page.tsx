'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/client';
import { useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');
  console.log('this is origin', origin);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await trpc.authCallback.useQuery(undefined);
        if (data?.success) {
          router.push(origin ? `/${origin}` : '/dashboard');
        }
      } catch (err: any) {
        if (err.data?.code === 'UNAUTHORIZED') {
          router.push('/sign-in');
        }
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 500); // Retry every 500ms

    return () => clearInterval(intervalId);
  }, [router, origin]);

  return null; // You can return your UI here if needed
};

export default Page;
