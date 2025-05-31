"use client";

import { BadgeCheck, ArrowRight, Mail } from "lucide-react";
import NumberFlow from "@number-flow/react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createCheckoutSession,
  CreateCheckoutSessionPayload,
} from "@/pages/Home/api/stripe.api";
import { useUser } from "@/contexts/UserProvider";
import { useSubscriptionInfo } from "@/hooks/useSubscription";
import { FaCheckCircle } from "react-icons/fa";
import { SubscriptionPlan } from "@/api/subscription/get-subscription-info.api";

const DEFAULT_CONTACT_EMAIL = "your-default-email@example.com";

export interface PricingTier {
  id: string;
  name: string;
  price: Record<string, number | string>;
  description: string;
  features: string[];
  cta: string;
  actionType: "checkout" | "contact" | "none";
  contactEmail?: string;
  highlighted?: boolean;
  popular?: boolean;
}

interface PricingCardProps {
  tier: PricingTier;
  paymentFrequency: string;
}

const getSubscriptionPlanFromTier = (tierId: string): SubscriptionPlan => {
  switch (tierId) {
    case "individual":
      return SubscriptionPlan.FREE;
    case "artist":
      return SubscriptionPlan.ARTIST_PRO;
    case "studio":
      return SubscriptionPlan.STUDIO;
    case "enterprise":
      return SubscriptionPlan.ENTERPRISE; // Default to free if unknown
    default:
      console.warn(`Unknown tier ID: ${tierId}. Defaulting to FREE plan.`);
      return SubscriptionPlan.FREE;
  }
};

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;
  const { user } = useUser();

  const { data: subscriptionInfo } = useSubscriptionInfo();

  const handleProceedToCheckout = async () => {
    if (tier.actionType !== "checkout") return;

    const planId = tier.id + `_${paymentFrequency}`;

    if (!planId) {
      console.error(
        `Missing Price ID for CHECKOUT action. Tier: ${tier.name}, Interval: ${paymentFrequency}`,
      );
      return;
    }

    try {
      const payload: CreateCheckoutSessionPayload = {
        planId: planId,
        email: user?.email,
        userId: user?.id,
      };
      console.log(`Requesting checkout session for Plan ID: ${payload.planId}`);
      const sessionResult = await createCheckoutSession(payload);
      console.log(
        `Redirecting to ${sessionResult.type} URL: ${sessionResult.url}`,
      );
      window.location.href = sessionResult.url;
    } catch (err) {
      console.error("Checkout session creation failed:", err);
    }
  };

  const getCtaProps = () => {
    if (
      subscriptionInfo &&
      subscriptionInfo.plan === getSubscriptionPlanFromTier(tier.id)
    ) {
      return {
        text: "Current Plan",
        action: undefined,
        icon: FaCheckCircle,
        asChild: false,
        href: undefined,
      };
    }
    switch (tier.actionType) {
      case "checkout":
        return {
          text: tier.cta,
          action: handleProceedToCheckout,
          icon: ArrowRight,
          asChild: false,
          href: undefined,
        };
      case "contact": {
        const email = tier.contactEmail || DEFAULT_CONTACT_EMAIL;
        return {
          text: tier.cta,
          action: undefined,
          icon: Mail,
          asChild: true,
          href: `mailto:${email}?subject=Inquiry about ${tier.name} Plan`,
        };
      }
      case "none":
      default:
        return null;
    }
  };

  const ctaProps = getCtaProps();

  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col gap-8 overflow-hidden p-6 rounded-lg border border-mountain-300",
        isHighlighted
          ? "bg-gradient-to-b from-blue-800 to-purple-800 text-white"
          : "bg-white ",
        isPopular && "border-2 border-indigo-600 ",
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      {/* Tier Name and Popular Badge */}
      <h2 className="flex items-center gap-3 font-medium text-xl capitalize">
        {tier.name}
        {isPopular && (
          <Badge
            variant="secondary"
            className="z-10 bg-indigo-50 mt-1 text-mountain-950"
          >
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      {/* Price Display */}
      <div className="relative h-12">
        {typeof price === "number" ? (
          <>
            <NumberFlow
              format={{
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              }}
              value={price}
              className="font-medium text-4xl"
            />
            <p className="-mt-2 text-muted-foreground text-xs">
              Per month/user
            </p>
          </>
        ) : (
          <h1 className="font-medium text-4xl">{price}</h1>
        )}
      </div>

      {/* Description and Features */}
      <div className="flex-1 space-y-2">
        <h3 className="font-medium text-sm">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                isHighlighted ? "text-mountain-200" : "text-muted-foreground",
              )}
            >
              <BadgeCheck className="flex-shrink-0 w-4 h-4" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Conditional CTA Button/Link */}
      {ctaProps && (
        <Button
          variant={isHighlighted ? "secondary" : "default"}
          className={`z-50  w-full text-mountain-50 cursor-pointer ${isHighlighted ? "bg-mountain-950 hover:bg-mountain-900" : "bg-mountain-50 hover:bg-mountain-100 text-mountain-950 border border-mountain-100"}`}
          onClick={ctaProps.action}
          asChild={ctaProps.asChild}
        >
          {/* Render as link or button based on actionType */}
          {ctaProps.asChild ? (
            <a href={ctaProps.href} target="_blank" rel="noopener noreferrer">
              {ctaProps.text}
              {ctaProps.icon && <ctaProps.icon className="ml-2 w-4 h-4" />}
            </a>
          ) : (
            <>
              {ctaProps.text}
              {ctaProps.icon && <ctaProps.icon className="ml-2 w-4 h-4" />}
            </>
          )}
        </Button>
      )}
    </div>
  );
}

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
);

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
);
