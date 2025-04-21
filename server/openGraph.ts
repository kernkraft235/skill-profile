import { Request, Response } from "express";
import { storage } from "./storage";

// Types for open graph metadata
interface OpenGraphData {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
  type: string;
}

// Function to generate Open Graph HTML tags
export function generateOpenGraphTags(data: OpenGraphData): string {
  const { title, description, imageUrl, url, type } = data;
  
  let tags = `
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
  `;
  
  // Add image if provided
  if (imageUrl) {
    tags += `
      <meta property="og:image" content="${escapeHtml(imageUrl)}" />
      <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    `;
  }
  
  return tags;
}

// Helper to escape HTML characters in meta tags
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Handle OG meta tags for home page
export async function handleHomepageOG(req: Request, res: Response) {
  try {
    // Get about me content from storage for the description
    const aboutMeSections = await storage.getContentSectionsByType("about_me");
    const firstAboutMe = aboutMeSections[0];
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const title = "Graham Colehour | Technical Profile";
    const description = firstAboutMe 
      ? firstAboutMe.content.substring(0, 160) + (firstAboutMe.content.length > 160 ? '...' : '')
      : "Technical profile showcasing skills, experience, and capabilities.";
    
    const openGraphData: OpenGraphData = {
      title,
      description,
      url: baseUrl,
      type: "website",
      imageUrl: `${baseUrl}/api/og-image/home`,
    };
    
    res.send(generateOpenGraphTags(openGraphData));
  } catch (error) {
    console.error("Error generating home OG tags:", error);
    res.status(500).send("Error generating Open Graph tags");
  }
}

// Handle OG meta tags for skill page
export async function handleSkillOG(req: Request, res: Response) {
  try {
    const skillId = parseInt(req.params.id);
    
    if (isNaN(skillId)) {
      return res.status(400).send("Invalid skill ID");
    }
    
    const skill = await storage.getSkill(skillId);
    
    if (!skill) {
      return res.status(404).send("Skill not found");
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const title = `${skill.name} | Graham Colehour`;
    const description = skill.description;
    
    const openGraphData: OpenGraphData = {
      title,
      description,
      url: `${baseUrl}/skills/${skillId}`,
      type: "article",
      imageUrl: `${baseUrl}/api/og-image/skill/${skillId}`,
    };
    
    res.send(generateOpenGraphTags(openGraphData));
  } catch (error) {
    console.error("Error generating skill OG tags:", error);
    res.status(500).send("Error generating Open Graph tags");
  }
}

// Handle OG meta tags for example page
export async function handleExampleOG(req: Request, res: Response) {
  try {
    const exampleId = parseInt(req.params.id);
    
    if (isNaN(exampleId)) {
      return res.status(400).send("Invalid example ID");
    }
    
    const example = await storage.getSkillExample(exampleId);
    
    if (!example) {
      return res.status(404).send("Example not found");
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const title = `${example.title} | Graham Colehour`;
    const description = example.description;
    
    const openGraphData: OpenGraphData = {
      title,
      description,
      url: `${baseUrl}/examples/${exampleId}`,
      type: "article",
      imageUrl: example.image || `${baseUrl}/api/og-image/example/${exampleId}`,
    };
    
    res.send(generateOpenGraphTags(openGraphData));
  } catch (error) {
    console.error("Error generating example OG tags:", error);
    res.status(500).send("Error generating Open Graph tags");
  }
}

// Handle OG meta tags for content sections (About Me, Work Experience, etc)
export async function handleSectionOG(req: Request, res: Response) {
  try {
    const sectionType = req.params.type;
    const sections = await storage.getContentSectionsByType(sectionType);
    
    if (!sections || sections.length === 0) {
      return res.status(404).send("Section not found");
    }
    
    const firstSection = sections[0];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Format the section type to be more readable
    const sectionTitle = sectionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const title = `${sectionTitle} | Graham Colehour`;
    const description = firstSection.content.substring(0, 160) + 
      (firstSection.content.length > 160 ? '...' : '');
    
    const openGraphData: OpenGraphData = {
      title,
      description,
      url: `${baseUrl}/${sectionType.replace('_', '-')}`,
      type: "article",
      imageUrl: `${baseUrl}/api/og-image/section/${sectionType}`,
    };
    
    res.send(generateOpenGraphTags(openGraphData));
  } catch (error) {
    console.error("Error generating section OG tags:", error);
    res.status(500).send("Error generating Open Graph tags");
  }
}

// For custom sharing scenarios
export async function handleCustomOG(req: Request, res: Response) {
  try {
    const { title, description, imageUrl, url, type } = req.query;
    
    if (!title || !description || !url) {
      return res.status(400).send("Missing required fields");
    }
    
    const openGraphData: OpenGraphData = {
      title: title.toString(),
      description: description.toString(),
      url: url.toString(),
      type: type?.toString() || "article",
      imageUrl: imageUrl?.toString(),
    };
    
    res.send(generateOpenGraphTags(openGraphData));
  } catch (error) {
    console.error("Error generating custom OG tags:", error);
    res.status(500).send("Error generating Open Graph tags");
  }
}