import { Check, X } from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section className="py-12">
      <h2 className="max-w-[720px] mx-auto text-center font-extrabold text-4xl md:text-5xl tracking-tight mb-12 md:mb-20">
        Why Traditional Freight Brokerage Learning is Outdated
        {/* Traditional Freight Brokerage Learning vs. AI-Driven Learning */}
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
        <ComparisonCard
          title="Learning Freight Brokerage Without AI Assistance"
          items={[
            "Spend hours reading through textbooks and static materials",
            "Struggle to stay engaged with outdated content",
            "Limited access to personalized feedback",
            "Lack of real-world practice and simulations",
            "Slow progress, difficult to retain complex concepts",
          ]}
          bgClass="bg-red-100/75 dark:bg-red-800/75"
          textClass="text-red-700 dark:text-red-300"
          icon={X}
        />
        <ComparisonCard
          title="Learning Freight Brokerage with AI Assistance"
          items={[
            "Engage with dynamic, interactive lessons tailored to your pace",
            "Stay motivated with engaging, real-world case studies and quizzes",
            "Receive instant feedback and personalized guidance",
            "Practice with real-world freight brokerage scenarios",
            "Progress quickly and retain concepts with ease",
          ]}
          bgClass="bg-emerald-100/70 dark:bg-emerald-800/70"
          textClass="text-emerald-700 dark:text-emerald-300"
          icon={Check}
        />
      </div>
    </section>
  );
};

const ComparisonCard = ({
  title,
  items,
  bgClass,
  textClass,
  icon: Icon,
}: any) => {
  return (
    <div
      className={`${bgClass} ${textClass} p-8 md:p-10 rounded-lg w-full sm:h-[385px] max-w-md`}
    >
      <h3 className="font-extrabold tracking-tight text-[19px] mb-6">
        {title}
      </h3>
      <ul className="list-disc list-inside space-y-2">
        {items.map((item: any, index: any) => (
          <li key={index} className="flex gap-3 text-[15px]">
            <Icon className="w-4 h-4 mt-1" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
