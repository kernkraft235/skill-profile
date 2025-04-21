import { Request, Response } from "express";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

// Generate a simple HTML template for the OG image
function generateOgImageHtml({
  title,
  subtitle,
  bgColor = "#1e1e1e",
  textColor = "#ffffff",
  accentColor = "#6366f1",
  imageUrl
}: {
  title: string;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  imageUrl?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1200px;
      height: 630px;
      overflow: hidden;
    }
    .container {
      width: 1080px;
      height: 540px;
      display: flex;
      flex-direction: ${imageUrl ? 'row' : 'column'};
      align-items: center;
      justify-content: center;
      padding: 40px;
      border-radius: 16px;
      position: relative;
      background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .content {
      ${imageUrl ? 'flex: 1;' : ''}
      display: flex;
      flex-direction: column;
      align-items: ${imageUrl ? 'flex-start' : 'center'};
      justify-content: center;
      z-index: 2;
      text-align: ${imageUrl ? 'left' : 'center'};
    }
    .title {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 16px;
      background: linear-gradient(90deg, ${textColor} 0%, ${accentColor} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 24px;
      font-weight: 400;
      opacity: 0.8;
      line-height: 1.4;
      max-width: ${imageUrl ? '90%' : '700px'};
    }
    .image-container {
      ${imageUrl ? 'flex: 1;' : ''}
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .image {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      object-fit: contain;
    }
    .logo {
      position: absolute;
      bottom: 40px;
      right: 40px;
      font-size: 20px;
      font-weight: 700;
      opacity: 0.8;
    }
    .pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2%, transparent 0%);
      background-size: 50px 50px;
      opacity: 0.3;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="pattern"></div>
    
    <div class="content">
      <h1 class="title">${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </div>
    
    ${imageUrl ? `
    <div class="image-container">
      <img src="${imageUrl}" alt="${title}" class="image" />
    </div>
    ` : ''}
    
    <div class="logo">Graham Colehour</div>
  </div>
</body>
</html>
  `;
}

// Handler for home page OG image
export async function handleHomepageOgImage(req: Request, res: Response) {
  try {
    // Get about me content from storage for the description
    const aboutMeSections = await storage.getContentSectionsByType("about_me");
    const firstAboutMe = aboutMeSections[0];
    
    const title = "Graham Colehour";
    const subtitle = firstAboutMe 
      ? firstAboutMe.content.substring(0, 100) + (firstAboutMe.content.length > 100 ? '...' : '')
      : "Technical Profile & Portfolio";
    
    const htmlContent = generateOgImageHtml({ title, subtitle });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    console.error("Error generating home OG image:", error);
    res.status(500).send("Error generating Open Graph image");
  }
}

// Handler for skill OG image
export async function handleSkillOgImage(req: Request, res: Response) {
  try {
    const skillId = parseInt(req.params.id);
    
    if (isNaN(skillId)) {
      return res.status(400).send("Invalid skill ID");
    }
    
    const skill = await storage.getSkill(skillId);
    
    if (!skill) {
      return res.status(404).send("Skill not found");
    }
    
    // Get the category for additional context
    const category = await storage.getSkillCategory(skill.categoryId);
    
    const title = skill.name;
    const subtitle = `${skill.description} ${category ? `• ${category.name} Category` : ''}`;
    
    const htmlContent = generateOgImageHtml({ 
      title, 
      subtitle,
      accentColor: "#3b82f6" // blue for skills
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    console.error("Error generating skill OG image:", error);
    res.status(500).send("Error generating Open Graph image");
  }
}

// Handler for example OG image
export async function handleExampleOgImage(req: Request, res: Response) {
  try {
    const exampleId = parseInt(req.params.id);
    
    if (isNaN(exampleId)) {
      return res.status(400).send("Invalid example ID");
    }
    
    const example = await storage.getSkillExample(exampleId);
    
    if (!example) {
      return res.status(404).send("Example not found");
    }
    
    // Get the related skills
    const relatedSkills = await storage.getSkillsByExampleId(exampleId);
    const skillNames = relatedSkills.map(skill => skill.name).join(", ");
    
    const title = example.title;
    const subtitle = example.description;
    let imageUrl = example.image || undefined;
    
    const htmlContent = generateOgImageHtml({ 
      title, 
      subtitle,
      imageUrl,
      accentColor: "#10b981" // green for examples
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    console.error("Error generating example OG image:", error);
    res.status(500).send("Error generating Open Graph image");
  }
}

// Handler for content section OG image
export async function handleSectionOgImage(req: Request, res: Response) {
  try {
    const sectionType = req.params.type;
    const sections = await storage.getContentSectionsByType(sectionType);
    
    if (!sections || sections.length === 0) {
      return res.status(404).send("Section not found");
    }
    
    const firstSection = sections[0];
    
    // Format the section type to be more readable
    const sectionTitle = sectionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const title = sectionTitle;
    const subtitle = firstSection.content.substring(0, 120) + 
      (firstSection.content.length > 120 ? '...' : '');
    
    // Select color based on section type
    let accentColor = "#8b5cf6"; // Default purple
    if (sectionType === "about_me") {
      accentColor = "#ec4899"; // Pink for about me
    } else if (sectionType === "work_experience") {
      accentColor = "#f59e0b"; // Amber for work experience
    } else if (sectionType === "personal_interests") {
      accentColor = "#06b6d4"; // Cyan for personal interests
    }
    
    const htmlContent = generateOgImageHtml({ 
      title, 
      subtitle,
      accentColor
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    console.error("Error generating section OG image:", error);
    res.status(500).send("Error generating Open Graph image");
  }
}

// Handler for custom OG image
export async function handleCustomOgImage(req: Request, res: Response) {
  try {
    const { title, subtitle, imageUrl } = req.query;
    
    if (!title) {
      return res.status(400).send("Missing required title field");
    }
    
    const htmlContent = generateOgImageHtml({ 
      title: title.toString(), 
      subtitle: subtitle?.toString(),
      imageUrl: imageUrl?.toString()
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    console.error("Error generating custom OG image:", error);
    res.status(500).send("Error generating Open Graph image");
  }
}