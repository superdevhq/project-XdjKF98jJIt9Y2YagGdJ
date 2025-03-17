Here is the updated code:

```javascript
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        
       