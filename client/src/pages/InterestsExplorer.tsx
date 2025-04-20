import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  Music, 
  Book, 
  Gamepad2, 
  Camera, 
  Globe, 
  Utensils, 
  PenTool, 
  Loader2, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

// Interface for interest data
interface Interest {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  details: string;
  relevantLinks?: { title: string; url: string }[];
}

type ViewState = 'list' | 'detail';

const InterestsExplorer = () => {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedInterestId, setSelectedInterestId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Simulated data - would normally come from API
  const mockInterests: Interest[] = [
    {
      id: 1,
      name: "Photography",
      category: "creative",
      description: "Passionate about landscape and street photography",
      icon: "Camera",
      details: "I've been practicing photography for over 8 years, focusing mainly on landscape and street photography. I enjoy capturing candid moments that tell a story about people and places. I've developed skills in composition, lighting, and post-processing with Adobe Lightroom and Photoshop.",
      relevantLinks: [
        { title: "My Photography Portfolio", url: "https://example.com/photos" },
        { title: "Photography Equipment I Use", url: "https://example.com/gear" }
      ]
    },
    {
      id: 2,
      name: "Electronic Music Production",
      category: "music",
      description: "Creating electronic music and sound design",
      icon: "Music",
      details: "I produce electronic music in my spare time, experimenting with different genres from ambient to techno. I use Ableton Live as my main DAW and have developed skills in sound design, mixing, and arrangement. I'm particularly interested in generative and algorithmic music creation, often combining my programming skills with music production.",
      relevantLinks: [
        { title: "My SoundCloud Profile", url: "https://soundcloud.com/example" }
      ]
    },
    {
      id: 3,
      name: "Science Fiction Literature",
      category: "reading",
      description: "Avid reader of sci-fi and speculative fiction",
      icon: "Book",
      details: "I'm an avid reader with a particular interest in science fiction, speculative fiction, and philosophical literature. Some of my favorite authors include Ted Chiang, Ursula K. Le Guin, and Liu Cixin. I enjoy works that explore complex ideas about technology, consciousness, and the future of humanity.",
      relevantLinks: [
        { title: "My Goodreads Profile", url: "https://goodreads.com/example" }
      ]
    },
    {
      id: 4,
      name: "Indie Game Development",
      category: "gaming",
      description: "Creating small indie games and game prototypes",
      icon: "Gamepad2",
      details: "I enjoy creating small indie games and game prototypes in my free time. I use Unity and Godot for development and have made several small 2D games. This hobby combines my interest in programming, design, and storytelling, and has helped me develop skills in user experience design and creative problem-solving.",
      relevantLinks: [
        { title: "My itch.io Profile", url: "https://itch.io/profile/example" }
      ]
    },
    {
      id: 5,
      name: "World Cuisines",
      category: "food",
      description: "Exploring diverse cuisines and cooking techniques",
      icon: "Utensils",
      details: "I have a passion for exploring diverse cuisines from around the world. I enjoy learning about different cooking techniques, ingredients, and cultural contexts. I regularly try new recipes and have developed a small collection of specialty ingredients and cooking tools. This interest has taught me about creativity, adaptability, and attention to detail.",
    },
    {
      id: 6,
      name: "Travel and Cultural Exploration",
      category: "travel",
      description: "Experiencing different cultures and environments",
      icon: "Globe",
      details: "I love traveling to new places and immersing myself in different cultures. I've visited over 15 countries across Europe, Asia, and North America. When traveling, I focus on understanding local customs, histories, and ways of life rather than just checking off tourist attractions. This has given me a broader perspective and adaptability to diverse environments.",
    }
  ];

  // In a real app, this would be an API call
  const { data: interests, isLoading } = useQuery({
    queryKey: ['/api/interests'],
    queryFn: async () => {
      // Simulating API call
      return new Promise<Interest[]>((resolve) => {
        setTimeout(() => resolve(mockInterests), 500);
      });
    }
  });

  // Handle interest selection
  const handleInterestSelect = (interestId: number) => {
    setSelectedInterestId(interestId);
    setViewState('detail');
  };

  // Handle going back to list view
  const handleBack = () => {
    setSelectedInterestId(null);
    setViewState('list');
  };

  // Filter interests by category
  const filteredInterests = interests?.filter(interest => 
    activeCategory === 'all' || interest.category === activeCategory
  );

  const selectedInterest = interests?.find(interest => interest.id === selectedInterestId);

  // Get icon component for an interest
  const getInterestIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="h-6 w-6" />;
      case 'Music': return <Music className="h-6 w-6" />;
      case 'Book': return <Book className="h-6 w-6" />;
      case 'Gamepad2': return <Gamepad2 className="h-6 w-6" />;
      case 'Utensils': return <Utensils className="h-6 w-6" />;
      case 'Globe': return <Globe className="h-6 w-6" />;
      case 'PenTool': return <PenTool className="h-6 w-6" />;
      default: return <Heart className="h-6 w-6" />;
    }
  };

  // Get background color class for category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'creative': return 'bg-purple-500/10 text-purple-500';
      case 'music': return 'bg-blue-500/10 text-blue-500';
      case 'reading': return 'bg-amber-500/10 text-amber-500';
      case 'gaming': return 'bg-green-500/10 text-green-500';
      case 'food': return 'bg-red-500/10 text-red-500';
      case 'travel': return 'bg-cyan-500/10 text-cyan-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {viewState === 'list' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Personal Interests</h1>
            <p className="text-muted-foreground">
              Discover what drives and inspires me outside of my professional work.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Interests</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="reading">Reading</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="travel">Travel</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              {filteredInterests && filteredInterests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInterests.map((interest) => (
                    <Card 
                      key={interest.id} 
                      className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleInterestSelect(interest.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{interest.name}</CardTitle>
                            <CardDescription>{interest.description}</CardDescription>
                          </div>
                          <div className={`p-2 rounded-md ${getCategoryColor(interest.category)}`}>
                            {getInterestIcon(interest.icon)}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <Badge 
                          variant="outline" 
                          className={`${getCategoryColor(interest.category)}`}
                        >
                          {interest.category.charAt(0).toUpperCase() + interest.category.slice(1)}
                        </Badge>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto group-hover:text-primary group-hover:bg-primary/10"
                        >
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">No Interests Found</h3>
                  <p className="text-muted-foreground mt-2">
                    No interests matching the selected category.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {viewState === 'detail' && selectedInterest && (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="group hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">{selectedInterest.name}</CardTitle>
                      <CardDescription className="text-lg">{selectedInterest.description}</CardDescription>
                    </div>
                    <div className={`p-3 rounded-md ${getCategoryColor(selectedInterest.category)}`}>
                      {getInterestIcon(selectedInterest.icon)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-line">{selectedInterest.details}</p>
                  
                  {selectedInterest.relevantLinks && selectedInterest.relevantLinks.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h3 className="text-lg font-medium">Relevant Links</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedInterest.relevantLinks.map((link, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            className="gap-2"
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            <Globe className="h-4 w-4" />
                            {link.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How This Relates To My Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This interest has helped me develop creative thinking, attention to detail, 
                    and a unique perspective that I bring to my professional work. The skills and 
                    mindset I've gained transfer directly to problem-solving and innovation.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10">Creativity</Badge>
                    <Badge variant="outline" className="bg-primary/10">Attention to Detail</Badge>
                    <Badge variant="outline" className="bg-primary/10">Visual Thinking</Badge>
                    <Badge variant="outline" className="bg-primary/10">Problem Solving</Badge>
                    <Badge variant="outline" className="bg-primary/10">Adaptability</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Interests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {interests
                    ?.filter(interest => 
                      interest.category === selectedInterest.category && 
                      interest.id !== selectedInterest.id
                    )
                    .slice(0, 2)
                    .map((interest) => (
                      <div 
                        key={interest.id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleInterestSelect(interest.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${getCategoryColor(interest.category)}`}>
                            {getInterestIcon(interest.icon)}
                          </div>
                          <span>{interest.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  
                  {interests?.filter(interest => 
                      interest.category === selectedInterest.category && 
                      interest.id !== selectedInterest.id
                    ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No related interests found
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestsExplorer;