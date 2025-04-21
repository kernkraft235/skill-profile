import SkillsAdmin from "@/components/SkillsAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skills">
          <SkillsAdmin />
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="p-8 text-center text-gray-500">
            Category management coming soon
          </div>
        </TabsContent>
        
        <TabsContent value="examples">
          <div className="p-8 text-center text-gray-500">
            Examples management coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;