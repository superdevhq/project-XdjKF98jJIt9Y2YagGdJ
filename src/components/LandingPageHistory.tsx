
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface LandingPage {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  created_at: string;
  analyzed_data: any;
}

export const LandingPageHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingPages = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("landing_pages")
          .select("id, url, title, description, keywords, created_at, analyzed_data")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        setLandingPages(data || []);
      } catch (error) {
        console.error("Error fetching landing pages:", error);
        toast({
          title: "Error",
          description: "Failed to load your landing pages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLandingPages();
  }, [user]);
  
  const filteredLandingPages = landingPages.filter(page => 
    page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.title && page.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (page.description && page.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("landing_pages")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      // Update local state
      setLandingPages(landingPages.filter(page => page.id !== id));
      
      // Log analytics event
      await supabase.from("analytics").insert({
        user_id: user.id,
        event_type: "landing_page_deleted",
        event_data: { landing_page_id: id }
      }).catch(err => console.error("Analytics error:", err));
      
      toast({
        title: "Landing page deleted",
        description: "The landing page has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting landing page:", error);
      toast({
        title: "Error",
        description: "Failed to delete the landing page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReanalyze = async (id: string, url: string) => {
    if (!user) return;
    
    try {
      setProcessingId(id);
      
      // Call the edge function to reanalyze the landing page
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase.functions.invoke("analyze-landing-page", {
        body: { url },
      });
      
      if (error) throw error;
      
      // Update the landing page in the database
      if (data.data) {
        // Update local state
        setLandingPages(landingPages.map(page => 
          page.id === id ? { ...page, ...data.data } : page
        ));
        
        toast({
          title: "Landing page reanalyzed",
          description: "The landing page has been reanalyzed successfully.",
        });
      }
    } catch (error) {
      console.error("Error reanalyzing landing page:", error);
      toast({
        title: "Error",
        description: "Failed to reanalyze the landing page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleGenerateEmail = (page: LandingPage) => {
    // Store the selected landing page in localStorage for use in the dashboard
    localStorage.setItem('selectedLandingPage', JSON.stringify(page));
    navigate('/dashboard');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get domain from URL
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Landing Page History</CardTitle>
          <CardDescription>
            View and manage your analyzed landing pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search landing pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredLandingPages.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No landing pages found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? "No landing pages match your search." : "You haven't analyzed any landing pages yet."}
              </p>
              {!searchTerm && (
                <Button className="mt-4" asChild>
                  <Link to="/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Analyze New URL
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLandingPages.map((page) => (
                <div key={page.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                  <div className="space-y-1 mb-4 md:mb-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getDomain(page.url).charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-medium">{page.title || "Untitled Landing Page"}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <a href={page.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {getDomain(page.url)}
                      </a>
                    </p>
                    {page.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {page.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {page.keywords && page.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {keyword}
                        </span>
                      ))}
                      {page.keywords && page.keywords.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          +{page.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Analyzed: {formatDate(page.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateEmail(page)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      Generate Email
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleReanalyze(page.id, page.url)}
                      disabled={processingId === page.id}
                    >
                      {processingId === page.id ? (
                        <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 2v6h-6"></path>
                          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                          <path d="M3 22v-6h6"></path>
                          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                        </svg>
                      )}
                      <span className="sr-only">Reanalyze</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(page.id)}
                      disabled={processingId === page.id}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
