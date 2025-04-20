import { useState } from 'react';
import { PROJECTS } from '@/lib/constants';
import ProjectModal from './ProjectModal';
import { ExternalLink, Code } from 'lucide-react';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  
  const openProjectModal = (projectId: number) => {
    const project = PROJECTS.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };
  
  return (
    <section id="projects" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                />
                {project.featured && (
                  <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-primary bg-opacity-90 text-white text-xs rounded">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {project.shortDescription}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.slice(0, 4).map((tech, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      +{project.tech.length - 4} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    className="text-primary hover:text-blue-700 text-sm font-medium flex items-center"
                    onClick={() => openProjectModal(project.id)}
                  >
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <a 
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700" 
                    aria-label="View source code"
                  >
                    <Code className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="bg-white hover:bg-gray-50 text-primary border border-primary font-medium py-2 px-6 rounded-md transition-colors">
            View All Projects
          </button>
        </div>
      </div>
      
      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

export default Projects;
