
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* ...keep existing Header */}

      {/* Hero Section */}
      {/* ...keep existing Hero Section */}

      {/* Features Section */}
      {/* ...keep existing Features Section */}

      {/* Testimonials */}
      {/* ...keep existing Testimonials */}

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
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                    <path d="M10 2c1 .5 2 2 2 5"></path>
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
                    <path d="m9 12 2 2 4-4"></path>
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
      {/* ...keep existing Pricing Section */}

      {/* FAQ Section */}
      {/* ...keep existing FAQ Section */}

      {/* CTA Section */}
      {/* ...keep existing CTA Section */}

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
              {/* ...keep existing footer links */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
