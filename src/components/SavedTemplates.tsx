import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getSavedTemplates } from "@/lib/mockData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SavedTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState(getSavedTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [editedTemplate, setEditedTemplate] = useState({
    name: "",
    subject: "",
    preheader: "",
    body: ""
  });

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id));
    toast({
      title: "Template deleted",
      description: "The template has been deleted successfully."
    });
  };

  const handleDuplicate = (id: string) => {
    const templateToDuplicate = templates.find((template) => template.id === id);
    if (templateToDuplicate) {
      const newTemplate = {
        ...templateToDuplicate,
        id: `template-${Date.now()}`,
        name: `${templateToDuplicate.name} (Copy)`,
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: "Template duplicated",
        description: "The template has been duplicated successfully."
      });
    }
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setEditedTemplate({
      name: template.name,
      subject: template.subject,
      preheader: template.preheader || "",
      body: template.body || ""
    });
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (selectedTemplate) {
      const updatedTemplates = templates.map((template) =>
        template.id === selectedTemplate.id
          ? { ...template, ...editedTemplate }
          : template
      );
      setTemplates(updatedTemplates);
      setEditMode(false);
      setSelectedTemplate(null);
      toast({
        title: "Template updated",
        description: "Your changes have been saved successfully."
      });
    }
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Templates</CardTitle>
              <CardDescription>
                View and manage your saved email templates.
              </CardDescription>
            </div>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {sortedTemplates.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No templates found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? "No templates match your search." : "You haven't saved any templates yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedTemplates.map((template) => (
                <div key={template.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 mb-4 md:mb-0">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">Subject: {template.subject}</p>
                    <p className="text-xs text-muted-foreground">Created: {template.created}</p>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handlePreview(template)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>Template Preview</DialogTitle>
                          <DialogDescription>
                            Preview how your email template will look.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="border rounded-md p-4 mt-4 space-y-4">
                          <div>
                            <h4 className="font-semibold">Subject:</h4>
                            <p>{selectedTemplate?.subject}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Preheader:</h4>
                            <p>{selectedTemplate?.preheader || "No preheader available"}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Body:</h4>
                            <p className="whitespace-pre-line">{selectedTemplate?.body || "No body content available"}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm" onClick={() => handleDuplicate(template.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      Duplicate
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>Edit Template</DialogTitle>
                          <DialogDescription>
                            Make changes to your email template.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Template Name</Label>
                            <Input
                              id="name"
                              value={editedTemplate.name}
                              onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="subject">Subject Line</Label>
                            <Input
                              id="subject"
                              value={editedTemplate.subject}
                              onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="preheader">Preheader</Label>
                            <Input
                              id="preheader"
                              value={editedTemplate.preheader}
                              onChange={(e) => setEditedTemplate({ ...editedTemplate, preheader: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="body">Email Body</Label>
                            <Textarea
                              id="body"
                              rows={8}
                              value={editedTemplate.body}
                              onChange={(e) => setEditedTemplate({ ...editedTemplate, body: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                          <Button onClick={handleSaveEdit}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};