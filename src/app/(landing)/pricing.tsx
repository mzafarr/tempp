import { SignedIn } from "@/components/auth";
import { SignedOut } from "@/components/auth";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { CheckoutButton } from "@/stripe/upgrade-button/checkout-button";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

function PricingCard({
  title,
  price,
  features,
  hasSubscription,
  priceId,
}: {
  title: string;
  price: string;
  priceId: string;
  hasSubscription: boolean;
  features: string[];
}) {
  return (
    <div className="flex overflow-hidden relative flex-col w-full md:w-[23rem] p-6 text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-transparent dark:text-white">
      <div className="glow absolute -z-10 aspect-square w-full max-w-xl rounded-full bg-gradient-to-br from-blue-600/15 to-green-500/15 blur-3xl filter" />
      <h3 className="text-xl font-semibold">{title}</h3>

      <div className="mr-2 text-4xl font-extrabold mb-8 mt-5">
        ${price} / month
      </div>

      <p className="font-light sm:text-lg mb-2 text-left">
        What this plan includes:
      </p>

      <ul role="list" className="mb-8 text-left leading-10">
        {features.map((feature) => (
          <li key={feature} className="flex items-center space-x-3">
            <CheckIcon className="text-green-400 size-5" />
            <span className="dark:text-gray-200">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <SignedIn>
          {hasSubscription ? (
            <Button variant={"default"} asChild>
              <Link href={"/chat"}>Go to Chat Page</Link>
            </Button>
          ) : (
            <CheckoutButton priceId={priceId} className="w-full">
              Upgrade now
            </CheckoutButton>
          )}
        </SignedIn>

        <SignedOut>
          <Button variant={"default"} asChild className="w-full">
            <Link href={"/sign-in"}>Sign in to Upgrade</Link>
          </Button>
        </SignedOut>
      </div>
    </div>
  );
}

export function PricingSection({
  hasSubscription,
}: {
  hasSubscription: boolean;
}) {
  return (
    <section id="pricing">
      <Container>
        <h2 className="mb-5 text-center text-5xl font-bold text-gray-900 dark:text-white">
          Simple pricing for everyone
        </h2>
        <p className="mb-14 max-w-3xl text-center w-full">
          Choose the plan that suits you best. Enjoy full access to premium
          content and expert support. <br className="hidden md:block" /> Start
          your journey today and achieve your goals!
        </p>

        <div className="flex flex-col md:flex-row justify-center w-full gap-12">
          <PricingCard
            title=""
            price="X"
            hasSubscription={hasSubscription}
            priceId={env.NEXT_PUBLIC_PRICE_ID_BASIC}
            features={[
              "Access to a feature",
              "Access to c feature",
              "Access to b feature",
              "Access to d feature",
              "Access to e feature",
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
