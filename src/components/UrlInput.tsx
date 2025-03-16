
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput = ({ onSubmit, isLoading }: UrlInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add protocol if missing
      let processedUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        processedUrl = "https://" + url;
      }
      
      // Check if URL is valid
      new URL(processedUrl);
      onSubmit(processedUrl);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };

  // Real-world example URLs that work well with Tavily API
  const exampleUrls = [
    "https://www.apple.com/iphone-15-pro/",
    "https://www.hubspot.com/products/marketing",
    "https://www.salesforce.com/products/sales-cloud/overview/",
    "https://www.shopify.com/plus",
    "https://slack.com/features"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="url"
          placeholder="https://example.com/landing-page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            "Generate Email Copy"
          )}
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Try these real landing pages:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {exampleUrls.map((exampleUrl, index) => (
            <button 
              key={index}
              type="button" 
              className="text-primary hover:underline text-left truncate"
              onClick={() => setUrl(exampleUrl)}
              disabled={isLoading}
            >
              {exampleUrl}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs">
          <span className="font-medium">Note:</span> Our AI analyzes public landing pages to generate relevant email copy. 
          For best results, use pages with clear value propositions and calls to action.
        </p>
      </div>
    </form>
  );
};
