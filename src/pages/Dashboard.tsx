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
import { saveEmailTemplate, logAnalyticsEvent } from "@/services/landingPageService";
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
  const [emailCopy, setEmailCopy] = useState<EmailCopy>({
    subject: "",
    preheader: "",
    body: ""
  });
  const [activeTab, setActiveTab] = useState("generate");
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);

  // Check for selected landing page from history
  useEffect(() => {
    const storedLandingPage = localStorage.getItem('selectedLandingPage');
    if (storedLandingPage) {
      try {
        const parsedData = JSON.parse(storedLandingPage);
        setLandingPageData(parsedData);
        setUrl(parsedData.url);
        
        // Generate email copy if available in analyzed_data
        if (parsedData.analyzed_data?.email_copy) {
          const { email_copy } = parsedData.analyzed_data;
          setEmailCopy({
            subject: email_copy.subject_line || "",
            preheader: email_copy.subject_line || "", // Use subject line as preheader if not provided
            body: email_copy.email_body || "",
          });
        } else {
          // Fallback to old method if no email_copy in analyzed_data
          setEmailCopy(generateEmailCopy(parsedData));
        }
        
        // Clear the stored landing page
        localStorage.removeItem('selectedLandingPage');
        
        // Log analytics event
        logAnalyticsEvent('loaded_from_history', { url: parsedData.url })
          .catch(err => console.error("Analytics error:", err));
      } catch (error) {
        console.error("Error parsing stored landing page:", error);
      }
    }
  }, []);

  const handleUrlSubmit = async (submittedUrl: string) => {
    if (!user) return;
    
    setUrl(submittedUrl);
    setIsAnalyzing(true);
    
    try {
      // Call the edge function to analyze the landing page
      const { data, error } = await supabase.functions.invoke("analyze-landing-page", {
        body: { url: submittedUrl },
      });
      
      if (error) throw error;
      
      if (data.data) {
        setLandingPageData(data.data);
        
        // Generate email copy if available in analyzed_data
        if (data.data.analyzed_data?.email_copy) {
          const { email_copy } = data.data.analyzed_data;
          setEmailCopy({
            subject: email_copy.subject_line || "",
            preheader: email_copy.subject_line || "", // Use subject line as preheader if not provided
            body: email_copy.email_body || "",
          });
        } else {
          // Fallback to old method if no email_copy in analyzed_data
          setEmailCopy(generateEmailCopy(data.data));
        }
      }
      
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
    if (!user || !emailCopy.subject) return;
    
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

  // Function to generate email copy based on landing page data (fallback method)
  const generateEmailCopy = (landingPageData: LandingPageData): EmailCopy => {
    const analyzedData = landingPageData.analyzed_data;
    
    if (!analyzedData) {
      return {
        subject: `Check out: ${landingPageData.title || "our latest offering"}`,
        preheader: landingPageData.description || "We have something special for you",
        body: `Hi there,\n\nWe wanted to share some information about ${landingPageData.title || "our product"}.\n\n${landingPageData.description || ""}\n\nKey points:\n${landingPageData.keywords?.map(point => `• ${point}`).join('\n') || "• Our solution is designed to meet your needs"}\n\nClick below to learn more.\n\n[Learn More]\n\nBest regards,\nThe Team`
      };
    }
    
    return {
      subject: `Discover: ${analyzedData.main_heading || landingPageData.title}`,
      preheader: analyzedData.sub_heading || analyzedData.description || landingPageData.description,
      body: `Hi there,\n\nWe noticed you're interested in ${analyzedData.industry || "innovative"} solutions, and we wanted to share how our product can help you ${(analyzedData.sub_heading || "achieve your goals").toLowerCase()}.\n\n${analyzedData.main_heading || landingPageData.title} is now possible with our innovative solution. Here's what you can expect:\n\n${(analyzedData.key_points || landingPageData.keywords || ["Our solution is designed to meet your needs"]).map((point: string) => `• ${point}`).join('\n')}\n\nReady to transform your business? Click below to get started.\n\n[${analyzedData.cta_text || "Get Started"}]\n\nIf you have any questions, feel free to reply to this email.\n\nBest regards,\nThe Team`
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
            <Link to="/landing-pages">
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
                Landing Pages
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Feedback
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
                  <Link to="/landing-pages">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M7 7h10" />
                      <path d="M7 12h10" />
                      <path d="M7 17h10" />
                    </svg>
                    Landing Pages
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
              <TabsTrigger value="templates">Your Templates</TabsTrigger>
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

              {emailCopy.subject && !isAnalyzing && (
                <div className="grid md:grid-cols-2 gap-6">
                  <EmailGenerator 
                    emailCopy={emailCopy} 
                    setEmailCopy={setEmailCopy} 
                    onSave={handleSaveTemplate}
                    landingPageData={landingPageData}
                    url={url}
                  />
                  <EmailPreview emailCopy={emailCopy} />
                </div>
              )}
              
              {landingPageData && !isAnalyzing && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Landing Page Analysis</CardTitle>
                    <CardDescription>
                      Key information extracted from {url}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Title</h3>
                        <p>{landingPageData.title || "Not detected"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Description</h3>
                        <p>{landingPageData.description || "Not detected"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Key Points</h3>
                        {landingPageData.keywords && landingPageData.keywords.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {landingPageData.keywords.map((keyword, index) => (
                              <li key={index}>{keyword}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No key points detected</p>
                        )}
                      </div>
                      
                      {landingPageData.analyzed_data?.tone && (
                        <div>
                          <h3 className="text-sm font-medium">Tone</h3>
                          <p className="capitalize">{landingPageData.analyzed_data.tone}</p>
                        </div>
                      )}
                      
                      {landingPageData.analyzed_data?.industry && (
                        <div>
                          <h3 className="text-sm font-medium">Industry</h3>
                          <p className="capitalize">{landingPageData.analyzed_data.industry}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
