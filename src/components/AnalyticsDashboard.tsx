import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
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
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-background/80">
              <CardHeader className="pb-2 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total Emails Generated
                  </CardTitle>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{analytics.totalEmails}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.totalEmails > 10 ? "Great job! Keep creating content." : "Start generating more emails to improve your reach."}
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-background/80">
              <CardHeader className="pb-2 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Saved Templates
                  </CardTitle>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-secondary"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{analytics.totalTemplates}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.totalTemplates > 5 ? "You have a good collection of templates." : "Create more templates to save time."}
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-background/80">
              <CardHeader className="pb-2 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Analyzed Landing Pages
                  </CardTitle>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-purple-500"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{analytics.totalLandingPages}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.totalLandingPages > 3 ? "You're actively analyzing landing pages." : "Analyze more landing pages to improve your emails."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Improved Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <div className="border-b">
              <TabsList className="mb-0 bg-transparent justify-start h-auto p-0">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2 h-10 bg-transparent"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2 h-10 bg-transparent"
                >
                  Recent Activity
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="pt-6">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <CardTitle>Usage Overview</CardTitle>
                      <CardDescription>
                        Your email generation and template usage statistics.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      Last 6 months
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Email Generation Activity</h3>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span>Emails</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-secondary"></div>
                            <span>Templates</span>
                          </div>
                        </div>
                      </div>
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
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Activity Trend</h3>
                        <Badge variant="outline" className="text-xs">Monthly</Badge>
                      </div>
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
                            activeDot={{ r: 6, style: { fill: "var(--color-emails)", opacity: 0.8 } }}
                            style={{ stroke: "var(--color-emails)" }}
                          />
                          <Line 
                            type="monotone" 
                            strokeWidth={2}
                            dataKey="templates" 
                            activeDot={{ r: 6, style: { fill: "var(--color-templates)", opacity: 0.8 } }}
                            style={{ stroke: "var(--color-templates)" }}
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                labelClassName="text-xs font-medium" 
                              />
                            }
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                        </LineChart>
                      </ChartContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Peak Month</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                              <polyline points="16 7 22 7 22 13"></polyline>
                            </svg>
                          </div>
                          <p className="text-2xl font-bold mt-2">May</p>
                          <p className="text-xs text-muted-foreground">32 emails generated</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Avg. Monthly</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                              <path d="M3 6h18"></path>
                              <path d="M3 12h18"></path>
                              <path d="M3 18h18"></path>
                            </svg>
                          </div>
                          <p className="text-2xl font-bold mt-2">21.7</p>
                          <p className="text-xs text-muted-foreground">emails per month</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Growth</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                              <path d="m5 12 5 5 9-9"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </div>
                          <p className="text-2xl font-bold">+133%</p>
                          <p className="text-xs text-muted-foreground">Jan to May</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="pt-6">
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your recent actions and events on the platform.
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Last 10 events</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {analytics.recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-3">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <p className="text-muted-foreground">No recent activity found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analytics.recentActivity.map((event) => (
                        <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="mt-0.5 p-1.5 rounded-full bg-muted">{getEventIcon(event.event_type)}</div>
                          <div className="flex-1">
                            <div className="font-medium">{formatEventType(event.event_type)}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.event_data?.url && (
                                <span>URL: {event.event_data.url}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <p className="text-muted-foreground">No analytics data available.</p>
        </div>
      )}
    </div>
  );
};