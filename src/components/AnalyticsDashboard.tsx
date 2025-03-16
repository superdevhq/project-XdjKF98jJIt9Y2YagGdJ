
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}

interface AnalyticsSummary {
  totalEmails: number;
  totalTemplates: number;
  totalLandingPages: number;
  recentActivity: AnalyticsEvent[];
}

export const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get email templates count
        const { count: templatesCount, error: templatesError } = await supabase
          .from("email_templates")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        if (templatesError) throw templatesError;
        
        // Get landing pages count
        const { count: landingPagesCount, error: landingPagesError } = await supabase
          .from("landing_pages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        if (landingPagesError) throw landingPagesError;
        
        // Get generated emails count (from analytics events)
        const { count: emailsCount, error: emailsError } = await supabase
          .from("analytics")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("event_type", "generated_email");
        
        if (emailsError) throw emailsError;
        
        // Get recent activity
        const { data: recentActivity, error: recentActivityError } = await supabase
          .from("analytics")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        
        if (recentActivityError) throw recentActivityError;
        
        setAnalytics({
          totalEmails: emailsCount || 0,
          totalTemplates: templatesCount || 0,
          totalLandingPages: landingPagesCount || 0,
          recentActivity: recentActivity || [],
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format event type for display
  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get event icon based on event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'generated_email':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );
      case 'template_saved':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        );
      case 'template_deleted':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        );
      case 'new_landing_page_analysis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : analytics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Emails Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalEmails}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Saved Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalTemplates}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Analyzed Landing Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalLandingPages}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Overview</CardTitle>
                  <CardDescription>
                    Your email generation and template usage statistics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
                        <path d="M3 3v18h18" />
                        <path d="M18 9l-6-6-7 7" />
                        <path d="M14 10l2-2" />
                      </svg>
                      <h3 className="text-lg font-medium">Detailed Analytics Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md">
                        We're working on adding detailed analytics charts to help you track your email marketing performance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and events on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analytics.recentActivity.map((event) => (
                        <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border">
                          <div className="mt-0.5">{getEventIcon(event.event_type)}</div>
                          <div className="flex-1">
                            <div className="font-medium">{formatEventType(event.event_type)}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.event_data?.url && (
                                <span>URL: {event.event_data.url}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(event.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analytics data available.</p>
        </div>
      )}
    </div>
  );
};
