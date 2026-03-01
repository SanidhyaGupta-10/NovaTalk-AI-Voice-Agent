import { PricingTable } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SubscriptionsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    return (
        <div className="min-h-screen bg-[#f8f4e9] pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#212a3b] mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-[#3d485e] max-w-2xl mx-auto">
                        Unlock more books, longer sessions, and advanced features with our premium plans.
                    </p>
                </div>

                <div className="pricing-table-wrapper">
                    <PricingTable 
                        /* Clerk Billing configuration is typically handled in the Clerk Dashboard. 
                           The component will automatically render based on the configured plans. */
                    />
                </div>
            </div>
        </div>
    );
}
