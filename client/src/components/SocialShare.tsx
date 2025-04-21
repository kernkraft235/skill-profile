import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert } from "@/components/ui/alert";
import { AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, Copy, Twitter, Linkedin, Facebook, Mail, Link, CheckCircle2, 
  Globe, Image, Edit, Eye
} from 'lucide-react';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  customizable?: boolean;
}

const SocialShare = ({ 
  title: initialTitle, 
  description: initialDescription, 
  url: initialUrl, 
  imageUrl: initialImageUrl, 
  customizable = false 
}: SocialShareProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  // State for customized share content
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [url] = useState(initialUrl); // URL shouldn't be customizable for security
  const [imageUrl] = useState(initialImageUrl); // Image URL handling would be more complex
  
  // Preview of how it would look on different platforms
  const [previewPlatform, setPreviewPlatform] = useState<'twitter' | 'linkedin' | 'facebook'>('twitter');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard.",
    });
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    window.open(linkedInUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareByEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`;
    window.location.href = mailtoUrl;
  };

  const resetCustomization = () => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setIsCustomizing(false);
  };

  // Simplified preview component that shows how the share might look
  const SocialPreview = ({ platform }: { platform: 'twitter' | 'linkedin' | 'facebook' }) => {
    const platformStyles = {
      twitter: {
        bgColor: 'bg-[#1DA1F2]/10',
        textColor: 'text-[#1DA1F2]',
        icon: <Twitter className="h-5 w-5" />,
        name: 'Twitter',
      },
      linkedin: {
        bgColor: 'bg-[#0077B5]/10',
        textColor: 'text-[#0077B5]',
        icon: <Linkedin className="h-5 w-5" />,
        name: 'LinkedIn',
      },
      facebook: {
        bgColor: 'bg-[#1877F2]/10',
        textColor: 'text-[#1877F2]',
        icon: <Facebook className="h-5 w-5" />,
        name: 'Facebook',
      },
    };

    const style = platformStyles[platform];

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className={`flex items-center gap-2 p-2 ${style.bgColor} ${style.textColor}`}>
          {style.icon}
          <span className="font-medium">{style.name} Preview</span>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex gap-3">
            {imageUrl && (
              <div className="h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                <img src={imageUrl} alt="Share" className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
              <div className="flex items-center gap-1 mt-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{url.replace(/^https?:\/\//, '')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Component for the share button
  const ShareButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share this content</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // If we're just rendering the button and the modal is closed
  if (!isOpen) {
    return <ShareButton />;
  }

  return (
    <Card className="w-[340px] absolute right-0 top-full mt-2 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Share</CardTitle>
          {customizable && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCustomizing(!isCustomizing)}
            >
              {isCustomizing ? <Eye className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
              {isCustomizing ? 'Preview' : 'Customize'}
            </Button>
          )}
        </div>
        <CardDescription>
          Share this content across your networks
        </CardDescription>
      </CardHeader>
      
      {isCustomizing ? (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-title">Title</Label>
            <Input 
              id="share-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="share-description">Description</Label>
            <Textarea 
              id="share-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none"
              rows={3}
            />
          </div>
          
          <div className="pt-2 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetCustomization}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCustomizing(false)}
            >
              Apply Changes
            </Button>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="pb-3">
            <div className="flex flex-col gap-4">
              <Tabs defaultValue="share" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="share">Share</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="share" className="space-y-4 pt-3">
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center py-3 h-auto"
                      onClick={shareToTwitter}
                    >
                      <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                      <span className="text-xs mt-1">Twitter</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex flex-col items-center py-3 h-auto"
                      onClick={shareToLinkedIn}
                    >
                      <Linkedin className="h-5 w-5 text-[#0077B5]" />
                      <span className="text-xs mt-1">LinkedIn</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex flex-col items-center py-3 h-auto"
                      onClick={shareToFacebook}
                    >
                      <Facebook className="h-5 w-5 text-[#1877F2]" />
                      <span className="text-xs mt-1">Facebook</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex flex-col items-center py-3 h-auto"
                      onClick={shareByEmail}
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-xs mt-1">Email</span>
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Input
                      readOnly
                      value={url}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => copyToClipboard(url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4 pt-3">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Button
                      variant={previewPlatform === 'twitter' ? 'default' : 'outline'}
                      size="sm"
                      className="flex items-center justify-center"
                      onClick={() => setPreviewPlatform('twitter')}
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      Twitter
                    </Button>
                    
                    <Button
                      variant={previewPlatform === 'linkedin' ? 'default' : 'outline'}
                      size="sm"
                      className="flex items-center justify-center"
                      onClick={() => setPreviewPlatform('linkedin')}
                    >
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </Button>
                    
                    <Button
                      variant={previewPlatform === 'facebook' ? 'default' : 'outline'}
                      size="sm"
                      className="flex items-center justify-center"
                      onClick={() => setPreviewPlatform('facebook')}
                    >
                      <Facebook className="h-4 w-4 mr-1" />
                      Facebook
                    </Button>
                  </div>
                  
                  <SocialPreview platform={previewPlatform} />
                  
                  <div className="py-2 border rounded-md flex items-center px-3 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    This is how your shared content may appear on {previewPlatform}.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </>
      )}
      
      <CardFooter className="flex justify-between border-t pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Close
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="flex items-center"
          onClick={() => copyToClipboard(url)}
        >
          <Link className="h-4 w-4 mr-1" />
          Copy Link
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SocialShare;