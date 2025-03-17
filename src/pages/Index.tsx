import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" />
              <path d="M3 8h18" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
            <span className="text-xl font-bold">EmailCraft</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/login?tab=signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter animate-in slide-in-from-top">
            Transform Landing Pages into <span className="text-primary">Compelling Emails</span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl animate-in slide-in-from-top" style={{ animationDelay: "0.1s" }}>
            Generate high-converting email copy in seconds using AI that analyzes your landing pages.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
          <Link to="/login">
            <Button size="lg" className="px-8">Try for Free</Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline">See How It Works</Button>
          </a>
        </div>

        {/* Rating badge with avatars */}
        <div className="flex items-center gap-3 bg-accent/50 px-5 py-3 rounded-full animate-in fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex -space-x-2">
            {[
              "https://randomuser.me/api/portraits/women/44.jpg", 
              "https://randomuser.me/api/portraits/men/32.jpg", 
              "https://randomuser.me/api/portraits/women/68.jpg", 
              "https://randomuser.me/api/portraits/men/75.jpg"
            ].map((avatar, index) => (
              <div 
                key={index} 
                className="h-7 w-7 rounded-full border-2 border-background bg-muted overflow-hidden"
              >
                <img 
                  src={avatar} 
                  alt={`User avatar ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <svg 
                  key={index}
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={index < 4.5 ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={`w-4 h-4 ${index < 4.5 ? "text-yellow-500" : "text-gray-300"}`}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="font-medium">4.8/5</span>
            <span className="text-muted-foreground text-sm">from 2,000+ reviews</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="container py-24 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How EmailCraft Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes your landing pages to create email copy that matches your brand voice and drives conversions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Paste Your URL",
              description: "Simply enter your landing page URL and our AI will analyze the content.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              )
            },
            {
              title: "Generate Copy",
              description: "Our AI creates email copy that matches your brand voice and messaging.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                  <path d="M12 3v12" />
                  <path d="m8 11 4 4 4-4" />
                  <path d="M8 17h8" />
                </svg>
              )
            },
            {
              title: "Customize & Export",
              description: "Edit the generated copy to your liking and export it for your campaigns.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 13h8" />
                  <path d="M8 17h8" />
                  <path d="M8 9h2" />
                </svg>
              )
            }
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-accent py-24">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Loved by Marketers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about EmailCraft.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "EmailCraft has cut my email writing time in half. The copy it generates is on-brand and converts really well.",
                author: "Sarah Johnson",
                role: "Marketing Director"
              },
              {
                quote: "I was skeptical at first, but the quality of the email copy is impressive. It's like having an expert copywriter on demand.",
                author: "Michael Chen",
                role: "E-commerce Owner"
              },
              {
                quote: "Our email open rates increased by 32% after we started using EmailCraft. The subject lines it generates are particularly effective.",
                author: "Jessica Miller",
                role: "Email Marketing Specialist"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 rounded-lg border bg-card shadow-sm">
                <div className="space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                  </svg>
                  <p className="text-lg">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="container py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">See the Magic in Action</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how EmailCraft transforms landing pages into engaging emails in real-time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-accent/30 p-6 rounded-lg border border-border/50 relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="pt-6">
                <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-hidden">
                  <p className="text-primary-foreground/70">// Landing page content</p>
                  <p className="mt-2"><span className="text-blue-400">const</span> <span className="text-yellow-400">headline</span> = <span className="text-green-400">"Boost Your Productivity with TaskMaster Pro"</span>;</p>
                  <p><span className="text-blue-400">const</span> <span className="text-yellow-400">subheading</span> = <span className="text-green-400">"The all-in-one task management solution"</span>;</p>
                  <p><span className="text-blue-400">const</span> <span className="text-yellow-400">features</span> = [<span className="text-green-400">"Smart task prioritization"</span>, <span className="text-green-400">"Team collaboration"</span>, <span className="text-green-400">"Progress analytics"</span>];</p>
                  <p className="mt-2 text-primary-foreground/70">// EmailCraft analyzing...</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary">
                <path d="M12 5v14"></path>
                <path d="m19 12-7 7-7-7"></path>
              </svg>
            </div>

            <div className="bg-accent/30 p-6 rounded-lg border border-border/50 relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="pt-6">
                <div className="bg-muted p-4 rounded-md font-mono text-sm">
                  <p className="text-primary-foreground/70">// Generated email content</p>
                  <p className="mt-2"><span className="text-blue-400">const</span> <span className="text-yellow-400">subject</span> = <span className="text-green-400">"Transform Your Workflow with TaskMaster Pro"</span>;</p>
                  <p><span className="text-blue-400">const</span> <span className="text-yellow-400">greeting</span> = <span className="text-green-400">"Hi there,"</span>;</p>
                  <p><span className="text-blue-400">const</span> <span className="text-yellow-400">body</span> = <span className="text-green-400">"Struggling with task management? TaskMaster Pro helps you prioritize tasks, collaborate with your team, and track progress all in one place."</span>;</p>
                  <p><span className="text-blue-400">const</span> <span className="text-yellow-400">cta</span> = <span className="text-green-400">"Try TaskMaster Pro Free"</span>;</p>
                  <p className="mt-2 text-primary-foreground/70">// Email ready to send!</p>
                  <p className="text-green-400 mt-1">✓ Conversion optimized</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"></path>
                    <path d="M14 22V13a2 2 0 0 0-4 0v9"></path>
                    <path d="M18 22V13a2 2 0 0 0-4 0v9"></path>
                    <path d="M22 9V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Smart Content Analysis</h3>
              </div>
              <p className="text-muted-foreground">
                Our AI doesn't just copy your landing page—it understands the intent, value proposition, and key selling points to craft emails that drive action.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Tone Matching</h3>
              </div>
              <p className="text-muted-foreground">
                EmailCraft preserves your brand voice, whether it's professional, conversational, or technical, ensuring consistent messaging across all channels.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Conversion Optimized</h3>
              </div>
              <p className="text-muted-foreground">
                Every email is structured to maximize open rates, click-throughs, and conversions with proven psychological triggers and persuasive techniques.
              </p>
            </div>

            <Link to="/login">
              <Button size="lg" className="mt-4">
                Try It Yourself
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container py-24 space-y-12">
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
              popular: false,
              link: "/login"
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
              popular: true,
              link: "/login?plan=professional"
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
              popular: false,
              link: "/login?plan=enterprise"
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={plan.link}>
                <Button 
                  className={`mt-8 w-full ${plan.popular ? '' : 'bg-background text-foreground border hover:bg-accent'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
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
      <section className="container py-24 md:py-32">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-primary-foreground p-8 md:p-12 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your email marketing?</h2>
              <p className="text-xl opacity-90">
                Join thousands of marketers who are saving time and increasing conversions with EmailCraft.
              </p>
            </div>
            <Link to="/login?tab=signup">
              <Button size="lg" variant="secondary" className="px-8 whitespace-nowrap hover:bg-white/90 hover:text-indigo-700 transition-colors">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" />
                  <path d="M3 8h18" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
                <span className="text-xl font-bold">EmailCraft</span>
              </div>
              <p className="text-muted-foreground">
                Turn landing pages into compelling emails in seconds with our AI-powered platform.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Pricing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Integrations</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Changelog</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Community</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">API Documentation</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;