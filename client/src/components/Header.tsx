import { useState, useEffect } from "react";
import { scrollToSection } from "@/lib/utils";
import { PORTFOLIO_OWNER } from "@/lib/constants";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90"
      }`}
    >
      <div className="container mx-auto px-4 py-2">
        <nav className="flex justify-between items-center">
          <div>
            <a
              href="#hero"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("hero");
              }}
            >
              <span className="text-primary">
                {PORTFOLIO_OWNER.name.split(" ")[0]}
              </span>
              <span>{PORTFOLIO_OWNER.name.split(" ")[1]}</span>
            </a>
          </div>

          <div className="hidden md:flex space-x-8">
            {[
              "about",
              "skills",
              "projects",
              "experience",
              "education",
              "chat",
            ].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="nav-link capitalize hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <button
            className="md:hidden flex items-center"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col space-y-3 py-3">
            {[
              "about",
              "skills",
              "projects",
              "experience",
              "education",
              "chat",
            ].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="nav-link capitalize hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
