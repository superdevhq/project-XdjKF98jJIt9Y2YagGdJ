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
    <Card className="h-full border-2 border-primary/10 shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-primary"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Email Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="desktop" className="rounded-none data-[state=active]:bg-background">Desktop</TabsTrigger>
            <TabsTrigger value="mobile" className="rounded-none data-[state=active]:bg-background">Mobile</TabsTrigger>
          </TabsList>

          <TabsContent value="desktop" className="mt-0 p-0">
            <div className="overflow-hidden">
              <div className="bg-secondary p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">EC</div>
                  <div className="text-xs text-muted-foreground truncate">From: EmailCraft &lt;hello@emailcraft.ai&gt;</div>
                </div>
                <div className="mt-1 text-sm font-medium">{emailCopy.subject || "Your Subject Line"}</div>
                <div className="text-xs text-muted-foreground truncate">{emailCopy.preheader || "Your preheader text will appear here"}</div>
              </div>
              <div className="bg-white p-6 text-sm min-h-[300px] max-h-[400px] overflow-y-auto">
                {emailCopy.body ? formatBodyToHtml(emailCopy.body) : (
                  <p className="text-muted-foreground italic">Your email body will appear here</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-0 p-0">
            <div className="max-w-[320px] mx-auto overflow-hidden">
              <div className="bg-secondary p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">EC</div>
                  <div className="text-xs text-muted-foreground truncate">From: EmailCraft</div>
                </div>
                <div className="mt-1 text-sm font-medium">{emailCopy.subject || "Your Subject Line"}</div>
                <div className="text-xs text-muted-foreground truncate">{emailCopy.preheader || "Your preheader text will appear here"}</div>
              </div>
              <div className="bg-white p-4 text-sm min-h-[300px] max-h-[400px] overflow-y-auto">
                {emailCopy.body ? formatBodyToHtml(emailCopy.body) : (
                  <p className="text-muted-foreground italic">Your email body will appear here</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};