import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2, ExternalLink, Link2, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for skill examples management
interface Skill {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  proficiencyLevel: number;
  icon: string | null;
  years: number | null;
  order: number;
}

interface SkillExample {
  id: number;
  title: string;
  description: string;
  details: string;
  image: string | null;
  link: string | null;
  isSynthetic: boolean;
  createdAt: string;
  skills?: Skill[];
}

interface ExampleFormData {
  title: string;
  description: string;
  details: string;
  image: string | null;
  link: string | null;
  isSynthetic: boolean;
  skillIds: number[];
}

const defaultFormData: ExampleFormData = {
  title: "",
  description: "",
  details: "",
  image: null,
  link: null,
  isSynthetic: false,
  skillIds: [],
};

const ExamplesAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<SkillExample | null>(null);
  const [formData, setFormData] = useState<ExampleFormData>(defaultFormData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "regular" | "synthetic">("all");

  // Fetch all examples
  const {
    data: examples = [],
    isLoading: examplesLoading,
    error: examplesError,
  } = useQuery({
    queryKey: ["skillExamples"],
    queryFn: async () => {
      const response = await axios.get("/api/skill-examples");
      return response.data;
    },
  });

  // Fetch all skills
  const {
    data: skills = [],
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const response = await axios.get("/api/skills");
      return response.data;
    },
  });

  // Create mutation
  const createExampleMutation = useMutation({
    mutationFn: async (data: { example: Omit<ExampleFormData, "skillIds">, skillIds: number[] }) => {
      // First create the example
      const exampleResponse = await axios.post("/api/skill-examples", data.example);
      const newExample = exampleResponse.data;
      
      // Then create the skill-to-example mappings
      await Promise.all(data.skillIds.map(skillId => 
        axios.post("/api/skill-to-example", { skillId, exampleId: newExample.id })
      ));
      
      return newExample;
    },
    onSuccess: () => {
      setIsAddDialogOpen(false);
      setFormData(defaultFormData);
      queryClient.invalidateQueries({ queryKey: ["skillExamples"] });
      toast({
        title: "Example added",
        description: "The skill example has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill example",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateExampleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ExampleFormData }) => {
      const { skillIds, ...exampleData } = data;
      
      // First update the example
      const exampleResponse = await axios.put(`/api/skill-examples/${id}`, exampleData);
      const updatedExample = exampleResponse.data;
      
      // Then delete existing mappings
      await axios.delete(`/api/skill-to-example/example/${id}`);
      
      // Then create new mappings
      await Promise.all(skillIds.map(skillId => 
        axios.post("/api/skill-to-example", { skillId, exampleId: id })
      ));
      
      return updatedExample;
    },
    onSuccess: () => {
      setIsEditDialogOpen(false);
      setSelectedExample(null);
      queryClient.invalidateQueries({ queryKey: ["skillExamples"] });
      toast({
        title: "Example updated",
        description: "The skill example has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill example",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteExampleMutation = useMutation({
    mutationFn: async (id: number) => {
      // First delete the skill-to-example mappings
      await axios.delete(`/api/skill-to-example/example/${id}`);
      
      // Then delete the example
      await axios.delete(`/api/skill-examples/${id}`);
    },
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setSelectedExample(null);
      queryClient.invalidateQueries({ queryKey: ["skillExamples"] });
      toast({
        title: "Example deleted",
        description: "The skill example has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill example",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for adding new example
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { skillIds, ...exampleData } = formData;
    createExampleMutation.mutate({ example: exampleData, skillIds });
  };

  // Handle form submission for editing example
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExample) {
      updateExampleMutation.mutate({ id: selectedExample.id, data: formData });
    }
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedExample) {
      deleteExampleMutation.mutate(selectedExample.id);
    }
  };

  // Set up edit mode
  const handleEditClick = (example: SkillExample) => {
    setSelectedExample(example);
    const skillIds = example.skills?.map(skill => skill.id) || [];
    setFormData({
      title: example.title,
      description: example.description,
      details: example.details,
      image: example.image,
      link: example.link,
      isSynthetic: example.isSynthetic,
      skillIds,
    });
    setIsEditDialogOpen(true);
  };

  // Set up delete mode
  const handleDeleteClick = (example: SkillExample) => {
    setSelectedExample(example);
    setIsDeleteDialogOpen(true);
  };

  // Reset form when opening add dialog
  const handleOpenAddDialog = () => {
    setFormData(defaultFormData);
    setIsAddDialogOpen(true);
  };

  // Helper to toggle a skill in the selection
  const toggleSkillSelection = (skillId: number) => {
    const newSkillIds = [...formData.skillIds];
    const index = newSkillIds.indexOf(skillId);
    
    if (index === -1) {
      newSkillIds.push(skillId);
    } else {
      newSkillIds.splice(index, 1);
    }
    
    setFormData({ ...formData, skillIds: newSkillIds });
  };

  // Filter examples based on search query and tab
  const filteredExamples = examples.filter((example: SkillExample) => {
    const matchesSearch = 
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "synthetic" && example.isSynthetic) ||
      (activeTab === "regular" && !example.isSynthetic);
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skill Examples</h2>
        <Button onClick={handleOpenAddDialog}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Example
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search examples..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="regular">Regular</TabsTrigger>
            <TabsTrigger value="synthetic">AI Generated</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {examplesLoading || skillsLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : examplesError || skillsError ? (
        <div className="text-center p-8 text-red-500">
          Error loading data: {((examplesError || skillsError) as Error).message}
        </div>
      ) : filteredExamples.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No examples found. {searchQuery ? "Try changing your search." : "Add your first example!"}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExamples.map((example: SkillExample) => (
            <Card key={example.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                  {example.isSynthetic && (
                    <Badge variant="secondary">AI Generated</Badge>
                  )}
                </div>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="h-24 overflow-y-auto mb-4 text-sm">
                  <p className="whitespace-pre-wrap">{example.details}</p>
                </div>
                
                {example.skills && example.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Related Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {example.skills.map((skill) => (
                        <Badge key={skill.id} variant="outline">{skill.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {(example.image || example.link) && (
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    {example.image && (
                      <div className="flex items-center">
                        <Image className="h-4 w-4 mr-1" /> Has image
                      </div>
                    )}
                    {example.link && (
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-1" /> Has link
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-3 bg-muted/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(example)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(example)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Example Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add Skill Example</DialogTitle>
            <DialogDescription>
              Create a new skill example for your portfolio
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="details" className="text-right pt-2">
                  Details
                </Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="col-span-3 min-h-[150px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value || null })}
                  className="col-span-3"
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Link URL
                </Label>
                <Input
                  id="link"
                  value={formData.link || ""}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value || null })}
                  className="col-span-3"
                  placeholder="https://example.com (optional)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isSynthetic" className="text-right">
                  AI Generated
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isSynthetic"
                    checked={formData.isSynthetic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isSynthetic: checked })}
                  />
                  <Label htmlFor="isSynthetic" className="text-sm text-muted-foreground">
                    Mark as AI-generated content
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">
                  Related Skills
                </Label>
                <div className="col-span-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    Select one or more skills that this example demonstrates
                  </p>
                  <ScrollArea className="h-[150px] border rounded-md p-2">
                    <div className="space-y-2">
                      {skills.map((skill: Skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill.id}`}
                            checked={formData.skillIds.includes(skill.id)}
                            onCheckedChange={() => toggleSkillSelection(skill.id)}
                          />
                          <Label htmlFor={`skill-${skill.id}`} className="text-sm font-normal">
                            {skill.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
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
                disabled={createExampleMutation.isPending}
              >
                {createExampleMutation.isPending ? (
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

      {/* Edit Example Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Skill Example</DialogTitle>
            <DialogDescription>
              Update the skill example details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="details" className="text-right pt-2">
                  Details
                </Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="col-span-3 min-h-[150px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value || null })}
                  className="col-span-3"
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Link URL
                </Label>
                <Input
                  id="link"
                  value={formData.link || ""}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value || null })}
                  className="col-span-3"
                  placeholder="https://example.com (optional)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isSynthetic" className="text-right">
                  AI Generated
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isSynthetic"
                    checked={formData.isSynthetic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isSynthetic: checked })}
                  />
                  <Label htmlFor="isSynthetic" className="text-sm text-muted-foreground">
                    Mark as AI-generated content
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">
                  Related Skills
                </Label>
                <div className="col-span-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    Select one or more skills that this example demonstrates
                  </p>
                  <ScrollArea className="h-[150px] border rounded-md p-2">
                    <div className="space-y-2">
                      {skills.map((skill: Skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-edit-${skill.id}`}
                            checked={formData.skillIds.includes(skill.id)}
                            onCheckedChange={() => toggleSkillSelection(skill.id)}
                          />
                          <Label htmlFor={`skill-edit-${skill.id}`} className="text-sm font-normal">
                            {skill.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
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
                disabled={updateExampleMutation.isPending}
              >
                {updateExampleMutation.isPending ? (
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
              This will permanently delete the example "{selectedExample?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteExampleMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteExampleMutation.isPending ? (
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

export default ExamplesAdmin;