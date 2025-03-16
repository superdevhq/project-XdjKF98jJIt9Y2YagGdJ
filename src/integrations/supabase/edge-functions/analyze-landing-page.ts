
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Define types
interface WebsiteData {
  title: string;
  description: string;
  main_heading: string;
  sub_heading: string;
  cta_text: string;
  key_points: string[];
  tone: string;
  industry: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OPTIONS request for CORS
export const corsHandler = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }
}

// Main function
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = corsHandler(req)
  if (corsResponse) return corsResponse

  // Get the authorization header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing Authorization header' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  )

  // Get the JWT user
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Parse request body
    const { url } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if we've already analyzed this URL for this user
    const { data: existingData, error: fetchError } = await supabaseClient
      .from('landing_pages')
      .select('*')
      .eq('user_id', user.id)
      .eq('url', url)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (existingData) {
      // Log analytics event for reusing existing data
      await supabaseClient.from('analytics').insert({
        user_id: user.id,
        event_type: 'reused_landing_page',
        event_data: { url }
      })

      return new Response(
        JSON.stringify({ 
          message: 'Retrieved existing analysis',
          data: existingData 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // In a real implementation, we would fetch and analyze the landing page here
    // For this demo, we'll simulate the analysis with mock data

    // Determine the type of landing page based on the URL
    let mockAnalyzedData: WebsiteData

    if (url.includes('webinar')) {
      mockAnalyzedData = {
        title: "Webinar Landing Page",
        description: "Sign up for our exclusive webinar on digital marketing strategies.",
        main_heading: "Join Our Exclusive Webinar",
        sub_heading: "Learn cutting-edge marketing techniques from industry experts",
        cta_text: "Reserve Your Spot",
        key_points: [
          "Live Q&A with marketing experts",
          "Actionable strategies you can implement immediately",
          "Free resources and templates"
        ],
        tone: "educational",
        industry: "marketing"
      }
    } else if (url.includes('product')) {
      mockAnalyzedData = {
        title: "Product Landing Page",
        description: "Discover our innovative product that solves your biggest challenges.",
        main_heading: "Introducing Our Revolutionary Product",
        sub_heading: "The solution you've been waiting for",
        cta_text: "Buy Now",
        key_points: [
          "40% more efficient than competitors",
          "Easy integration with your existing tools",
          "24/7 customer support"
        ],
        tone: "professional",
        industry: "technology"
      }
    } else {
      mockAnalyzedData = {
        title: "Generic Landing Page",
        description: "This is a generic landing page description.",
        main_heading: "Transform Your Business Today",
        sub_heading: "Increase efficiency and reduce costs",
        cta_text: "Get Started",
        key_points: [
          "Feature 1: Boost productivity",
          "Feature 2: Streamline workflows",
          "Feature 3: Enhance collaboration"
        ],
        tone: "professional",
        industry: "business"
      }
    }

    // Store the analyzed data in Supabase
    const { data: newLandingPage, error: insertError } = await supabaseClient
      .from('landing_pages')
      .insert({
        user_id: user.id,
        url: url,
        title: mockAnalyzedData.title,
        description: mockAnalyzedData.description,
        keywords: mockAnalyzedData.key_points,
        analyzed_data: mockAnalyzedData
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Log analytics event
    await supabaseClient.from('analytics').insert({
      user_id: user.id,
      event_type: 'new_landing_page_analysis',
      event_data: { url }
    })

    return new Response(
      JSON.stringify({ 
        message: 'Landing page analyzed successfully',
        data: newLandingPage 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze landing page',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
