# Graham Colehour's Technical Profile

A dynamic, interactive technical profile platform showcasing professional skills and expertise through AI-powered insights and career development tools.


## Overview

This application serves as an extended digital resume, providing an interactive way to explore my skills, work experience, and personal interests. Unlike traditional resumes, this platform offers tools for visitors to understand how my expertise can apply to specific workplace challenges.

## Features

### Interactive Dashboard
The central landing page provides an overview of my skills and background, with visual navigation to different sections of the profile.

### Skill Explorer
Browse through a hierarchical organization of technical skills, with detailed examples that demonstrate real-world application.

### Skill Translator
This AI-powered tool allows visitors to describe a technical challenge they're facing, and receive insights on which of my skills are relevant to their specific needs.

### Work Experience Explorer
Detailed information about my professional journey, showcasing my progression and accomplishments.

### About Me
Background information and personal approach to work, highlighting my transition from nuclear engineering to IT systems.

### Personal Interests
Insights into activities and interests outside of professional work.

## Technical Implementation

This platform is built with a modern technology stack:

- **Frontend**: React with TypeScript, using a component-based architecture
- **State Management**: React Query for server-state management
- **Styling**: Tailwind CSS with shadcn/ui components for a clean, responsive design
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Secure admin access for content management
- **AI Integration**: OpenRouter.ai API with Claude 3 Opus for advanced AI functionalities
- **Sharing Capabilities**: Dynamic OpenGraph meta tags for rich previews when shared on social platforms

## Project Structure

### Data Organization

- **/data/skills/** - Contains JSON files with skill categories and individual skills data
- **/data/import_data.js** - Script for importing skill data into the database
- **/documentation/** - Project documentation and design files

## Installation

```bash
# Clone the repository
git clone https://github.com/kernkraft235/technical-profile.git

# Navigate to the project directory
cd technical-profile

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with the following variables:
# DATABASE_URL=postgresql://...
# OPENROUTER_API_KEY=...

# Start the development server
npm run dev
```

## Usage

### Visitor Experience
- **Explore Skills**: Navigate through categories and skills to see examples and details
- **Use Skill Translator**: Enter workplace challenges to see which skills apply
- **View Work History**: Explore professional experience and accomplishments
- **Learn About Me**: Understand my background and approach to work

### Administration
- **Content Management**: Secure admin interface for updating skills, examples, and content sections
- **Social Sharing**: Generate and customize preview cards for social media sharing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- AI functionality powered by [OpenRouter.ai](https://openrouter.ai/)
- Deployed and hosted on [Replit](https://replit.com)