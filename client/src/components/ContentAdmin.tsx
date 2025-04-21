import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";

// Define types for content section management
interface ContentSection {
  id: number;
  section: string;
  title: string;
  content: string;
  order: number;
  metadata: any | null;
  updatedAt: string;
}

interface ContentFormData {
  section: string;
  title: string;
  content: string;
  order: number;
  metadata: any | null;
}

const defaultFormData: ContentFormData = {
  section: "about_me",
  title: "",
  content: "",
  order: 0,
  metadata: null,
};

const ContentAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("about_me");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentSection | null>(null);
  const [formData, setFormData] = useState<ContentFormData>(defaultFormData);

  // Fetch all content sections
  const {
    data: contentSections = [],
    isLoading: contentLoading,
    error: contentError,
  } = useQuery({
    queryKey: ["contentSections"],
    queryFn: async () => {
      const response = await axios.get("/api/content-sections");
      return response.data;
    },
  });

  // Group content sections by type for display in tabs
  const aboutMeSections = contentSections.filter((section: ContentSection) => section.section === "about_me");
  const workExperienceSections = contentSections.filter((section: ContentSection) => section.section === "work_experience");
  const personalInterestsSections = contentSections.filter((section: ContentSection) => section.section === "personal_interests");

  // Create mutation
  const createContentMutation = useMutation({
    mutationFn: async (newContent: ContentFormData) => {
      const response = await axios.post("/api/content-sections", newContent);
      return response.data;
    },
    onSuccess: () => {
      setIsAddDialogOpen(false);
      setFormData(defaultFormData);
      queryClient.invalidateQueries({ queryKey: ["contentSections"] });
      toast({
        title: "Content added",
        description: "The content section has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add content section",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ContentFormData }) => {
      const response = await axios.put(`/api/content-sections/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      setIsEditDialogOpen(false);
      setSelectedContent(null);
      queryClient.invalidateQueries({ queryKey: ["contentSections"] });
      toast({
        title: "Content updated",
        description: "The content section has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content section",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/content-sections/${id}`);
    },
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setSelectedContent(null);
      queryClient.invalidateQueries({ queryKey: ["contentSections"] });
      toast({
        title: "Content deleted",
        description: "The content section has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content section",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for adding new content
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContentMutation.mutate(formData);
  };

  // Handle form submission for editing content
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContent) {
      updateContentMutation.mutate({ id: selectedContent.id, data: formData });
    }
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedContent) {
      deleteContentMutation.mutate(selectedContent.id);
    }
  };

  // Set up edit mode
  const handleEditClick = (content: ContentSection) => {
    setSelectedContent(content);
    setFormData({
      section: content.section,
      title: content.title,
      content: content.content,
      order: content.order,
      metadata: content.metadata,
    });
    setIsEditDialogOpen(true);
  };

  // Set up delete mode
  const handleDeleteClick = (content: ContentSection) => {
    setSelectedContent(content);
    setIsDeleteDialogOpen(true);
  };

  // Reset form when opening add dialog
  const handleOpenAddDialog = () => {
    setFormData({
      ...defaultFormData,
      section: activeTab // Set section based on current active tab
    });
    setIsAddDialogOpen(true);
  };

  // Render content sections for a specific type
  const renderContentSections = (sections: ContentSection[]) => {
    if (sections.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          No content sections found. Add your first one!
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((content) => (
          <Card key={content.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{content.title}</span>
                <span className="text-sm text-muted-foreground">Order: {content.order}</span>
              </CardTitle>
              <CardDescription>
                Last updated: {new Date(content.updatedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 overflow-y-auto mb-4">
                <p className="whitespace-pre-wrap">{content.content}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3 bg-muted/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(content)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(content)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Sections</h2>
        <Button onClick={handleOpenAddDialog}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="about_me">About Me</TabsTrigger>
          <TabsTrigger value="work_experience">Work Experience</TabsTrigger>
          <TabsTrigger value="personal_interests">Personal Interests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about_me">
          {contentLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contentError ? (
            <div className="text-center p-8 text-red-500">
              Error loading content: {(contentError as Error).message}
            </div>
          ) : (
            renderContentSections(aboutMeSections)
          )}
        </TabsContent>
        
        <TabsContent value="work_experience">
          {contentLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contentError ? (
            <div className="text-center p-8 text-red-500">
              Error loading content: {(contentError as Error).message}
            </div>
          ) : (
            renderContentSections(workExperienceSections)
          )}
        </TabsContent>
        
        <TabsContent value="personal_interests">
          {contentLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contentError ? (
            <div className="text-center p-8 text-red-500">
              Error loading content: {(contentError as Error).message}
            </div>
          ) : (
            renderContentSections(personalInterestsSections)
          )}
        </TabsContent>
      </Tabs>

      {/* Add Content Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Content Section</DialogTitle>
            <DialogDescription>
              Create a new content section for your portfolio
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">
                  Section
                </Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="about_me">About Me</SelectItem>
                    <SelectItem value="work_experience">Work Experience</SelectItem>
                    <SelectItem value="personal_interests">Personal Interests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order.toString()}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="col-span-3 min-h-[200px]"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createContentMutation.isPending}
              >
                {createContentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content Section</DialogTitle>
            <DialogDescription>
              Update the content section details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">
                  Section
                </Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="about_me">About Me</SelectItem>
                    <SelectItem value="work_experience">Work Experience</SelectItem>
                    <SelectItem value="personal_interests">Personal Interests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order.toString()}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="col-span-3 min-h-[200px]"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateContentMutation.isPending}
              >
                {updateContentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the content section "{selectedContent?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteContentMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteContentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentAdmin;