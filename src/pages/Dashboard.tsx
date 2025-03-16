
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlInput } from "@/components/UrlInput";
import { EmailGenerator } from "@/components/EmailGenerator";
import { EmailPreview } from "@/components/EmailPreview";
import { SavedTemplates } from "@/components/SavedTemplates";
import { generateEmailCopy } from "@/lib/mockData";

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emailCopy, setEmailCopy] = useState<{
    subject: string;
    body: string;
    preheader: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("generate");

  const handleUrlSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    setIsAnalyzing(true);
    
    // Simulate API call to analyze URL and generate email copy
    setTimeout(() => {
      const generatedCopy = generateEmailCopy(submittedUrl);
      setEmailCopy(generatedCopy);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSaveTemplate = () => {
    // In a real app, this would save to a database
    console.log("Saving template:", emailCopy);
    // Show success message or update UI
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
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Generate and manage your email marketing copy.</p>
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
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Track the performance of your email campaigns.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
                      <path d="M3 3v18h18" />
                      <path d="M18 9l-6-6-7 7" />
                      <path d="M14 10l2-2" />
                    </svg>
                    <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      We're working on adding analytics to help you track the performance of your email campaigns.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
