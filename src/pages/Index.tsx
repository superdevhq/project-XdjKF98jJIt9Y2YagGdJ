
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
return (
<div className="min-h-screen flex flex-col">
{/* Header */}
{/* ... keep existing code (header section) the same ... */}

{/* Hero Section */}
{/* ... keep existing code (hero section) the same ... */}

{/* Features Section */}
{/* ... keep existing code (features section) the same ... */}

{/* Testimonials */}
{/* ... keep existing code (testimonials section) the same ... */}

{/* Pricing Section */}
<section className="container py-24 space-y-12">
  <div className="text-center space-y-4">
    <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
      Choose the plan that's right for your business needs
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-8">
    {[
      {
        name: "Starter",
        price: "$0",
        description: "Perfect for trying out EmailCraft",
        features: [
          "5 emails per month",
          "Basic templates",
          "24-hour support",
          "Landing page analysis"
        ],
        cta: "Start for Free",
        popular: false
      },
      {
        name: "Professional",
        price: "$29",
        period: "/month",
        description: "Everything you need for growing businesses",
        features: [
          "50 emails per month",
          "Advanced templates",
          "Priority support",
          "Advanced analytics",
          "Custom branding"
        ],
        cta: "Get Started",
        popular: true
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        description: "For teams with advanced email needs",
        features: [
          "Unlimited emails",
          "Custom templates",
          "Dedicated support",
          "Advanced integrations",
          "Team collaboration",
          "API access"
        ],
        cta: "Contact Sales",
        popular: false
      }
    ].map((plan, index) => (
      <div 
        key={index} 
        className={`flex flex-col p-8 rounded-xl border ${plan.popular ? 'border-primary shadow-lg relative' : 'border-border'}`}
      >
        {plan.popular && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{plan.price}</span>
            {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
          </div>
          <p className="text-muted-foreground">{plan.description}</p>
        </div>
        <div className="mt-8 space-y-4 flex-grow">
          <ul className="space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button 
          className={`mt-8 ${plan.popular ? '' : 'bg-background text-foreground border hover:bg-accent'}`}
          variant={plan.popular ? 'default' : 'outline'}
          size="lg"
        >
          {plan.cta}
        </Button>
      </div>
    ))}
  </div>
</section>

{/* FAQ Section */}
<section className="container py-24 space-y-12 bg-accent/30 rounded-xl">
  <div className="text-center space-y-4">
    <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
      Everything you need to know about EmailCraft
    </p>
  </div>

  <div className="max-w-3xl mx-auto space-y-6">
    {[
      {
        question: "How does EmailCraft analyze my landing page?",
        answer: "EmailCraft uses advanced AI to scan your landing page content, including headlines, copy, images, and CTAs. It then extracts key messaging points, tone, and style to generate email copy that matches your brand voice and effectively communicates your value proposition."
      },
      {
        question: "Can I edit the generated email copy?",
        answer: "Absolutely! While our AI generates high-quality email copy, you have complete control to edit, refine, and customize the content to perfectly match your needs. Our editor makes it easy to make changes before exporting."
      },
      {
        question: "Is there a limit to how many landing pages I can analyze?",
        answer: "The number of landing pages you can analyze depends on your subscription plan. Free users can analyze up to 5 pages per month, while paid plans offer higher or unlimited usage."
      },
      {
        question: "Does EmailCraft integrate with email marketing platforms?",
        answer: "Yes! EmailCraft integrates with popular email marketing platforms like Mailchimp, HubSpot, ConvertKit, and more. You can export your generated emails directly to these platforms with just a few clicks."
      },
      {
        question: "What if I'm not satisfied with the generated email?",
        answer: "We stand behind our AI technology. If you're not happy with the results, you can regenerate the email with different parameters or contact our support team for assistance. Paid plans come with priority support to ensure your satisfaction."
      }
    ].map((faq, index) => (
      <div key={index} className="border-b border-border pb-6">
        <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
        <p className="text-muted-foreground">{faq.answer}</p>
      </div>
    ))}
  </div>
</section>

{/* CTA Section */}
{/* ... keep existing code (CTA section) the same ... */}

{/* Footer */}
{/* ... keep existing code (footer section) the same ... */}
</div>
);
};

export default Index;
