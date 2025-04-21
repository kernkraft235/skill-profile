import { Request, Response, NextFunction } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import {
  insertChatMessageSchema,
  insertContactSubmissionSchema,
  insertSkillExampleSchema,
  insertSkillToExampleSchema,
  insertSkillSchema,
  skillSchema,
  type ContentSection,
} from "@shared/schema";
import { createOpenRouter } from "./openrouter";
import {
  handleHomepageOG,
  handleSkillOG,
  handleExampleOG,
  handleSectionOG,
  handleCustomOG
} from "./openGraph";
import {
  handleHomepageOgImage,
  handleSkillOgImage,
  handleExampleOgImage,
  handleSectionOgImage,
  handleCustomOgImage
} from "./ogImageGenerator";

// Initialize OpenRouter client
const openai = createOpenRouter(process.env.OPENROUTER_API_KEY || "dummy-key-for-development");

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Create middleware for admin routes
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  
  // prefix all routes with /api

  // === SKILL CATEGORY ROUTES ===

  // Get root skill categories (level 0)
  app.get(
    "/api/skill-categories/root",
    async (_req: Request, res: Response) => {
      try {
        const categories = await storage.getSkillCategoriesByParentId(null);
        return res.status(200).json(categories);
      } catch (error) {
        console.error("Get root skill categories error:", error);
        return res
          .status(500)
          .json({ message: "Failed to retrieve root skill categories" });
      }
    },
  );

  // Get skill categories by parent id
  app.get(
    "/api/skill-categories/parent/:parentId",
    async (req: Request, res: Response) => {
      try {
        const parentId = parseInt(req.params.parentId);
        if (isNaN(parentId)) {
          return res.status(400).json({ message: "Invalid parent ID" });
        }

        const categories = await storage.getSkillCategoriesByParentId(parentId);
        return res.status(200).json(categories);
      } catch (error) {
        console.error("Get skill categories by parent error:", error);
        return res
          .status(500)
          .json({ message: "Failed to retrieve skill categories" });
      }
    },
  );

  // Get all skill categories
  app.get("/api/skill-categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllSkillCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Get all skill categories error:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve all skill categories" });
    }
  });

  // Get single skill category by id
  app.get("/api/skill-categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await storage.getSkillCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Skill category not found" });
      }

      return res.status(200).json(category);
    } catch (error) {
      console.error("Get skill category error:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve skill category" });
    }
  });

  // === SKILL ROUTES ===

  // Get skills by category id
  app.get(
    "/api/skills/category/:categoryId",
    async (req: Request, res: Response) => {
      try {
        const categoryId = parseInt(req.params.categoryId);
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "Invalid category ID" });
        }

        const skills = await storage.getSkillsByCategoryId(categoryId);
        return res.status(200).json(skills);
      } catch (error) {
        console.error("Get skills by category error:", error);
        return res.status(500).json({ message: "Failed to retrieve skills" });
      }
    },
  );

  // Get all skills
  app.get("/api/skills", async (_req: Request, res: Response) => {
    try {
      const skills = await storage.getAllSkills();
      return res.status(200).json(skills);
    } catch (error) {
      console.error("Get all skills error:", error);
      return res.status(500).json({ message: "Failed to retrieve all skills" });
    }
  });
  
  // Create skill (admin only)
  app.post("/api/skills", requireAdmin, async (req: Request, res: Response) => {
    try {
      const skillData = req.body;
      // Ensure required fields have default values
      const dataWithDefaults = {
        ...skillData,
        icon: skillData.icon || null,
        years: skillData.years || null,
        order: skillData.order || 0
      };
      const validatedData = insertSkillSchema.parse(dataWithDefaults);
      const skill = await storage.createSkill(validatedData);
      return res.status(201).json({ message: "Skill created successfully", skill });
    } catch (error) {
      console.error("Create skill error:", error);
      return res.status(500).json({ message: "Failed to create skill" });
    }
  });
  
  // Update skill (admin only)
  app.put("/api/skills/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const existingSkill = await storage.getSkill(id);
      if (!existingSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      const skillData = req.body;
      // Ensure required fields have default values
      const dataWithDefaults = {
        ...skillData,
        icon: skillData.icon || null,
        years: skillData.years || null,
        order: skillData.order || 0
      };
      const validatedData = insertSkillSchema.parse(dataWithDefaults);
      
      // Update skill in storage
      const updatedSkill = { 
        ...validatedData, 
        id,
        icon: validatedData.icon || null,
        years: validatedData.years || null,
        order: validatedData.order || 0
      };
      await storage.updateSkill(updatedSkill);
      
      return res.status(200).json({ message: "Skill updated successfully", skill: updatedSkill });
    } catch (error) {
      console.error("Update skill error:", error);
      return res.status(500).json({ message: "Failed to update skill" });
    }
  });
  
  // Delete skill (admin only)
  app.delete("/api/skills/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const existingSkill = await storage.getSkill(id);
      if (!existingSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      await storage.deleteSkill(id);
      
      return res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
      console.error("Delete skill error:", error);
      return res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Get single skill by id
  app.get("/api/skills/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }

      const skill = await storage.getSkill(id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      return res.status(200).json(skill);
    } catch (error) {
      console.error("Get skill error:", error);
      return res.status(500).json({ message: "Failed to retrieve skill" });
    }
  });

  // === SKILL EXAMPLES ROUTES ===

  // Get examples by skill id
  app.get(
    "/api/skill-examples/skill/:skillId",
    async (req: Request, res: Response) => {
      try {
        const skillId = parseInt(req.params.skillId);
        if (isNaN(skillId)) {
          return res.status(400).json({ message: "Invalid skill ID" });
        }

        const examples = await storage.getExamplesBySkillId(skillId);
        return res.status(200).json(examples);
      } catch (error) {
        console.error("Get examples by skill error:", error);
        return res.status(500).json({ message: "Failed to retrieve examples" });
      }
    },
  );
  
  // Create a skill-to-example mapping
  app.post(
    "/api/skill-to-example",
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const { skillId, exampleId } = req.body;
        
        if (!skillId || !exampleId || typeof skillId !== "number" || typeof exampleId !== "number") {
          return res.status(400).json({ message: "Valid skill ID and example ID are required" });
        }
        
        const mapping = await storage.createSkillToExample({
          skillId,
          exampleId
        });
        
        return res.status(201).json(mapping);
      } catch (error) {
        console.error("Create skill-to-example mapping error:", error);
        return res.status(500).json({ message: "Failed to create mapping" });
      }
    }
  );
  
  // Delete all skill-to-example mappings for a specific example
  app.delete(
    "/api/skill-to-example/example/:exampleId",
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const exampleId = parseInt(req.params.exampleId);
        if (isNaN(exampleId)) {
          return res.status(400).json({ message: "Invalid example ID" });
        }
        
        // Get the skills associated with this example first
        const skills = await storage.getSkillsByExampleId(exampleId);
        
        // Delete the mappings
        await Promise.all(skills.map(skill => 
          storage.deleteSkillToExample(skill.id, exampleId)
        ));
        
        return res.status(200).json({ message: "Mappings deleted successfully" });
      } catch (error) {
        console.error("Delete skill-to-example mappings error:", error);
        return res.status(500).json({ message: "Failed to delete mappings" });
      }
    }
  );

  // Get examples by multiple skill ids (for filtering)
  app.post(
    "/api/skill-examples/filter",
    async (req: Request, res: Response) => {
      try {
        const { skillIds } = req.body;

        if (
          !Array.isArray(skillIds) ||
          skillIds.some((id) => typeof id !== "number")
        ) {
          return res.status(400).json({ message: "Invalid skill IDs" });
        }

        const examples = await storage.getExamplesBySkillIds(skillIds);
        return res.status(200).json(examples);
      } catch (error) {
        console.error("Filter examples error:", error);
        return res.status(500).json({ message: "Failed to filter examples" });
      }
    },
  );

  // Get all skill examples
  app.get("/api/skill-examples", async (_req: Request, res: Response) => {
    try {
      const examples = await storage.getAllSkillExamples();
      return res.status(200).json(examples);
    } catch (error) {
      console.error("Get all examples error:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve all examples" });
    }
  });

  // Get single example by id
  app.get("/api/skill-examples/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid example ID" });
      }

      const example = await storage.getSkillExample(id);
      if (!example) {
        return res.status(404).json({ message: "Example not found" });
      }

      // Get the skills associated with this example
      const skills = await storage.getSkillsByExampleId(id);

      return res.status(200).json({
        ...example,
        skills,
      });
    } catch (error) {
      console.error("Get example error:", error);
      return res.status(500).json({ message: "Failed to retrieve example" });
    }
  });

  // Create synthetic example
  app.post(
    "/api/skill-examples/synthetic",
    async (req: Request, res: Response) => {
      try {
        const { prompt, relatedSkillIds } = req.body;

        if (!prompt || typeof prompt !== "string") {
          return res.status(400).json({ message: "Prompt is required" });
        }

        if (!Array.isArray(relatedSkillIds) || relatedSkillIds.length === 0) {
          return res
            .status(400)
            .json({ message: "At least one skill ID is required" });
        }

        // Get the skills associated with the provided skill IDs
        const skills = await Promise.all(
          relatedSkillIds.map((id) => storage.getSkill(id)),
        );

        // Filter out any undefined skills (in case of invalid skill IDs)
        const validSkills = skills.filter((skill) => skill !== undefined);

        if (validSkills.length === 0) {
          return res.status(400).json({ message: "No valid skills found" });
        }

        // Get existing examples for these skills to use as context
        const existingExamples =
          await storage.getExamplesBySkillIds(relatedSkillIds);

        // Generate synthetic example using OpenAI
        try {
          // Using OpenRouter to access AI models
          const response = await openai.chat.completions.create({
            model: "anthropic/claude-3-opus:2024-05-07",
            messages: [
              {
                role: "system",
                content: `You are an expert at creating realistic portfolio examples that demonstrate specific skills. 
              Generate a detailed, realistic example project or work experience that demonstrates the following skills: 
              ${validSkills.map((skill) => skill.name).join(", ")}.
              
              Use these existing examples as a reference for style and detail level:
              ${existingExamples.map((ex) => `Title: ${ex.title}\nDescription: ${ex.description}\nDetails: ${ex.details}`).join("\n\n")}
              
              Create a response in JSON format with these fields:
              - title: A concise, professional title for the example (max 100 chars)
              - description: A brief summary of the example (max 200 chars)
              - details: Detailed explanation of the example, including challenges, approach, and outcomes (500-800 chars)
              - image: Leave this as null
              - link: Leave this as null`,
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000,
          });

          const generatedContent = JSON.parse(
            response.choices[0].message.content || "{}",
          );

          // Create a new skill example
          const exampleData = insertSkillExampleSchema.parse({
            title: generatedContent.title,
            description: generatedContent.description,
            details: generatedContent.details,
            image: "https://placehold.co/600x400?text=AI+Generated+Example",
            link: null,
            isSynthetic: true,
          });

          const newExample = await storage.createSkillExample(exampleData);

          // Associate the example with the skills
          await Promise.all(
            relatedSkillIds.map((skillId) =>
              storage.createSkillToExample({
                skillId,
                exampleId: newExample.id,
              }),
            ),
          );

          return res.status(200).json({
            message: "Successfully generated synthetic example",
            example: {
              ...newExample,
              skills: validSkills,
            },
          });
        } catch (error) {
          console.error("OpenAI API error:", error);
          return res
            .status(500)
            .json({ message: "Failed to generate synthetic example" });
        }
      } catch (error) {
        console.error("Create synthetic example error:", error);
        return res
          .status(500)
          .json({ message: "Failed to create synthetic example" });
      }
    },
  );

  // === CHAT ROUTES ===

  // Chat endpoint to handle Q&A with RAG
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { question } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Question is required" });
      }

      // Get relevant context from the storage
      const relevantContexts = await storage.searchRagContexts(question);
      let contextText = "";

      if (relevantContexts.length > 0) {
        contextText = relevantContexts.map((ctx) => ctx.content).join("\n\n");
      }

      // Generate answer using OpenAI
      let answer = "";
      try {
        // Using OpenRouter to access AI models
        const response = await openai.chat.completions.create({
          model: "anthropic/claude-3-opus:2024-05-07",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that provides information about a portfolio owner's professional experience.
              Use the following context information to answer the user's question:
              ${contextText}
              
              If the context doesn't contain enough information to answer the question, respond with what you know about the portfolio owner based on the context provided.
              Keep your answers concise and professional.`,
            },
            {
              role: "user",
              content: question,
            },
          ],
          max_tokens: 500,
        });

        answer =
          response.choices[0].message.content ||
          "I'm sorry, I couldn't generate a response at this time.";
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fallback answer if the API call fails
        answer =
          "I'm experiencing some technical difficulties right now. Please try again later.";
      }

      // Store the chat exchange
      const validatedData = insertChatMessageSchema.parse({
        question,
        answer,
      });

      const chatMessage = await storage.createChatMessage(validatedData);

      return res.status(200).json({
        message: "Successfully generated answer",
        answer,
        question,
      });
    } catch (error) {
      console.error("Chat endpoint error:", error);
      return res
        .status(500)
        .json({ message: "Failed to process your question" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (_req: Request, res: Response) => {
    try {
      const messages = await storage.getChatMessages();
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Get chat history error:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve chat history" });
    }
  });

  // === CONTACT ROUTES ===

  // Contact form submission
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const submission = req.body;

      // Validate the submission with zod schema
      const validatedData = insertContactSubmissionSchema.parse(submission);

      // Store the submission
      const savedSubmission =
        await storage.createContactSubmission(validatedData);

      return res.status(200).json({
        message: "Contact form submitted successfully",
        submission: savedSubmission,
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      return res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // === PORTFOLIO DATA ROUTES ===

  // Content Sections API
  app.get("/api/content-sections", async (_req: Request, res: Response) => {
    try {
      const sections = await storage.getAllContentSections();
      res.json(sections);
    } catch (error) {
      console.error("Error fetching content sections:", error);
      res.status(500).json({ error: "Error fetching content sections" });
    }
  });

  app.get("/api/content-sections/:type", async (req: Request, res: Response) => {
    try {
      const sectionType = req.params.type;
      const sections = await storage.getContentSectionsByType(sectionType);
      res.json(sections);
    } catch (error) {
      console.error(`Error fetching ${req.params.type} sections:`, error);
      res.status(500).json({ error: `Error fetching ${req.params.type} sections` });
    }
  });

  app.get("/api/content-sections/id/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const section = await storage.getContentSection(id);
      if (!section) {
        return res.status(404).json({ error: "Content section not found" });
      }
      
      res.json(section);
    } catch (error) {
      console.error("Error fetching content section:", error);
      res.status(500).json({ error: "Error fetching content section" });
    }
  });

  app.post("/api/content-sections", requireAdmin, async (req: Request, res: Response) => {
    try {
      const newSection = await storage.createContentSection(req.body);
      res.status(201).json(newSection);
    } catch (error) {
      console.error("Error creating content section:", error);
      res.status(500).json({ error: "Error creating content section" });
    }
  });

  app.put("/api/content-sections/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const existingSection = await storage.getContentSection(id);
      if (!existingSection) {
        return res.status(404).json({ error: "Content section not found" });
      }
      
      const updatedSection = await storage.updateContentSection({
        ...req.body,
        id,
      });
      
      res.json(updatedSection);
    } catch (error) {
      console.error("Error updating content section:", error);
      res.status(500).json({ error: "Error updating content section" });
    }
  });

  app.delete("/api/content-sections/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const existingSection = await storage.getContentSection(id);
      if (!existingSection) {
        return res.status(404).json({ error: "Content section not found" });
      }
      
      await storage.deleteContentSection(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting content section:", error);
      res.status(500).json({ error: "Error deleting content section" });
    }
  });

  // Get portfolio data
  app.get("/api/portfolio", async (_req: Request, res: Response) => {
    try {
      // Get RAG contexts which contain basic portfolio data
      const aboutData = await storage.getRagContextsBySection("about");

      // Get skill hierarchy data
      const rootCategories = await storage.getSkillCategoriesByParentId(null);
      
      // Get content sections (about_me, work_experience, personal_interests)
      const contentSections = await storage.getAllContentSections();
      
      // Organize content sections by type
      const aboutMeSections = contentSections.filter((section: ContentSection) => section.section === 'about_me');
      const workExperienceSections = contentSections.filter((section: ContentSection) => section.section === 'work_experience');
      const personalInterestsSections = contentSections.filter((section: ContentSection) => section.section === 'personal_interests');

      // Format the data for the frontend
      const portfolio = {
        about: aboutData,
        skillCategories: rootCategories,
        contentSections: {
          aboutMe: aboutMeSections,
          workExperience: workExperienceSections,
          personalInterests: personalInterestsSections,
          all: contentSections
        }
      };

      return res.status(200).json(portfolio);
    } catch (error) {
      console.error("Get portfolio data error:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve portfolio data" });
    }
  });

  // === OPEN GRAPH AND SOCIAL SHARE ROUTES ===

  // OpenGraph meta tags for different page types
  app.get("/api/og-meta/home", handleHomepageOG);
  app.get("/api/og-meta/skill/:id", handleSkillOG);
  app.get("/api/og-meta/example/:id", handleExampleOG);
  app.get("/api/og-meta/section/:type", handleSectionOG);
  app.get("/api/og-meta/custom", handleCustomOG);

  // OpenGraph image generation for social sharing
  app.get("/api/og-image/home", handleHomepageOgImage);
  app.get("/api/og-image/skill/:id", handleSkillOgImage);
  app.get("/api/og-image/example/:id", handleExampleOgImage);
  app.get("/api/og-image/section/:type", handleSectionOgImage);
  app.get("/api/og-image/custom", handleCustomOgImage);

  // Share URL shortener and tracking
  app.post("/api/share", async (req: Request, res: Response) => {
    try {
      const { title, description, url, type } = req.body;
      
      if (!title || !description || !url) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // For now, we'll just return the full URL since we don't have URL shortening
      // In the future, this could be implemented with a database for shortened URLs
      return res.status(200).json({ 
        shareUrl: url,
        ogUrl: `/api/og-meta/custom?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}&type=${type || 'article'}`,
        imageUrl: `/api/og-image/custom?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`
      });
    } catch (error) {
      console.error("Share URL error:", error);
      return res.status(500).json({ message: "Failed to create share URL" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
