
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

// Function to extract data from a URL using Tavily API
async function extractDataWithTavily(url: string) {
  const tavilyApiKey = Deno.env.get('TAVILY_API_KEY');
  
  if (!tavilyApiKey) {
    throw new Error('Tavily API key is not configured');
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tavilyApiKey}`
    },
    body: JSON.stringify({
      query: `Extract key information from this website: ${url}`,
      search_depth: "advanced",
      include_domains: [new URL(url).hostname],
      max_results: 5
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tavily API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data;
}

// Function to generate email copy using OpenAI
async function generateEmailCopy(websiteData: any) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert email copywriter. Create a compelling email based on the landing page data provided."
        },
        {
          role: "user",
          content: `Create a marketing email based on this landing page data: ${JSON.stringify(websiteData)}. 
          The email should include:
          1. A catchy subject line
          2. A compelling introduction
          3. 3-5 key points highlighting the benefits
          4. A strong call to action
          Format the response as JSON with the following fields: subject_line, email_body, cta_text`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Function to analyze website content and extract structured data
async function analyzeWebsiteContent(tavilyData: any, url: string) {
  // Extract content from Tavily search results
  const content = tavilyData.results.map(result => result.content).join('\n\n');
  
  // Use OpenAI to structure the data
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing landing pages and extracting key information."
        },
        {
          role: "user",
          content: `Analyze this landing page content from ${url} and extract the following information in JSON format:
          {
            "title": "The page title",
            "description": "Meta description or main page description",
            "main_heading": "The main heading of the page",
            "sub_heading": "Any subheading text",
            "cta_text": "Call to action button text",
            "key_points": ["List of key points or benefits mentioned"],
            "tone": "The overall tone (professional, casual, urgent, etc.)",
            "industry": "The industry this page appears to be targeting"
          }
          
          Here's the content to analyze:
          ${content}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Function to log analytics safely
async function logAnalytics(supabaseClient, userId, eventType, eventData) {
  try {
    await supabaseClient.from('analytics').insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData
    });
  } catch (err) {
    console.error('Analytics error:', err);
    // Continue execution even if analytics logging fails
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
      await logAnalytics(supabaseClient, user.id, 'reused_landing_page', { url });

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

    // Extract data using Tavily API
    const tavilyData = await extractDataWithTavily(url);
    
    // Analyze the website content using the extracted data
    const analyzedData = await analyzeWebsiteContent(tavilyData, url);
    
    // Generate email copy based on the analyzed data
    const emailCopy = await generateEmailCopy(analyzedData);

    // Combine the data
    const combinedData = {
      ...analyzedData,
      email_copy: emailCopy
    };

    // Store the analyzed data in Supabase
    const { data: newLandingPage, error: insertError } = await supabaseClient
      .from('landing_pages')
      .insert({
        user_id: user.id,
        url: url,
        title: analyzedData.title,
        description: analyzedData.description,
        keywords: analyzedData.key_points,
        analyzed_data: combinedData
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Log analytics event
    await logAnalytics(supabaseClient, user.id, 'new_landing_page_analysis', { url });

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
