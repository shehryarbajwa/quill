'use client';

import { getUserSubscriptionPlan } from '@/lib/stripe';
import { useToast } from './ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import MaxWidthWrapper from './MaxWidthWrapper';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Loader, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { toast } = useToast();

  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;

      if (!url) {
        toast({
          title: 'There was a problem',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    },
  });
  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{' '}
              <strong>{subscriptionPlan.name} plan</strong>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {subscriptionPlan.isSubscribed
                ? 'Manage Subscription'
                : 'Upgrade to Pro Plan'}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-sx font-medium">
                {subscriptionPlan.isCanceled
                  ? 'Your plan will be cancelled on '
                  : 'Your plan renews on '}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
