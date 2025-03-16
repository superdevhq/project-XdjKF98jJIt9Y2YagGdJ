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
            <Link to="/login">
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
          <Link to="/dashboard">
            <Button size="lg" className="px-8">Try for Free</Button>
          </Link>
          <Button size="lg" variant="outline">See How It Works</Button>
        </div>

        {/* Rating badge with avatars */}
        <div className="flex items-center gap-3 bg-accent/50 px-5 py-3 rounded-full animate-in fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex -space-x-2">
            {[
              "https://this-person-does-not-exist.com/img/avatar-gen11a973a9de56e0113dbe0018e76a8f1c.jpg", 
              "https://this-person-does-not-exist.com/img/avatar-gen115b6c2d9e47a7ea9f3f9d20eafc05c6.jpg", 
              "https://this-person-does-not-exist.com/img/avatar-gen1142c2c3e9fa3de63778f0b3a3a3bb52.jpg", 
              "https://this-person-does-not-exist.com/img/avatar-gen11f3432d5ca64d2fae5a8c9d3c3ea8d5.jpg"
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
      <section className="container py-24 space-y-16">
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
                  <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
                </svg>
              )
            },
            {
              title: "Customize & Export",
              description: "Edit the generated copy to your liking and export it for your campaigns.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
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
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
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

      {/* CTA Section */}
      <section className="container py-24 md:py-32">
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your email marketing?</h2>
              <p className="text-xl opacity-90">
                Join thousands of marketers who are saving time and increasing conversions with EmailCraft.
              </p>
            </div>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="px-8 whitespace-nowrap">
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
                AI-powered email copy generation that helps marketers create high-converting campaigns in seconds.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Testimonials</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EmailCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
