import { Request, Response } from 'express';
import { storage } from './storage';
import { PORTFOLIO_OWNER } from '../client/src/lib/constants';

interface OpenGraphData {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
  type: string;
}

/**
 * Generate OpenGraph meta tags based on the provided data
 */
export function generateOpenGraphTags(data: OpenGraphData): string {
  const baseUrl = process.env.BASE_URL || 'https://graham-colehour-profile.replit.app';
  
  return `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${escapeHtml(data.title)}">
    <meta name="description" content="${escapeHtml(data.description)}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${escapeHtml(data.type)}">
    <meta property="og:url" content="${escapeHtml(data.url)}">
    <meta property="og:title" content="${escapeHtml(data.title)}">
    <meta property="og:description" content="${escapeHtml(data.description)}">
    ${data.imageUrl ? `<meta property="og:image" content="${escapeHtml(data.imageUrl)}">` : ''}
    <meta property="og:site_name" content="${escapeHtml(PORTFOLIO_OWNER.name)}'s Technical Profile">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${escapeHtml(data.url)}">
    <meta property="twitter:title" content="${escapeHtml(data.title)}">
    <meta property="twitter:description" content="${escapeHtml(data.description)}">
    ${data.imageUrl ? `<meta property="twitter:image" content="${escapeHtml(data.imageUrl)}">` : ''}
    
    <!-- iOS Specific Meta Tags -->
    <meta property="al:ios:url" content="${escapeHtml(data.url)}">
    <meta property="al:ios:app_name" content="${escapeHtml(PORTFOLIO_OWNER.name)}'s Technical Profile">
    <meta property="al:ios:app_store_id" content="123456789"> <!-- Placeholder app store ID -->
    ${data.imageUrl ? `
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="apple-touch-icon" href="${escapeHtml(data.imageUrl)}">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    ` : ''}
  `;
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Handle OpenGraph tags for the homepage
 */
export async function handleHomepageOG(req: Request, res: Response) {
  try {
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/api/og-image/home`;
    
    const openGraphData: OpenGraphData = {
      title: `${PORTFOLIO_OWNER.name}'s Technical Profile`,
      description: `Explore ${PORTFOLIO_OWNER.name}'s skills, experience, and interests through interactive applications designed to showcase what they can bring to your team.`,
      imageUrl,
      url: `${baseUrl}/`,
      type: 'website',
    };
    
    const ogTags = generateOpenGraphTags(openGraphData);
    res.send(ogTags);
  } catch (error) {
    console.error('Error generating OG tags for homepage:', error);
    res.status(500).send('Error generating OG tags');
  }
}

/**
 * Handle OpenGraph tags for skill pages
 */
export async function handleSkillOG(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const skill = await storage.getSkill(Number(id));
    
    if (!skill) {
      return res.status(404).send('Skill not found');
    }
    
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/api/og-image/skill/${id}`;
    
    const openGraphData: OpenGraphData = {
      title: `${skill.name} - ${PORTFOLIO_OWNER.name}'s Skills`,
      description: skill.description,
      imageUrl,
      url: `${baseUrl}/skills/${id}`,
      type: 'article',
    };
    
    const ogTags = generateOpenGraphTags(openGraphData);
    res.send(ogTags);
  } catch (error) {
    console.error('Error generating OG tags for skill:', error);
    res.status(500).send('Error generating OG tags');
  }
}

/**
 * Handle OpenGraph tags for example pages
 */
export async function handleExampleOG(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const example = await storage.getSkillExample(Number(id));
    
    if (!example) {
      return res.status(404).send('Example not found');
    }
    
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/api/og-image/example/${id}`;
    
    const openGraphData: OpenGraphData = {
      title: `${example.title} - Project Example`,
      description: example.description,
      imageUrl,
      url: `${baseUrl}/examples/${id}`,
      type: 'article',
    };
    
    const ogTags = generateOpenGraphTags(openGraphData);
    res.send(ogTags);
  } catch (error) {
    console.error('Error generating OG tags for example:', error);
    res.status(500).send('Error generating OG tags');
  }
}

/**
 * Handle OpenGraph tags for content section pages
 */
export async function handleSectionOG(req: Request, res: Response) {
  try {
    const { type } = req.params;
    const sections = await storage.getContentSectionsByType(type);
    
    if (!sections || sections.length === 0) {
      return res.status(404).send('Section not found');
    }
    
    let title, description;
    
    switch (type) {
      case 'about_me':
        title = `About ${PORTFOLIO_OWNER.name}`;
        description = `Learn more about ${PORTFOLIO_OWNER.name}'s background, experience, and approach to work.`;
        break;
      case 'work_experience':
        title = `${PORTFOLIO_OWNER.name}'s Work Experience`;
        description = `Explore ${PORTFOLIO_OWNER.name}'s professional journey and career achievements.`;
        break;
      case 'personal_interests':
        title = `${PORTFOLIO_OWNER.name}'s Interests`;
        description = `Discover what drives and inspires ${PORTFOLIO_OWNER.name} outside of work.`;
        break;
      default:
        title = `${PORTFOLIO_OWNER.name}'s Technical Profile`;
        description = `Explore ${PORTFOLIO_OWNER.name}'s skills, experience, and interests.`;
    }
    
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/api/og-image/section/${type}`;
    
    const openGraphData: OpenGraphData = {
      title,
      description,
      imageUrl,
      url: `${baseUrl}/${type.replace('_', '-')}`,
      type: 'article',
    };
    
    const ogTags = generateOpenGraphTags(openGraphData);
    res.send(ogTags);
  } catch (error) {
    console.error('Error generating OG tags for section:', error);
    res.status(500).send('Error generating OG tags');
  }
}

/**
 * Handle custom OpenGraph tags
 */
export async function handleCustomOG(req: Request, res: Response) {
  try {
    const { title, description, url, type } = req.query;
    
    if (!title || !description || !url) {
      return res.status(400).send('Missing required parameters');
    }
    
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/api/og-image/custom?title=${encodeURIComponent(title as string)}&subtitle=${encodeURIComponent(description as string)}`;
    
    const openGraphData: OpenGraphData = {
      title: title as string,
      description: description as string,
      imageUrl,
      url: url as string,
      type: (type as string) || 'article',
    };
    
    const ogTags = generateOpenGraphTags(openGraphData);
    res.send(ogTags);
  } catch (error) {
    console.error('Error generating custom OG tags:', error);
    res.status(500).send('Error generating OG tags');
  }
}