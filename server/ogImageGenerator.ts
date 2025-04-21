import { Request, Response } from 'express';
import { storage } from './storage';
import { PORTFOLIO_OWNER } from '../client/src/lib/constants';

/**
 * Generate HTML template for OpenGraph images
 */
function generateOgImageHtml({
  title,
  subtitle,
  accent = '#7c3aed', // Default to purple
  footerText = PORTFOLIO_OWNER.name
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  footerText?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            width: 1200px;
            height: 630px;
            background-color: #121212; /* Dark background */
            color: #ffffff;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: space-between;
            padding: 60px;
            position: relative;
            overflow: hidden;
          }
          
          .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            opacity: 0.1;
            background: 
              radial-gradient(circle at 10% 20%, ${accent}60 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, ${accent}40 0%, transparent 40%);
          }
          
          .gradient-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 200px;
            background: linear-gradient(to top, #121212, transparent);
            z-index: 0;
          }
          
          .content {
            position: relative;
            z-index: 1;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          h1 {
            font-size: 72px;
            font-weight: 800;
            margin-bottom: 24px;
            background: linear-gradient(to right, #ffffff, ${accent});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
            max-width: 1000px;
            line-height: 1.2;
          }
          
          p {
            font-size: 32px;
            color: #d1d5db;
            max-width: 900px;
            line-height: 1.4;
          }
          
          .footer {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            border-top: 1px solid #333;
            padding-top: 24px;
          }
          
          .profile {
            display: flex;
            align-items: center;
          }
          
          .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: ${accent};
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            font-size: 24px;
            font-weight: bold;
          }
          
          .name {
            font-size: 24px;
            font-weight: 600;
          }
          
          .subtitle {
            font-size: 18px;
            color: #9ca3af;
          }
          
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #ffffff;
          }
          
          .tag {
            background-color: ${accent}30;
            color: ${accent};
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 18px;
            font-weight: 600;
            margin-left: 12px;
          }
        </style>
      </head>
      <body>
        <div class="background"></div>
        <div class="gradient-overlay"></div>
        
        <div class="content">
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        
        <div class="footer">
          <div class="profile">
            <div class="avatar">${footerText.charAt(0)}</div>
            <div>
              <div class="name">${footerText}</div>
              <div class="subtitle">Technical Profile</div>
            </div>
          </div>
          
          <div class="logo">
            Technical Profile<span class="tag">Profile</span>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate an OpenGraph image for the homepage
 */
export async function handleHomepageOgImage(req: Request, res: Response) {
  try {
    const html = generateOgImageHtml({
      title: `${PORTFOLIO_OWNER.name}'s Technical Profile`,
      subtitle: 'Explore skills, experience, and examples of technical problem-solving',
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating homepage OG image:', error);
    res.status(500).send('Error generating image');
  }
}

/**
 * Generate an OpenGraph image for a skill
 */
export async function handleSkillOgImage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const skill = await storage.getSkill(Number(id));
    
    if (!skill) {
      return res.status(404).send('Skill not found');
    }
    
    const html = generateOgImageHtml({
      title: skill.name,
      subtitle: skill.description,
      accent: '#6366f1', // Indigo
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating skill OG image:', error);
    res.status(500).send('Error generating image');
  }
}

/**
 * Generate an OpenGraph image for an example
 */
export async function handleExampleOgImage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const example = await storage.getSkillExample(Number(id));
    
    if (!example) {
      return res.status(404).send('Example not found');
    }
    
    const html = generateOgImageHtml({
      title: example.title,
      subtitle: example.description,
      accent: '#ec4899', // Pink
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating example OG image:', error);
    res.status(500).send('Error generating image');
  }
}

/**
 * Generate an OpenGraph image for a content section
 */
export async function handleSectionOgImage(req: Request, res: Response) {
  try {
    const { type } = req.params;
    const sections = await storage.getContentSectionsByType(type);
    
    if (!sections || sections.length === 0) {
      return res.status(404).send('Section not found');
    }
    
    let title, subtitle, accent;
    
    switch (type) {
      case 'about_me':
        title = `About ${PORTFOLIO_OWNER.name}`;
        subtitle = 'Learn more about my background and approach to work';
        accent = '#10b981'; // Emerald
        break;
      case 'work_experience':
        title = `${PORTFOLIO_OWNER.name}'s Work Experience`;
        subtitle = 'Explore my professional journey and achievements';
        accent = '#3b82f6'; // Blue
        break;
      case 'personal_interests':
        title = `${PORTFOLIO_OWNER.name}'s Interests`;
        subtitle = 'Discover what drives and inspires me outside of work';
        accent = '#ef4444'; // Red
        break;
      default:
        title = `${PORTFOLIO_OWNER.name}'s Technical Profile`;
        subtitle = 'Explore my skills, experience, and interests';
        accent = '#7c3aed'; // Purple
    }
    
    const html = generateOgImageHtml({
      title,
      subtitle,
      accent,
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating section OG image:', error);
    res.status(500).send('Error generating image');
  }
}

/**
 * Generate a custom OpenGraph image
 */
export async function handleCustomOgImage(req: Request, res: Response) {
  try {
    const { title, subtitle, accent } = req.query;
    
    if (!title) {
      return res.status(400).send('Title is required');
    }
    
    const html = generateOgImageHtml({
      title: title as string,
      subtitle: subtitle as string,
      accent: accent as string,
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating custom OG image:', error);
    res.status(500).send('Error generating image');
  }
}