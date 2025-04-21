import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interfaces matching the Skill model from backend
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

interface SkillCategory {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  level: number;
  icon: string | null;
  order: number;
}

interface SkillFormData {
  name: string;
  description: string;
  categoryId: number;
  proficiencyLevel: number;
  icon: string | null;
  years: number | null;
  order: number;
}

const SkillsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    description: "",
    categoryId: 0,
    proficiencyLevel: 3,
    icon: null,
    years: null,
    order: 0,
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

  // Fetch all skill categories for the dropdown
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

  // Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: async (data: SkillFormData) => {
      const response = await axios.post("/api/skills", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Success!",
        description: "Skill created successfully",
        duration: 3000,
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating skill:", error);
      toast({
        title: "Error",
        description: "Failed to create skill. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: async (data: Skill) => {
      const { id, ...skillData } = data;
      const response = await axios.put(`/api/skills/${id}`, skillData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Success!",
        description: "Skill updated successfully",
        duration: 3000,
      });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error updating skill:", error);
      toast({
        title: "Error",
        description: "Failed to update skill. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/skills/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Success!",
        description: "Skill deleted successfully",
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      setSelectedSkill(null);
    },
    onError: (error) => {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: parseInt(value, 10),
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSkillMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkill) {
      updateSkillMutation.mutate({
        ...formData,
        id: selectedSkill.id,
      });
    }
  };

  const handleDelete = () => {
    if (selectedSkill) {
      deleteSkillMutation.mutate(selectedSkill.id);
    }
  };

  const openEditDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description,
      categoryId: skill.categoryId,
      proficiencyLevel: skill.proficiencyLevel,
      icon: skill.icon,
      years: skill.years,
      order: skill.order,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: 0,
      proficiencyLevel: 3,
      icon: null,
      years: null,
      order: 0,
    });
    setSelectedSkill(null);
  };

  if (skillsLoading || categoriesLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (skillsError || categoriesError) {
    return (
      <div className="p-4 text-red-500">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Skills Management</CardTitle>
          <CardDescription>
            Add, update, or delete skills in your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> Add New Skill
            </Button>
          </div>

          {skills.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No skills found. Add your first skill using the button above.
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your skills</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead>Years</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill: Skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      {
                        categories.find(
                          (cat: SkillCategory) => cat.id === skill.categoryId
                        )?.name
                      }
                    </TableCell>
                    <TableCell>{skill.proficiencyLevel}/5</TableCell>
                    <TableCell>{skill.years || "N/A"}</TableCell>
                    <TableCell>{skill.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(skill)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => openDeleteDialog(skill)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Skill Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Enter the details for the new skill
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("categoryId", value)
                  }
                  defaultValue={formData.categoryId.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: SkillCategory) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="proficiencyLevel">
                  Proficiency Level (1-5)
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("proficiencyLevel", value)
                  }
                  defaultValue={formData.proficiencyLevel.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Beginner</SelectItem>
                    <SelectItem value="2">2 - Basic</SelectItem>
                    <SelectItem value="3">3 - Intermediate</SelectItem>
                    <SelectItem value="4">4 - Advanced</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., SiJavascript, Code, Database"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="years">Years of Experience (optional)</Label>
                <Input
                  id="years"
                  name="years"
                  type="number"
                  value={formData.years || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSkillMutation.isPending}>
                {createSkillMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update the skill details</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-categoryId">Category</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("categoryId", value)
                  }
                  defaultValue={formData.categoryId.toString()}
                  value={formData.categoryId.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: SkillCategory) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-proficiencyLevel">
                  Proficiency Level (1-5)
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("proficiencyLevel", value)
                  }
                  defaultValue={formData.proficiencyLevel.toString()}
                  value={formData.proficiencyLevel.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Beginner</SelectItem>
                    <SelectItem value="2">2 - Basic</SelectItem>
                    <SelectItem value="3">3 - Intermediate</SelectItem>
                    <SelectItem value="4">4 - Advanced</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-icon">Icon (optional)</Label>
                <Input
                  id="edit-icon"
                  name="icon"
                  value={formData.icon || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., SiJavascript, Code, Database"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-years">
                  Years of Experience (optional)
                </Label>
                <Input
                  id="edit-years"
                  name="years"
                  type="number"
                  value={formData.years || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-order">Display Order</Label>
                <Input
                  id="edit-order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateSkillMutation.isPending}>
                {updateSkillMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the skill "
              {selectedSkill?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteSkillMutation.isPending}
            >
              {deleteSkillMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsAdmin;