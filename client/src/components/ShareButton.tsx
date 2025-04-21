import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import SocialShare from './SocialShare';
import axios from 'axios';

interface ShareButtonProps {
  title?: string;
  description?: string;
  customUrl?: string;
  imageUrl?: string;
  variant?: 'default' | 'compact';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

/**
 * ShareButton component that can be used throughout the application to
 * share content on social media with customizable preview data.
 */
const ShareButton = ({
  title: customTitle,
  description: customDescription,
  customUrl,
  imageUrl,
  variant = 'default',
  position = 'top-right',
  className = ''
}: ShareButtonProps) => {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
  } | null>(null);

  // Generate the full URL for sharing
  const getFullUrl = (path: string) => {
    const baseUrl = window.location.origin;
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  // Get metadata based on the current route or custom props
  const getMetadata = async () => {
    try {
      // If custom values are provided, use those
      if (customTitle && customDescription) {
        return {
          title: customTitle,
          description: customDescription,
          url: customUrl || getFullUrl(location),
          imageUrl: imageUrl
        };
      }

      // Otherwise, use the current page's metadata
      // For a real app, this might fetch from an API based on the current route
      let pageTitle = document.title;
      let pageDescription = '';
      
      // Look for meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        pageDescription = metaDescription.getAttribute('content') || '';
      } else {
        // Use a default description based on the current page
        pageDescription = `Check out this page on Graham Colehour's profile.`;
      }

      return {
        title: pageTitle,
        description: pageDescription,
        url: customUrl || getFullUrl(location),
        imageUrl: imageUrl
      };
    } catch (error) {
      console.error('Error getting metadata:', error);
      toast({
        title: 'Error',
        description: 'Failed to get sharing information',
        variant: 'destructive'
      });
      return null;
    }
  };

  const handleShareClick = async () => {
    const data = await getMetadata();
    if (data) {
      setShareData(data);
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {variant === 'compact' ? (
        <button
          onClick={handleShareClick}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          aria-label="Share"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handleShareClick}
          className="flex items-center px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-1.5"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
      )}
      
      {isOpen && shareData && (
        <div className={`absolute z-50 ${getPositionClasses(position)}`}>
          <SocialShare
            title={shareData.title}
            description={shareData.description}
            url={shareData.url}
            imageUrl={shareData.imageUrl}
            customizable={true}
          />
        </div>
      )}
    </div>
  );
};

// Helper function to get position classes
function getPositionClasses(position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') {
  switch (position) {
    case 'top-right':
      return 'right-0 top-full mt-2';
    case 'top-left':
      return 'left-0 top-full mt-2';
    case 'bottom-right':
      return 'right-0 bottom-full mb-2';
    case 'bottom-left':
      return 'left-0 bottom-full mb-2';
    default:
      return 'right-0 top-full mt-2';
  }
}

export default ShareButton;