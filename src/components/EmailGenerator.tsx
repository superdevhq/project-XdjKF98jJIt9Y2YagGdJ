
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface EmailCopy {
  subject: string;
  preheader: string;
  body: string;
}

interface EmailGeneratorProps {
  emailCopy: EmailCopy;
  setEmailCopy: (emailCopy: EmailCopy) => void;
  onSave: () => void;
}

export const EmailGenerator = ({ emailCopy, setEmailCopy, onSave }: EmailGeneratorProps) => {
  const [isCopied, setIsCopied] = useState(false);

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

  const handleRegenerateSection = (field: keyof EmailCopy) => {
    // In a real app, this would call the API to regenerate just this section
    toast({
      title: "Regenerating...",
      description: `Regenerating the ${field} section.`,
    });
    
    // Simulate API call
    setTimeout(() => {
      const newValue = field === 'body' 
        ? `${emailCopy[field]}\n\n[Regenerated content would appear here]` 
        : `${emailCopy[field]} (Regenerated)`;
      
      handleChange(field, newValue);
      
      toast({
        title: "Regenerated",
        description: `The ${field} has been regenerated.`,
      });
    }, 1000);
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
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Regenerate
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
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Regenerate
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
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Regenerate
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
        <Button variant="outline" onClick={handleCopyToClipboard}>
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
        <Button onClick={handleSave}>
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
