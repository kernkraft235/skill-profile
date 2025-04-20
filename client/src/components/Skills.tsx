import { useEffect } from 'react';
import { 
  TECHNICAL_SKILLS, 
  SOFT_SKILLS, 
  TECHNOLOGIES 
} from '@/lib/constants';
import { getSkillColor } from '@/lib/utils';
import * as SiIcons from 'react-icons/si';

const Skills = () => {
  useEffect(() => {
    const animateSkillBars = () => {
      const skillBars = document.querySelectorAll('.skill-bar');
      
      skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0';
        (bar as HTMLElement).style.width = '0';
        
        setTimeout(() => {
          (bar as HTMLElement).style.width = `${width}%`;
        }, 300);
      });
    };
    
    // Use Intersection Observer to trigger animation when section is in view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }
    
    return () => {
      if (skillsSection) {
        observer.unobserve(skillsSection);
      }
    };
  }, []);
  
  const renderSkillCategory = (category: typeof TECHNICAL_SKILLS, type: 'technical' | 'soft') => {
    const colorClass = getSkillColor(type);
    
    return (
      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-800">{category.title}</h3>
        {category.skills.map((skill, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">{skill.name}</span>
              <span className="text-sm font-medium text-gray-500">{skill.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`skill-bar h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${skill.percentage}%` }}
                data-width={skill.percentage}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getTechIcon = (iconName: string) => {
    // @ts-ignore - dynamic icon import
    const IconComponent = SiIcons[iconName];
    return IconComponent ? (
      <IconComponent className="h-10 w-10 text-primary" />
    ) : (
      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-primary font-bold">{iconName.substring(0, 2)}</span>
      </div>
    );
  };

  return (
    <section id="skills" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">My Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {renderSkillCategory(TECHNICAL_SKILLS, 'technical')}
          {renderSkillCategory(SOFT_SKILLS, 'soft')}
        </div>
        
        {/* Technologies grid */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Technologies I Work With</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {TECHNOLOGIES.map((tech, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">
                  {getTechIcon(tech.icon)}
                </div>
                <span className="text-sm font-medium text-gray-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
