Here is the updated JavaScript/React file with the specified changes applied:

```javascript
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";

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
  emailsOverTime?: { date: string; count: number }[];
  templatesOverTime?: { date: string; count: number }[];
}

export const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [chartData, setChartData] = useState([
    { name: "Jan", emails: 12, templates: 4 },
    { name: "Feb", emails: 18, templates: 5 },
    { name: "Mar", emails: 15, templates: 6 },
    { name: "Apr", emails: 25, templates: 7 },
    { name: "May", emails: 32, templates: 8 },
    { name: "Jun", emails: 28, templates: 9 },
  ]);

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
          emailsOverTime: generateMockTimeSeriesData(6, 5, 30),
          templatesOverTime: generateMockTimeSeriesData(6, 1, 5),
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [user]);

  const generateMockTimeSeriesData = (months: number, minCount: number, maxCount: number) => {
    const data = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount
      });
    }
    
    return data;
  };

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

  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
            <polyline points="17 21 17 13 7 13" />
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
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Email Generation Activity</h3>
                      <ChartContainer 
                        className="h-[300px]"
                        config={{
                          emails: {
                            label: "Emails Generated",
                            theme: {
                              light: "hsl(var(--primary))",
                              dark: "hsl(var(--primary))"
                            }
                          },
                          templates: {
                            label: "Templates Created",
                            theme: {
                              light: "hsl(var(--secondary))",
                              dark: "hsl(var(--secondary))"
                            }
                          }
                        }}
                      >
                        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                          />
                          <Bar 
                            dataKey="emails" 
                            fill="var(--color-emails)" 
                            radius={[4, 4, 0, 0]} 
                            className="fill-primary"
                          />
                          <Bar 
                            dataKey="templates" 
                            fill="var(--color-templates)" 
                            radius={[4, 4, 0, 0]} 
                            className="fill-secondary"
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                labelClassName="text-xs font-medium" 
                              />
                            }
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Activity Trend</h3>
                      <ChartContainer 
                        className="h-[200px]"
                        config={{
                          emails: {
                            label: "Emails Generated",
                            theme: {
                              light: "hsl(var(--primary))",
                              dark: "hsl(var(--primary))"
                            }
                          },
                          templates: {
                            label: "Templates Created",
                            theme: {
                              light: "hsl(var(--secondary))",
                              dark: "hsl(var(--secondary))"
                            }
                          }
                        }}
                      >
                        <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                          />
                          <Line 
                            type="monotone" 
                            strokeWidth={2}
                            dataKey="emails" 
                            activeDot={{