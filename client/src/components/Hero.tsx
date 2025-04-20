import { PORTFOLIO_OWNER } from '@/lib/constants';
import { scrollToSection } from '@/lib/utils';

const Hero = () => {
  return (
    <section id="hero" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="block">Hi, I'm</span>
              <span className="text-primary">{PORTFOLIO_OWNER.name}</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 mb-6">{PORTFOLIO_OWNER.title}</h2>
            <p className="text-gray-700 mb-8 text-lg">
              {PORTFOLIO_OWNER.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
                onClick={() => scrollToSection('projects')}
              >
                View Projects
              </button>
              <button 
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium py-2 px-6 rounded-md transition-colors"
                onClick={() => scrollToSection('chat')}
              >
                Ask Me Anything
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={PORTFOLIO_OWNER.photo}
                  alt={PORTFOLIO_OWNER.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-3 shadow-lg">
                <div className="bg-green-500 w-4 h-4 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-16">
          <div className="text-primary animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
