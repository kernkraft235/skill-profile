import { scrollToSection } from "@/lib/utils";
import { PORTFOLIO_OWNER } from "@/lib/constants";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const handleNavClick = (id: string) => {
    scrollToSection(id);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <a
              href="#hero"
              className="flex items-center text-xl font-bold"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("hero");
              }}
            >
              <span className="text-primary">
                {PORTFOLIO_OWNER.name.split(" ")[0]}
              </span>
              <span className="ml-1">{PORTFOLIO_OWNER.name.split(" ")[1]}</span>
            </a>
            <p className="text-gray-400 mt-2">{PORTFOLIO_OWNER.title}</p>
          </div>

          <div className="flex space-x-4">
            <a
              href={PORTFOLIO_OWNER.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>

            <a
              href={PORTFOLIO_OWNER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>

            <a
              href={`mailto:${PORTFOLIO_OWNER.email}`}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <nav className="flex flex-wrap justify-center md:justify-start gap-6">
                {[
                  "about",
                  "skills",
                  "projects",
                  "experience",
                  "education",
                  "contact",
                ].map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="text-gray-400 hover:text-white transition-colors capitalize"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item);
                    }}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            <p className="text-gray-500 text-sm">
              &copy; {currentYear} {PORTFOLIO_OWNER.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
