import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2, FolderPlus, Folders } from "lucide-react";

// Define types for skill category management
interface SkillCategory {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  level: number;
  icon: string | null;
  order: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentId: number | null;
  level: number;
  icon: string | null;
  order: number;
}

const defaultFormData: CategoryFormData = {
  name: "",
  description: "",
  parentId: null,
  level: 0,
  icon: null,
  order: 0
};

const CategoryAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Fetch all categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["skillCategories"],
    queryFn: async () => {
      const response = await axios.get("/api/skill-categories");
      return response.data;
    },
  });

  // Create mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (newCategory: CategoryFormData) => {
      const response = await axios.post("/api/skill-categories", newCategory);
      return response.data;
    },
    onSuccess: () => {
      setIsAddDialogOpen(false);
      setFormData(defaultFormData);
      queryClient.invalidateQueries({ queryKey: ["skillCategories"] });
      toast({
        title: "Category added",
        description: "The skill category has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill category",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryFormData }) => {
      const response = await axios.put(`/api/skill-categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      queryClient.invalidateQueries({ queryKey: ["skillCategories"] });
      toast({
        title: "Category updated",
        description: "The skill category has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill category",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/skill-categories/${id}`);
    },
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      queryClient.invalidateQueries({ queryKey: ["skillCategories"] });
      toast({
        title: "Category deleted",
        description: "The skill category has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill category",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for adding new category
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(formData);
  };

  // Handle form submission for editing category
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, data: formData });
    }
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id);
    }
  };

  // Set up edit mode
  const handleEditClick = (category: SkillCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      level: category.level,
      icon: category.icon,
      order: category.order,
    });
    setIsEditDialogOpen(true);
  };

  // Set up delete mode
  const handleDeleteClick = (category: SkillCategory) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Reset form when opening add dialog
  const handleOpenAddDialog = (parentId: number | null = null, level: number = 0) => {
    setFormData({
      ...defaultFormData,
      parentId,
      level,
    });
    setIsAddDialogOpen(true);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Get child categories
  const getChildCategories = (parentId: number | null) => {
    return categories.filter((category: SkillCategory) => category.parentId === parentId)
      .sort((a: SkillCategory, b: SkillCategory) => (a.order || 0) - (b.order || 0));
  };

  // Render a category and its children recursively
  const renderCategory = (category: SkillCategory) => {
    const childCategories = getChildCategories(category.id);
    const hasChildren = childCategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="mb-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                {category.icon && <span>{category.icon}</span>}
                {category.name}
                {hasChildren && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className="ml-2 p-1 h-7 w-7"
                  >
                    {isExpanded ? "−" : "+"}
                  </Button>
                )}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Level: {category.level} | Order: {category.order}
              </div>
            </div>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAddDialog(category.id, category.level + 1)}
            >
              <FolderPlus className="h-4 w-4 mr-1" /> Add Subcategory
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(category)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(category)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {hasChildren && isExpanded && (
          <div className="pl-6 mt-2 border-l-2 border-muted">
            {childCategories.map(renderCategory)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skill Categories</h2>
        <Button onClick={() => handleOpenAddDialog()}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Root Category
        </Button>
      </div>

      {categoriesLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : categoriesError ? (
        <div className="text-center p-8 text-red-500">
          Error loading categories: {(categoriesError as Error).message}
        </div>
      ) : getChildCategories(null).length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No categories found. Add your first category!
        </div>
      ) : (
        <div className="space-y-4">
          {getChildCategories(null).map(renderCategory)}
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Skill Category</DialogTitle>
            <DialogDescription>
              Create a new skill category for your portfolio
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent" className="text-right">
                  Parent
                </Label>
                <Select
                  value={formData.parentId?.toString() || "null"}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    parentId: value === "null" ? null : parseInt(value),
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">None (Root Category)</SelectItem>
                    {categories.map((category: SkillCategory) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name} (Level {category.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">
                  Level
                </Label>
                <Input
                  id="level"
                  type="number"
                  value={formData.level.toString()}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value || null })}
                  className="col-span-3"
                  placeholder="Icon name (optional)"
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
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? (
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

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Skill Category</DialogTitle>
            <DialogDescription>
              Update the skill category details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent" className="text-right">
                  Parent
                </Label>
                <Select
                  value={formData.parentId?.toString() || "null"}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    parentId: value === "null" ? null : parseInt(value),
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">None (Root Category)</SelectItem>
                    {categories
                      .filter((category: SkillCategory) => category.id !== selectedCategory?.id)
                      .map((category: SkillCategory) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name} (Level {category.level})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">
                  Level
                </Label>
                <Input
                  id="level"
                  type="number"
                  value={formData.level.toString()}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value || null })}
                  className="col-span-3"
                  placeholder="Icon name (optional)"
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
                disabled={updateCategoryMutation.isPending}
              >
                {updateCategoryMutation.isPending ? (
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
              This will permanently delete the category "{selectedCategory?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCategoryMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategoryMutation.isPending ? (
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

export default CategoryAdmin;