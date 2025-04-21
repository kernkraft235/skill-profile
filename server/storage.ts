import {
  users,
  type User,
  type InsertUser,
  chatMessages,
  type ChatMessage,
  type InsertChatMessage,
  contactSubmissions,
  type ContactSubmission,
  type InsertContactSubmission,
  ragContexts,
  type RagContext,
  type InsertRagContext,
  skillCategories,
  type SkillCategory,
  type InsertSkillCategory,
  skills,
  type Skill,
  type InsertSkill,
  skillExamples,
  type SkillExample,
  type InsertSkillExample,
  skillToExample,
  type SkillToExample,
  type InsertSkillToExample,
  contentSections,
  type ContentSection,
  type InsertContentSection,
} from "@shared/schema";
import { db } from "./db";
import { eq, isNull, inArray, desc, or, ilike } from "drizzle-orm";

// Interface defining all storage operations
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Skill Category operations
  createSkillCategory(category: InsertSkillCategory): Promise<SkillCategory>;
  getSkillCategory(id: number): Promise<SkillCategory | undefined>;
  getAllSkillCategories(): Promise<SkillCategory[]>;
  getSkillCategoriesByParentId(
    parentId: number | null,
  ): Promise<SkillCategory[]>;

  // Skill operations
  createSkill(skill: InsertSkill): Promise<Skill>;
  getSkill(id: number): Promise<Skill | undefined>;
  getAllSkills(): Promise<Skill[]>;
  getSkillsByCategoryId(categoryId: number): Promise<Skill[]>;
  updateSkill(skill: Skill): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;

  // Skill Example operations
  createSkillExample(example: InsertSkillExample): Promise<SkillExample>;
  getSkillExample(id: number): Promise<SkillExample | undefined>;
  getAllSkillExamples(): Promise<SkillExample[]>;

  // Skill to Example mapping operations
  createSkillToExample(mapping: InsertSkillToExample): Promise<SkillToExample>;
  getExamplesBySkillId(skillId: number): Promise<SkillExample[]>;
  getSkillsByExampleId(exampleId: number): Promise<Skill[]>;
  getExamplesBySkillIds(skillIds: number[]): Promise<SkillExample[]>;

  // Chat message operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(limit?: number): Promise<ChatMessage[]>;

  // Contact form operations
  createContactSubmission(
    submission: InsertContactSubmission,
  ): Promise<ContactSubmission>;

  // RAG context operations
  createRagContext(context: InsertRagContext): Promise<RagContext>;
  getAllRagContexts(): Promise<RagContext[]>;
  getRagContextsBySection(section: string): Promise<RagContext[]>;
  searchRagContexts(query: string): Promise<RagContext[]>;
  
  // Content Section operations (About Me, Work Experience, Personal Interests)
  createContentSection(section: InsertContentSection): Promise<ContentSection>;
  getContentSection(id: number): Promise<ContentSection | undefined>;
  getContentSectionsByType(sectionType: string): Promise<ContentSection[]>;
  updateContentSection(section: ContentSection): Promise<ContentSection>;
  deleteContentSection(id: number): Promise<void>;
  getAllContentSections(): Promise<ContentSection[]>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  // Implementation for updateSkill and deleteSkill
  async updateSkill(skill: Skill): Promise<Skill> {
    if (!this.skills.has(skill.id)) {
      throw new Error(`Skill with ID ${skill.id} not found`);
    }
    this.skills.set(skill.id, skill);
    return skill;
  }

  async deleteSkill(id: number): Promise<void> {
    if (!this.skills.has(id)) {
      throw new Error(`Skill with ID ${id} not found`);
    }
    this.skills.delete(id);
    
    // Also delete any skill-to-example mappings
    const mappingsToDelete = Array.from(this.skillToExamples.entries())
      .filter(([_, mapping]) => mapping.skillId === id);
    
    for (const [mappingId] of mappingsToDelete) {
      this.skillToExamples.delete(mappingId);
    }
  }
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private ragContexts: Map<number, RagContext>;
  private skillCategories: Map<number, SkillCategory>;
  private skills: Map<number, Skill>;
  private skillExamples: Map<number, SkillExample>;
  private skillToExamples: Map<number, SkillToExample>;
  private contentSections: Map<number, ContentSection>;

  private userId: number;
  private chatMessageId: number;
  private contactSubmissionId: number;
  private ragContextId: number;
  private skillCategoryId: number;
  private skillId: number;
  private skillExampleId: number;
  private skillToExampleId: number;
  private contentSectionId: number;

  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.users = new Map();
    this.chatMessages = new Map();
    this.contactSubmissions = new Map();
    this.ragContexts = new Map();
    this.skillCategories = new Map();
    this.skills = new Map();
    this.skillExamples = new Map();
    this.skillToExamples = new Map();
    this.contentSections = new Map();

    this.userId = 1;
    this.chatMessageId = 1;
    this.contactSubmissionId = 1;
    this.ragContextId = 1;
    this.skillCategoryId = 1;
    this.skillId = 1;
    this.skillExampleId = 1;
    this.skillToExampleId = 1;
    this.contentSectionId = 1;

    // Initialize with sample data
    this.initializeRagContexts();
    this.initializeSkillData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Skill Category operations
  async createSkillCategory(
    insertCategory: InsertSkillCategory,
  ): Promise<SkillCategory> {
    const id = this.skillCategoryId++;
    const category: SkillCategory = {
      id,
      name: insertCategory.name,
      description: insertCategory.description,
      parentId: insertCategory.parentId || null,
      level: insertCategory.level || 0,
      icon: insertCategory.icon || null,
      order: insertCategory.order || 0,
    };
    this.skillCategories.set(id, category);
    return category;
  }

  async getSkillCategory(id: number): Promise<SkillCategory | undefined> {
    return this.skillCategories.get(id);
  }

  async getAllSkillCategories(): Promise<SkillCategory[]> {
    return Array.from(this.skillCategories.values()).sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
  }

  async getSkillCategoriesByParentId(
    parentId: number | null,
  ): Promise<SkillCategory[]> {
    return Array.from(this.skillCategories.values())
      .filter((category) =>
        parentId === null
          ? category.parentId === undefined || category.parentId === null
          : category.parentId === parentId,
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // Skill operations
  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.skillId++;
    const skill: Skill = {
      id,
      name: insertSkill.name,
      description: insertSkill.description,
      categoryId: insertSkill.categoryId,
      proficiencyLevel: insertSkill.proficiencyLevel,
      icon: insertSkill.icon || null,
      years: insertSkill.years || null,
      order: insertSkill.order || 0,
    };
    this.skills.set(id, skill);
    return skill;
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async getAllSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getSkillsByCategoryId(categoryId: number): Promise<Skill[]> {
    return Array.from(this.skills.values())
      .filter((skill) => skill.categoryId === categoryId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // Skill Example operations
  async createSkillExample(
    insertExample: InsertSkillExample,
  ): Promise<SkillExample> {
    const id = this.skillExampleId++;
    const now = new Date();
    const example: SkillExample = {
      id,
      title: insertExample.title,
      description: insertExample.description,
      details: insertExample.details,
      image: insertExample.image || null,
      link: insertExample.link || null,
      isSynthetic: insertExample.isSynthetic || false,
      createdAt: now,
    };
    this.skillExamples.set(id, example);
    return example;
  }

  async getSkillExample(id: number): Promise<SkillExample | undefined> {
    return this.skillExamples.get(id);
  }

  async getAllSkillExamples(): Promise<SkillExample[]> {
    return Array.from(this.skillExamples.values());
  }

  // Skill to Example mapping operations
  async createSkillToExample(
    insertMapping: InsertSkillToExample,
  ): Promise<SkillToExample> {
    const id = this.skillToExampleId++;
    const mapping: SkillToExample = { ...insertMapping, id };
    this.skillToExamples.set(id, mapping);
    return mapping;
  }

  async getExamplesBySkillId(skillId: number): Promise<SkillExample[]> {
    const mappings = Array.from(this.skillToExamples.values()).filter(
      (mapping) => mapping.skillId === skillId,
    );

    const exampleIds = mappings.map((mapping) => mapping.exampleId);

    return Array.from(this.skillExamples.values()).filter((example) =>
      exampleIds.includes(example.id),
    );
  }

  async getSkillsByExampleId(exampleId: number): Promise<Skill[]> {
    const mappings = Array.from(this.skillToExamples.values()).filter(
      (mapping) => mapping.exampleId === exampleId,
    );

    const skillIds = mappings.map((mapping) => mapping.skillId);

    return Array.from(this.skills.values()).filter((skill) =>
      skillIds.includes(skill.id),
    );
  }

  async getExamplesBySkillIds(skillIds: number[]): Promise<SkillExample[]> {
    // Get mappings for all provided skill ids
    const mappings = Array.from(this.skillToExamples.values()).filter(
      (mapping) => skillIds.includes(mapping.skillId),
    );

    // Extract unique example ids from the mappings
    const exampleIdsSet = new Set(mappings.map((mapping) => mapping.exampleId));
    const exampleIds = Array.from(exampleIdsSet);

    // Return all examples that match the example ids
    return Array.from(this.skillExamples.values()).filter((example) =>
      exampleIds.includes(example.id),
    );
  }

  // Chat message operations
  async createChatMessage(
    insertMessage: InsertChatMessage,
  ): Promise<ChatMessage> {
    const id = this.chatMessageId++;
    const now = new Date();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: now,
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessages(limit = 10): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    return messages
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Contact form operations
  async createContactSubmission(
    insertSubmission: InsertContactSubmission,
  ): Promise<ContactSubmission> {
    const id = this.contactSubmissionId++;
    const now = new Date();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: now,
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  // RAG context operations
  async createRagContext(insertContext: InsertRagContext): Promise<RagContext> {
    const id = this.ragContextId++;
    const context: RagContext = {
      id,
      title: insertContext.title,
      content: insertContext.content,
      section: insertContext.section,
      embeddings: insertContext.embeddings || null,
    };
    this.ragContexts.set(id, context);
    return context;
  }

  async getAllRagContexts(): Promise<RagContext[]> {
    return Array.from(this.ragContexts.values());
  }

  async getRagContextsBySection(section: string): Promise<RagContext[]> {
    return Array.from(this.ragContexts.values()).filter(
      (context) => context.section === section,
    );
  }

  async searchRagContexts(query: string): Promise<RagContext[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.ragContexts.values()).filter(
      (context) =>
        context.title.toLowerCase().includes(lowerQuery) ||
        context.content.toLowerCase().includes(lowerQuery),
    );
  }

  // Initialize with portfolio data for RAG
  private initializeRagContexts() {
    const contexts: InsertRagContext[] = [
      {
        title: "About",
        section: "about",
        content:
          "I'm a versatile creative technologist with a passion for innovation and learning. My diverse skillset spans across programming, design, project management, and more. I specialize in finding connections between different fields and applying knowledge across domains. I'm constantly seeking to expand my abilities and take on new challenges.",
        embeddings: null,
      },
      {
        title: "Skills Overview",
        section: "skills",
        content:
          "I have a wide range of technical and creative skills that I've developed through formal education, self-directed learning, and practical experience. My skills can be browsed by category and include specific examples of my work.",
        embeddings: null,
      },
    ];

    contexts.forEach((context) => {
      this.createRagContext(context);
    });
  }

  // Content Section operations
  async createContentSection(insertSection: InsertContentSection): Promise<ContentSection> {
    const id = this.contentSectionId++;
    const now = new Date();
    const section: ContentSection = {
      id,
      section: insertSection.section,
      title: insertSection.title,
      content: insertSection.content,
      order: insertSection.order || 0,
      metadata: insertSection.metadata || null,
      updatedAt: now,
    };
    this.contentSections.set(id, section);
    return section;
  }

  async getContentSection(id: number): Promise<ContentSection | undefined> {
    return this.contentSections.get(id);
  }

  async getContentSectionsByType(sectionType: string): Promise<ContentSection[]> {
    return Array.from(this.contentSections.values())
      .filter((section) => section.section === sectionType)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async updateContentSection(section: ContentSection): Promise<ContentSection> {
    if (!this.contentSections.has(section.id)) {
      throw new Error(`Content section with ID ${section.id} not found`);
    }
    
    // Update the updatedAt timestamp
    const updatedSection: ContentSection = {
      ...section,
      updatedAt: new Date(),
    };
    
    this.contentSections.set(section.id, updatedSection);
    return updatedSection;
  }

  async deleteContentSection(id: number): Promise<void> {
    if (!this.contentSections.has(id)) {
      throw new Error(`Content section with ID ${id} not found`);
    }
    this.contentSections.delete(id);
  }

  async getAllContentSections(): Promise<ContentSection[]> {
    return Array.from(this.contentSections.values())
      .sort((a, b) => {
        // First sort by section type
        if (a.section !== b.section) {
          return a.section.localeCompare(b.section);
        }
        // Then sort by order within each section
        return (a.order || 0) - (b.order || 0);
      });
  }

  // Initialize with skill data
  private initializeSkillData() {
    // Create main skill categories
    const techCategory = this.createSkillCategory({
      name: "Technical",
      description:
        "Technical skills related to programming, system administration, and digital tools",
      parentId: null,
      level: 0,
      icon: "Code",
      order: 1,
    });

    const creativeCategory = this.createSkillCategory({
      name: "Creative",
      description:
        "Skills involving design, media production, and artistic expression",
      parentId: null,
      level: 0,
      icon: "Paintbrush",
      order: 2,
    });

    const businessCategory = this.createSkillCategory({
      name: "Business",
      description:
        "Skills related to management, strategy, and business operations",
      parentId: null,
      level: 0,
      icon: "BarChart",
      order: 3,
    });

    // Create Tech subcategories
    Promise.all([
      this.createSkillCategory({
        name: "Programming",
        description:
          "Software development and coding skills across different languages and platforms",
        parentId: 1, // techCategory.id
        level: 1,
        icon: "Code2",
        order: 1,
      }),
      this.createSkillCategory({
        name: "Web Development",
        description:
          "Skills for creating and maintaining websites and web applications",
        parentId: 1,
        level: 1,
        icon: "Globe",
        order: 2,
      }),
      this.createSkillCategory({
        name: "Data Science",
        description: "Skills for analyzing and interpreting complex data",
        parentId: 1,
        level: 1,
        icon: "Database",
        order: 3,
      }),
    ]);

    // Create Creative subcategories
    Promise.all([
      this.createSkillCategory({
        name: "Visual Design",
        description: "Creating visual content for digital and print media",
        parentId: 2, // creativeCategory.id
        level: 1,
        icon: "Image",
        order: 1,
      }),
      this.createSkillCategory({
        name: "Audio Production",
        description: "Creating and editing audio content",
        parentId: 2,
        level: 1,
        icon: "Music",
        order: 2,
      }),
      this.createSkillCategory({
        name: "Video Production",
        description: "Creating and editing video content",
        parentId: 2,
        level: 1,
        icon: "Video",
        order: 3,
      }),
    ]);

    // Create Business subcategories
    Promise.all([
      this.createSkillCategory({
        name: "Project Management",
        description: "Skills for planning, executing, and closing projects",
        parentId: 3, // businessCategory.id
        level: 1,
        icon: "ClipboardList",
        order: 1,
      }),
      this.createSkillCategory({
        name: "Marketing",
        description: "Skills for promoting products, services, or ideas",
        parentId: 3,
        level: 1,
        icon: "TrendingUp",
        order: 2,
      }),
      this.createSkillCategory({
        name: "Strategy",
        description:
          "Skills for developing and implementing business strategies",
        parentId: 3,
        level: 1,
        icon: "Target",
        order: 3,
      }),
    ]);

    // Programming subcategory skills
    Promise.all([
      this.createSkill({
        name: "JavaScript",
        description: "Modern JavaScript programming including ES6+ features",
        categoryId: 4, // Programming
        proficiencyLevel: 5,
        icon: "SiJavascript",
        years: 6,
        order: 1,
      }),
      this.createSkill({
        name: "Python",
        description:
          "Python programming for web development, data analysis, and automation",
        categoryId: 4,
        proficiencyLevel: 4,
        icon: "SiPython",
        years: 5,
        order: 2,
      }),
      this.createSkill({
        name: "TypeScript",
        description: "Type-safe JavaScript programming with TypeScript",
        categoryId: 4,
        proficiencyLevel: 5,
        icon: "SiTypescript",
        years: 4,
        order: 3,
      }),
    ]);

    // Web Development skills
    Promise.all([
      this.createSkill({
        name: "React",
        description: "Building user interfaces with React and ecosystem tools",
        categoryId: 5, // Web Development
        proficiencyLevel: 5,
        icon: "SiReact",
        years: 5,
        order: 1,
      }),
      this.createSkill({
        name: "Node.js",
        description: "Server-side JavaScript with Node.js",
        categoryId: 5,
        proficiencyLevel: 4,
        icon: "SiNodedotjs",
        years: 4,
        order: 2,
      }),
      this.createSkill({
        name: "CSS/SCSS",
        description: "Modern styling with CSS and SCSS preprocessor",
        categoryId: 5,
        proficiencyLevel: 4,
        icon: "SiCss3",
        years: 7,
        order: 3,
      }),
    ]);

    // Create a few example skill examples
    Promise.all([
      this.createSkillExample({
        title: "E-commerce Dashboard",
        description:
          "A React-based dashboard for managing an e-commerce platform",
        details:
          "Developed a comprehensive admin dashboard for an e-commerce platform using React, TypeScript, and Material-UI. The dashboard provides real-time sales analytics, inventory management, order processing, and customer management features. Implemented complex data visualization with Chart.js and optimized performance for handling large datasets. Integrated with a RESTful API backend built with Node.js and Express.",
        image: "https://placehold.co/600x400",
        link: "https://github.com/example/ecommerce-dashboard",
        isSynthetic: false,
      }),
      this.createSkillExample({
        title: "Data Analysis Tool",
        description: "Python application for analyzing large datasets",
        details:
          "Created a data analysis tool using Python, Pandas, and NumPy that processes and visualizes large datasets. The tool imports data from various sources (CSV, Excel, SQL databases), cleans and transforms the data, and generates insightful visualizations. Features include automated report generation, statistical analysis, and predictive modeling using scikit-learn. The tool has a web interface built with Flask and JavaScript.",
        image: "https://placehold.co/600x400",
        link: "https://github.com/example/data-analysis-tool",
        isSynthetic: false,
      }),
      this.createSkillExample({
        title: "Social Media Analytics Dashboard",
        description: "Real-time dashboard for social media metrics",
        details:
          "Designed and built a real-time social media analytics dashboard using TypeScript, React, and Firebase. The dashboard pulls data from multiple social media platforms through their APIs and displays engagement metrics, audience demographics, and content performance. Implemented real-time updates with Firebase Realtime Database and authentication with Firebase Auth. Used CSS Grid and Flexbox for a responsive layout that works across all device sizes.",
        image: "https://placehold.co/600x400",
        link: "https://github.com/example/social-dashboard",
        isSynthetic: false,
      }),
    ]);

    // Link skills to examples
    Promise.all([
      // E-commerce Dashboard example
      this.createSkillToExample({ skillId: 7, exampleId: 1 }), // React
      this.createSkillToExample({ skillId: 9, exampleId: 1 }), // TypeScript

      // Data Analysis Tool example
      this.createSkillToExample({ skillId: 8, exampleId: 2 }), // Python

      // Social Media Analytics Dashboard example
      this.createSkillToExample({ skillId: 7, exampleId: 3 }), // React
      this.createSkillToExample({ skillId: 9, exampleId: 3 }), // TypeScript
    ]);
  }
}

// Create and export the storage instance
// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }
  async updateSkill(skill: Skill): Promise<Skill> {
    const [updatedSkill] = await db
      .update(skills)
      .set({
        name: skill.name,
        description: skill.description,
        categoryId: skill.categoryId,
        proficiencyLevel: skill.proficiencyLevel,
        icon: skill.icon,
        years: skill.years,
        order: skill.order,
      })
      .where(eq(skills.id, skill.id))
      .returning();
    
    if (!updatedSkill) {
      throw new Error(`Skill with ID ${skill.id} not found`);
    }
    
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<void> {
    // First delete any skill-to-example mappings
    await db.delete(skillToExample).where(eq(skillToExample.skillId, id));
    
    // Then delete the skill
    await db.delete(skills).where(eq(skills.id, id));
  }
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Skill Category operations
  async createSkillCategory(
    insertCategory: InsertSkillCategory,
  ): Promise<SkillCategory> {
    const [category] = await db
      .insert(skillCategories)
      .values({
        ...insertCategory,
      })
      .returning();
    return category;
  }

  async getSkillCategory(id: number): Promise<SkillCategory | undefined> {
    const [category] = await db
      .select()
      .from(skillCategories)
      .where(eq(skillCategories.id, id));
    return category || undefined;
  }

  async getAllSkillCategories(): Promise<SkillCategory[]> {
    return await db
      .select()
      .from(skillCategories)
      .orderBy(skillCategories.order);
  }

  async getSkillCategoriesByParentId(
    parentId: number | null,
  ): Promise<SkillCategory[]> {
    return await db
      .select()
      .from(skillCategories)
      .where(
        parentId === null
          ? isNull(skillCategories.parentId)
          : eq(skillCategories.parentId, parentId),
      )
      .orderBy(skillCategories.order);
  }

  // Skill operations
  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db
      .insert(skills)
      .values({
        ...insertSkill,
      })
      .returning();
    return skill;
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill || undefined;
  }

  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order);
  }

  async getSkillsByCategoryId(categoryId: number): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.categoryId, categoryId))
      .orderBy(skills.order);
  }

  // Skill Example operations
  async createSkillExample(
    insertExample: InsertSkillExample,
  ): Promise<SkillExample> {
    const [example] = await db
      .insert(skillExamples)
      .values({
        ...insertExample,
        createdAt: new Date(),
      })
      .returning();
    return example;
  }

  async getSkillExample(id: number): Promise<SkillExample | undefined> {
    const [example] = await db
      .select()
      .from(skillExamples)
      .where(eq(skillExamples.id, id));
    return example || undefined;
  }

  async getAllSkillExamples(): Promise<SkillExample[]> {
    return await db.select().from(skillExamples);
  }

  // Skill to Example mapping operations
  async createSkillToExample(
    insertMapping: InsertSkillToExample,
  ): Promise<SkillToExample> {
    const [mapping] = await db
      .insert(skillToExample)
      .values(insertMapping)
      .returning();
    return mapping;
  }

  async getExamplesBySkillId(skillId: number): Promise<SkillExample[]> {
    const results = await db
      .select({
        example: skillExamples,
      })
      .from(skillToExample)
      .innerJoin(skillExamples, eq(skillToExample.exampleId, skillExamples.id))
      .where(eq(skillToExample.skillId, skillId));

    return results.map((r) => r.example);
  }

  async getSkillsByExampleId(exampleId: number): Promise<Skill[]> {
    const results = await db
      .select({
        skill: skills,
      })
      .from(skillToExample)
      .innerJoin(skills, eq(skillToExample.skillId, skills.id))
      .where(eq(skillToExample.exampleId, exampleId));

    return results.map((r) => r.skill);
  }

  async getExamplesBySkillIds(skillIds: number[]): Promise<SkillExample[]> {
    // Get unique example IDs that match any of the provided skill IDs
    const mappings = await db
      .select({
        exampleId: skillToExample.exampleId,
      })
      .from(skillToExample)
      .where(inArray(skillToExample.skillId, skillIds))
      .groupBy(skillToExample.exampleId);

    const exampleIds = mappings.map((m) => m.exampleId);

    if (exampleIds.length === 0) {
      return [];
    }

    // Get the actual examples
    return await db
      .select()
      .from(skillExamples)
      .where(inArray(skillExamples.id, exampleIds));
  }

  // Chat message operations
  async createChatMessage(
    insertMessage: InsertChatMessage,
  ): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values({
        ...insertMessage,
        createdAt: new Date(),
      })
      .returning();
    return message;
  }

  async getChatMessages(limit = 10): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  // Contact form operations
  async createContactSubmission(
    insertSubmission: InsertContactSubmission,
  ): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        ...insertSubmission,
        createdAt: new Date(),
      })
      .returning();
    return submission;
  }

  // RAG context operations
  async createRagContext(insertContext: InsertRagContext): Promise<RagContext> {
    const [context] = await db
      .insert(ragContexts)
      .values({
        ...insertContext,
      })
      .returning();
    return context;
  }

  async getAllRagContexts(): Promise<RagContext[]> {
    return await db.select().from(ragContexts);
  }

  async getRagContextsBySection(section: string): Promise<RagContext[]> {
    return await db
      .select()
      .from(ragContexts)
      .where(eq(ragContexts.section, section));
  }

  async searchRagContexts(query: string): Promise<RagContext[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;

    return await db
      .select()
      .from(ragContexts)
      .where(
        or(
          ilike(ragContexts.content, lowerQuery),
          ilike(ragContexts.title, lowerQuery),
        ),
      );
  }

  // Content Section operations for database storage
  async createContentSection(insertSection: InsertContentSection): Promise<ContentSection> {
    const [section] = await db
      .insert(contentSections)
      .values({
        section: insertSection.section,
        title: insertSection.title,
        content: insertSection.content,
        order: insertSection.order || 0,
        metadata: insertSection.metadata || null,
      })
      .returning();
    
    return section;
  }

  async getContentSection(id: number): Promise<ContentSection | undefined> {
    const [section] = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.id, id));
    
    return section || undefined;
  }

  async getContentSectionsByType(sectionType: string): Promise<ContentSection[]> {
    return db
      .select()
      .from(contentSections)
      .where(eq(contentSections.section, sectionType))
      .orderBy(contentSections.order);
  }

  async updateContentSection(section: ContentSection): Promise<ContentSection> {
    const [updatedSection] = await db
      .update(contentSections)
      .set({
        section: section.section,
        title: section.title,
        content: section.content,
        order: section.order || 0,
        metadata: section.metadata,
        updatedAt: new Date(),
      })
      .where(eq(contentSections.id, section.id))
      .returning();
    
    if (!updatedSection) {
      throw new Error(`Content section with ID ${section.id} not found`);
    }
    
    return updatedSection;
  }

  async deleteContentSection(id: number): Promise<void> {
    await db
      .delete(contentSections)
      .where(eq(contentSections.id, id));
  }

  async getAllContentSections(): Promise<ContentSection[]> {
    return db
      .select()
      .from(contentSections)
      .orderBy(contentSections.section, contentSections.order);
  }
}

export const storage = new DatabaseStorage();
