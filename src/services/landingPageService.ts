
import { supabase } from "@/integrations/supabase/client";

interface LandingPageData {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  analyzed_data: any;
}

export const analyzeLandingPage = async (url: string): Promise<LandingPageData> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-landing-page', {
      body: { url },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.data;
  } catch (error) {
    console.error('Error analyzing landing page:', error);
    throw error;
  }
};

export const getEmailTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
};

export const saveEmailTemplate = async (template: {
  name: string;
  subject: string;
  preheader: string;
  body: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving email template:', error);
    throw error;
  }
};

export const deleteEmailTemplate = async (id: string) => {
  try {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting email template:', error);
    throw error;
  }
};

export const logAnalyticsEvent = async (eventType: string, eventData: any) => {
  try {
    const { error } = await supabase
      .from('analytics')
      .insert({
        event_type: eventType,
        event_data: eventData,
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error logging analytics event:', error);
    // Don't throw here, just log the error
    return false;
  }
};
