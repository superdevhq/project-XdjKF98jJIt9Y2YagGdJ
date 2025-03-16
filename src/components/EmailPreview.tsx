
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailCopy {
  subject: string;
  preheader: string;
  body: string;
}

interface EmailPreviewProps {
  emailCopy: EmailCopy;
}

export const EmailPreview = ({ emailCopy }: EmailPreviewProps) => {
  // Function to convert plain text to HTML with paragraphs
  const formatBodyToHtml = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph, index) => 
        paragraph.trim() ? 
          <p key={index} className="mb-4">{paragraph}</p> : 
          <br key={index} />
      );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Email Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="desktop" className="mt-0">
            <div className="border rounded-md overflow-hidden shadow-sm">
              <div className="bg-secondary p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">F</div>
                  <div className="text-xs text-muted-foreground truncate">From: EmailCraft &lt;hello@emailcraft.ai&gt;</div>
                </div>
                <div className="mt-1 text-sm font-medium">{emailCopy.subject}</div>
                <div className="text-xs text-muted-foreground truncate">{emailCopy.preheader}</div>
              </div>
              <div className="bg-white p-6 text-sm">
                {formatBodyToHtml(emailCopy.body)}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mobile" className="mt-0">
            <div className="border rounded-md overflow-hidden shadow-sm max-w-[320px] mx-auto">
              <div className="bg-secondary p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">F</div>
                  <div className="text-xs text-muted-foreground truncate">From: EmailCraft</div>
                </div>
                <div className="mt-1 text-sm font-medium">{emailCopy.subject}</div>
                <div className="text-xs text-muted-foreground truncate">{emailCopy.preheader}</div>
              </div>
              <div className="bg-white p-4 text-sm">
                {formatBodyToHtml(emailCopy.body)}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
