import { Project } from '@/types';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-64 object-cover rounded"
            />
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Description</h4>
            <p className="text-gray-700">
              {project.description}
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Key Features</h4>
            <ul className="list-disc pl-5 text-gray-700">
              {project.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Live Demo
            </a>
            <a 
              href={project.code} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              View Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
