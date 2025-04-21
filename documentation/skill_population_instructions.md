# Instructions for Populating Skill Database

This document provides guidance on how to use your personal details with an AI tool to generate structured data for the skill profile database.

## Overview of Process

1. **Gather your information**: Resume, project details, work experience
2. **Review the skill structure**: Understand how skills are categorized and linked
3. **Use AI assistance**: Provide your materials to an AI tool to generate structured data
4. **Review and refine**: Edit the AI-generated content for accuracy
5. **Import the data**: Use the structured data to populate the database

## What to Provide to the AI

To generate the most accurate and comprehensive skill database content, provide the AI with:

1. **Your resume**: Complete professional history
2. **Project portfolio**: Detailed descriptions of significant projects
3. **Skills assessment**: Your self-evaluation of technical strengths
4. **The structure guide**: Share the `skill_structure_guide.md` document
5. **Example data**: Share the `mock_data_examples.json` for format reference

## Instructions for the AI

When working with the AI, provide these specific instructions:

```
Using my resume and the provided skill structure guide, please generate a comprehensive JSON file containing:

1. Skill categories organized hierarchically (with appropriate parent-child relationships)
2. Individual skills within each category (with proficiency levels and years of experience)
3. Detailed examples that demonstrate these skills in action
4. The connections between skills and examples

Please follow these guidelines:
- Match the structure in the example JSON file
- Organize skills based on my background in nuclear engineering and IT systems
- Highlight my infrastructure, automation, command line, and data engineering abilities
- Include only real examples from my experience, not synthetic ones
- Provide detailed explanations in the "details" field for each example
- Ensure examples demonstrate problem-solving and technical versatility

The final output should be valid JSON that can be directly imported into the database.
```

## Adapting the Generated Content

After receiving the AI-generated content:

1. **Review for accuracy**: Verify all details are correct
2. **Adjust proficiency levels**: Ensure ratings (1-5) reflect your actual expertise
3. **Enhance examples**: Add more specific details to examples if needed
4. **Add missing skills**: Insert any skills the AI may have overlooked
5. **Check relationships**: Verify the skill-to-example connections are appropriate

## Importing to the Database

The generated JSON file should follow the exact structure as shown in the example data, with these sections:

- `categories`: The skill categories hierarchy
- `skills`: Individual skills with their attributes
- `examples`: Detailed examples of skill application
- `skillToExample`: The connections between skills and examples

This structured data can then be imported into the database to populate your skill profile.
