import SkillsAdmin from "@/components/SkillsAdmin";
import ContentAdmin from "@/components/ContentAdmin";
import CategoryAdmin from "@/components/CategoryAdmin";
import ExamplesAdmin from "@/components/ExamplesAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <ContentAdmin />
        </TabsContent>
        
        <TabsContent value="skills">
          <SkillsAdmin />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoryAdmin />
        </TabsContent>
        
        <TabsContent value="examples">
          <ExamplesAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;