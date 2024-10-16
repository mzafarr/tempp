import { getUserPlanUseCase } from "@/use-cases/subscriptions";
import { ComparisonSection } from "./comparison";
import { HeroSection } from "./hero";
import { PricingSection } from "./pricing";
import { getCurrentUser } from "@/lib/session";
import Navbar from "../_navbar/navbar";

export default async function Home() {
  const user = await getCurrentUser();
  const hasSubscription = user
    ? (await getUserPlanUseCase(user.id)) !== "free"
    : false;
  return (
    <div className="sm:px-8 md:px-12">
      <Navbar />
      <main className="container mx-auto py-12">
        <HeroSection />
        <ComparisonSection />
        <PricingSection hasSubscription={hasSubscription} />
      </main>
    </div>
  );
}
