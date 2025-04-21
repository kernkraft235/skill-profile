# Skill Structure Guide for Graham Colehour's Technical Profile

This document outlines the structure of skills, categories, and examples in the technical profile application. Use this as a reference for populating the database with your personal skills and experience.

## Database Schema Overview

The application uses a hierarchical structure for skills:

1. **Skill Categories**: Top-level groupings that organize skills (e.g., Infrastructure, Automation, Data Engineering)
2. **Skills**: Individual technical competencies within each category
3. **Skill Examples**: Real-world applications or demonstrations of skills in action

## Skill Categories Structure

Skill categories are organized hierarchically:

```
- Level 0: Root categories (Technical Skills, Soft Skills)
  - Level 1: Main categories (Infrastructure, Automation, Command Line, Data Engineering, etc.)
    - Level 2: Subcategories (optional)
```

Each category has:

- **Name**: Short, descriptive title
- **Description**: Brief explanation of the category
- **Parent ID**: Reference to parent category (null for root categories)
- **Level**: Hierarchy level (0=root, 1=main, 2=sub)
- **Icon**: Associated icon name
- **Order**: Display order within its level

## Skills Structure

Individual skills belong to specific categories and include:

- **Name**: The skill name (e.g., "Bash Scripting", "Server Management")
- **Description**: Brief explanation of the skill
- **Category ID**: The category this skill belongs to
- **Proficiency Level**: Rating from 1-5 indicating expertise level
- **Icon**: Associated icon name
- **Years**: Years of experience with this skill
- **Order**: Display order within the category

## Skill Examples Structure

Examples demonstrate how skills are applied in real-world scenarios:

- **Title**: Brief title for the example
- **Description**: Short summary of the example
- **Details**: Comprehensive explanation of how skills were applied
- **Image**: Optional screenshot or diagram
- **Link**: Optional URL to related resource
- **Is Synthetic**: Boolean flag indicating if created by AI (true) or real experience (false)

Examples can be linked to multiple skills through the `skill_to_example` junction table, creating a many-to-many relationship.

## The Skill Translator Feature

The Skill Translator matches user-submitted technical problems with relevant skills:

1. User describes a technical challenge
2. System analyzes the description using OpenAI
3. System identifies relevant skills from the database
4. System explains how each skill applies to the specific challenge

## Recommendation for Population

When populating your skill database:

1. **Start with categories**: Define your main skill categories first
2. **Add skills**: Populate skills within each category, with ratings and years of experience
3. **Create examples**: Add detailed examples demonstrating how you've applied these skills
4. **Link examples to skills**: Connect examples to all relevant skills

## Example Data Structure for Technical Profile

### Sample Category

```json
{
  "name": "Infrastructure & Automation",
  "description": "Systems infrastructure design and automated management",
  "parentId": 1, // References "Technical Skills" as parent
  "level": 1,
  "icon": "server",
  "order": 1
}
```

### Sample Skill

```json
{
  "name": "Shell Scripting",
  "description": "Creating advanced bash scripts for process automation and system management",
  "categoryId": 3, // References "Command Line" category
  "proficiencyLevel": 5,
  "icon": "terminal",
  "years": 7,
  "order": 1
}
```

### Sample Example

```json
{
  "title": "Automated Log Analysis System",
  "description": "Created a scriptable system to analyze and extract insights from system logs",
  "details": "Developed a comprehensive bash script system that processes server logs, identifies patterns, extracts meaningful metrics, and generates reports. This reduced manual analysis time by 85% and improved early error detection rates.",
  "image": "log_analysis.png",
  "link": "",
  "isSynthetic": false
}
```

### Linking Example to Skills

```json
{
  "skillId": 5, // References "Shell Scripting" skill
  "exampleId": 2 // References "Automated Log Analysis System" example
}
```

## Unique Skill Positioning for Graham

The system highlights Graham's unique blend of:

1. **Nuclear and process engineering background**: Foundation in systems thinking and analytical approach
2. **Infrastructure & automation focus**: Comprehensive understanding of IT ecosystems
3. **Command line & scripting expertise**: Advanced terminal environment proficiency
4. **Data engineering abilities**: Skills in transformation, ETL processes and data workflows

This combination positions Graham for roles in IT infrastructure, automation, DevOps, or systems analysis rather than pure development or help desk positions.

## How to Use This Document

1. Use this structure to organize your own skills and experiences
2. Match your expertise to the hierarchical categories
3. Rate your proficiency objectively
4. Provide detailed, concrete examples of how you've applied each skill
5. Ensure examples demonstrate problem-solving ability and technical versatility

This document can be provided to another AI system along with your full resume to help generate structured content for the skills database.
