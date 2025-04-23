/**
 * This script demonstrates how to import the skill data from JSON files.
 * It can be used as a reference for importing the data into the database.
 * 
 * Usage:
 * - Ensure you're logged in as admin
 * - Run this script with Node.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';
const SKILLS_DIR = path.join(__dirname, 'skills');

// Read cookies from file for authentication
const COOKIES_FILE = path.join(__dirname, '..', 'cookies.txt');

async function importSkillCategories() {
  const categoriesFile = path.join(SKILLS_DIR, 'categories.json');
  const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
  
  console.log(`Importing ${categories.length} main categories...`);
  
  for (const category of categories) {
    try {
      const response = await fetch(`${API_BASE_URL}/skill-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': fs.readFileSync(COOKIES_FILE, 'utf8')
        },
        body: JSON.stringify(category)
      });
      
      if (response.ok) {
        console.log(`Created category: ${category.name}`);
      } else {
        console.error(`Failed to create category: ${category.name}`, await response.text());
      }
    } catch (error) {
      console.error(`Error creating category: ${category.name}`, error);
    }
  }
}

async function importSkills() {
  // Get all skill JSON files
  const skillFiles = fs.readdirSync(SKILLS_DIR)
    .filter(file => file.endsWith('_skills.json'));
  
  console.log(`Found ${skillFiles.length} skill files to import`);
  
  for (const file of skillFiles) {
    const skills = JSON.parse(fs.readFileSync(path.join(SKILLS_DIR, file), 'utf8'));
    console.log(`Importing ${skills.length} skills from ${file}...`);
    
    for (const skill of skills) {
      try {
        const response = await fetch(`${API_BASE_URL}/skills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': fs.readFileSync(COOKIES_FILE, 'utf8')
          },
          body: JSON.stringify(skill)
        });
        
        if (response.ok) {
          console.log(`Created skill: ${skill.name}`);
        } else {
          console.error(`Failed to create skill: ${skill.name}`, await response.text());
        }
      } catch (error) {
        console.error(`Error creating skill: ${skill.name}`, error);
      }
    }
  }
}

/**
 * To run the import process:
 * 1. Make sure you have node-fetch installed: npm install node-fetch
 * 2. Login as admin first to generate the cookies.txt file
 * 3. Run the functions in sequence:
 *    - importSkillCategories()
 *    - importSkills()
 */

// Uncomment to execute:
// importSkillCategories();
// importSkills();

console.log('Import script ready. Uncomment the function calls to execute the import.');