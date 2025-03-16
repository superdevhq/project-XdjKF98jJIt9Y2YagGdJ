
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlInput } from "@/components/UrlInput";
import { EmailGenerator } from "@/components/EmailGenerator";
import { EmailPreview } from "@/components/EmailPreview";
import { SavedTemplates } from "@/components/SavedTemplates";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { analyzeLandingPage, saveEmailTemplate, logAnalyticsEvent } from "@/services/landingPageService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types for our email copy
interface EmailCopy {
  subject: string;
  preheader: string;
  body: string;
}

// Define types for our landing page data
interface LandingPageData {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  analyzed_data: any;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emailCopy, setEmailCopy] = useState<EmailCopy | null>(null);
  const [activeTab, setActiveTab] = useState("generate");

  const handleUrlSubmit = async (submittedUrl: string) => {
    if (!user) return;
    
    setUrl(submittedUrl);
    setIsAnalyzing(true);
    
    try {
      // Use our service to analyze the landing page
      const landingPageData = await analyzeLandingPage(submittedUrl);
      
      // Generate email copy based on the landing page data
      const generatedCopy = generateEmailCopy(landingPageData);
      setEmailCopy(generatedCopy);
      
      // Log analytics event
      await logAnalyticsEvent('generated_email', { url: submittedUrl });
    } catch (error) {
      console.error("Error analyzing URL:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the landing page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!user || !emailCopy) return;
    
    try {
      await saveEmailTemplate({
        name: `Template from ${url}`,
        subject: emailCopy.subject,
        preheader: emailCopy.preheader,
        body: emailCopy.body
      });
      
      // Log analytics event
      await logAnalyticsEvent('template_saved', { url });
      
      toast({
        title: "Template saved",
        description: "Your email template has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save the template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to generate email copy based on landing page data
  const generateEmailCopy = (landingPageData: LandingPageData): EmailCopy => {
    const analyzedData = landingPageData.analyzed_data;
    
    // In a real app, this would use AI to generate copy based on the landing page data
    // For now, we'll use a simple template
    
    return {
      subject: `Discover: ${analyzedData.main_heading}`,
      preheader: analyzedData.sub_heading || analyzedData.description,
      body: `Hi there,

We noticed you're interested in ${analyzedData.industry} solutions, and we wanted to share how our product can help you ${analyzedData.sub_heading.toLowerCase()}.

${analyzedData.main_heading} is now possible with our innovative solution. Here's what you can expect:

${analyzedData.key_points.map((point: string) => `• ${point}`).join('\n')}

Ready to transform your business? Click below to get started.

[${analyzedData.cta_text}]

If you have any questions, feel free to reply to this email.

Best regards,
The Team`
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
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
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Feedback
            </Button>
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Help
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 3v18" />
                      <path d="M13 7h5" />
                      <path d="M13 11h5" />
                      <path d="M13 15h5" />
                    </svg>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}! Generate and manage your email marketing copy.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="generate">Generate Copy</TabsTrigger>
              <TabsTrigger value="templates">Saved Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Email Copy</CardTitle>
                  <CardDescription>
                    Enter a landing page URL to generate email copy that matches your brand and messaging.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UrlInput onSubmit={handleUrlSubmit} isLoading={isAnalyzing} />
                </CardContent>
              </Card>

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-lg font-medium">Analyzing your landing page...</p>
                  <p className="text-muted-foreground text-center max-w-md">
                    Our AI is extracting key information from your landing page to create compelling email copy.
                  </p>
                </div>
              )}

              {emailCopy && !isAnalyzing && (
                <div className="grid md:grid-cols-2 gap-6">
                  <EmailGenerator 
                    emailCopy={emailCopy} 
                    setEmailCopy={setEmailCopy} 
                    onSave={handleSaveTemplate} 
                  />
                  <EmailPreview emailCopy={emailCopy} />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="templates">
              <SavedTemplates />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
