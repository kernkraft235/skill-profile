import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Skill Categories schema
export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  parentId: integer("parent_id"),
  level: integer("level").notNull().default(0), // 0 = root, 1 = main category, 2 = subcategory, etc.
  icon: text("icon"),
  order: integer("order").notNull().default(0),
});

export const insertSkillCategorySchema = createInsertSchema(
  skillCategories,
).pick({
  name: true,
  description: true,
  parentId: true,
  level: true,
  icon: true,
  order: true,
});

export type InsertSkillCategory = z.infer<typeof insertSkillCategorySchema>;
export type SkillCategory = typeof skillCategories.$inferSelect;

// Skills schema
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  proficiencyLevel: integer("proficiency_level").notNull(), // 1-5 scale
  icon: text("icon"),
  years: integer("years"), // Years of experience
  order: integer("order").notNull().default(0),
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  description: true,
  categoryId: true,
  proficiencyLevel: true,
  icon: true,
  years: true,
  order: true,
});

// Also export the skill schema for update operations
export const skillSchema = createSelectSchema(skills);

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

// Skill Examples schema
export const skillExamples = pgTable("skill_examples", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  details: text("details").notNull(),
  image: text("image"),
  link: text("link"),
  isSynthetic: boolean("is_synthetic").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSkillExampleSchema = createInsertSchema(skillExamples).pick({
  title: true,
  description: true,
  details: true,
  image: true,
  link: true,
  isSynthetic: true,
});

export type InsertSkillExample = z.infer<typeof insertSkillExampleSchema>;
export type SkillExample = typeof skillExamples.$inferSelect;

// Junction table for skills to examples (many-to-many)
export const skillToExample = pgTable("skill_to_example", {
  id: serial("id").primaryKey(),
  skillId: integer("skill_id").notNull(),
  exampleId: integer("example_id").notNull(),
});

export const insertSkillToExampleSchema = createInsertSchema(
  skillToExample,
).pick({
  skillId: true,
  exampleId: true,
});

export type InsertSkillToExample = z.infer<typeof insertSkillToExampleSchema>;
export type SkillToExample = typeof skillToExample.$inferSelect;

// Chat messages schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  question: true,
  answer: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Contact form schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(
  contactSubmissions,
).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type InsertContactSubmission = z.infer<
  typeof insertContactSubmissionSchema
>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// RAG context schema (for storing embeddings or retrieved context)
export const ragContexts = pgTable("rag_contexts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  section: text("section").notNull(),
  embeddings: jsonb("embeddings"),
});

export const insertRagContextSchema = createInsertSchema(ragContexts).pick({
  title: true,
  content: true,
  section: true,
  embeddings: true,
});

export type InsertRagContext = z.infer<typeof insertRagContextSchema>;
export type RagContext = typeof ragContexts.$inferSelect;
