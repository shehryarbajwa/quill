import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  {
    /*This refers to the params in the url*/
  }
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  
};

export default Page;
