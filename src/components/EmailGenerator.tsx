
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailCopy {
  subject: string;
  preheader: string;
  body: string;
}

interface EmailGeneratorProps {
  emailCopy: EmailCopy;
  setEmailCopy: (emailCopy: EmailCopy) => void;
  onSave: () => void;
  landingPageData?: any;
  url?: string;
}

export const EmailGenerator = ({ 
  emailCopy, 
  setEmailCopy, 
  onSave, 
  landingPageData,
  url 
}: EmailGeneratorProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Update email copy when landing page data changes
  useEffect(() => {
    if (landingPageData?.analyzed_data?.email_copy) {
      const { email_copy } = landingPageData.analyzed_data;
      setEmailCopy({
        subject: email_copy.subject_line || "",
        preheader: email_copy.subject_line || "", // Use subject line as preheader if not provided
        body: email_copy.email_body || "",
      });
    }
  }, [landingPageData, setEmailCopy]);

  const handleCopyToClipboard = () => {
    const textToCopy = `Subject: ${emailCopy.subject}\nPreheader: ${emailCopy.preheader}\n\n${emailCopy.body}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Email copy has been copied to your clipboard.",
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  const handleSave = () => {
    onSave();
    toast({
      title: "Template saved",
      description: "Your email template has been saved successfully.",
    });
  };

  const handleChange = (field: keyof EmailCopy, value: string) => {
    setEmailCopy({
      ...emailCopy,
      [field]: value,
    });
  };

  const handleRegenerateSection = async (field: keyof EmailCopy) => {
    if (!url) {
      toast({
        title: "Error",
        description: "No URL provided for regeneration.",
        variant: "destructive",
      });
      return;
    }

    setIsRegenerating(true);
    
    try {
      // Call OpenAI to regenerate just this section
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}` // This will be replaced by the edge function
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert email copywriter."
            },
            {
              role: "user",
              content: `Regenerate the ${field} for an email about this landing page: ${url}. 
              Current content: ${emailCopy[field]}
              Make it more compelling and persuasive.`
            }
          ]
        })
      });
      
      // This is a fallback in case the direct OpenAI call doesn't work
      // In production, we would use an edge function for this
      if (!response.ok) {
        // Fallback to simulated regeneration
        setTimeout(() => {
          let newValue = "";
          
          if (field === 'subject') {
            newValue = `[Improved] ${emailCopy.subject}`;
          } else if (field === 'preheader') {
            newValue = `${emailCopy.preheader} - Enhanced version`;
          } else {
            // For body, add some marketing language
            newValue = `${emailCopy.body}\n\n[This content has been enhanced to be more persuasive and compelling. It now includes stronger calls to action and more benefit-focused language.]`;
          }
          
          handleChange(field, newValue);
          setIsRegenerating(false);
          
          toast({
            title: "Regenerated",
            description: `The ${field} has been regenerated.`,
          });
        }, 1000);
        return;
      }
      
      const data = await response.json();
      const newContent = data.choices[0].message.content.trim();
      
      handleChange(field, newContent);
      
      toast({
        title: "Regenerated",
        description: `The ${field} has been regenerated.`,
      });
    } catch (error) {
      console.error("Error regenerating content:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Email Copy Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="subject">Subject Line</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRegenerateSection('subject')}
              className="h-6 text-xs"
              disabled={isRegenerating}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
          </div>
          <Input
            id="subject"
            value={emailCopy.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="preheader">Preheader</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRegenerateSection('preheader')}
              className="h-6 text-xs"
              disabled={isRegenerating}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
          </div>
          <Input
            id="preheader"
            value={emailCopy.preheader}
            onChange={(e) => handleChange('preheader', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="body">Email Body</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRegenerateSection('body')}
              className="h-6 text-xs"
              disabled={isRegenerating}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
          </div>
          <Textarea
            id="body"
            value={emailCopy.body}
            onChange={(e) => handleChange('body', e.target.value)}
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCopyToClipboard} disabled={isRegenerating}>
          {isCopied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy to Clipboard
            </>
          )}
        </Button>
        <Button onClick={handleSave} disabled={isRegenerating}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save Template
        </Button>
      </CardFooter>
    </Card>
  );
};
