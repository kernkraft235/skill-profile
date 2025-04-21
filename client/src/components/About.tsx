import { HIGHLIGHTS } from "@/lib/constants";
import { ShieldCheck, Users, Beaker } from "lucide-react";

const About = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="h-8 w-8" />;
      case "Users":
        return <Users className="h-8 w-8" />;
      case "Beaker":
        return <Beaker className="h-8 w-8" />;
      default:
        return <ShieldCheck className="h-8 w-8" />;
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            About Me
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
            <p className="text-lg text-gray-700 mb-4">
              I'm a passionate Full Stack Developer with 5+ years of experience
              building modern web applications. I specialize in React, Node.js,
              and cloud technologies, with a growing interest in AI and machine
              learning integration.
            </p>
            <p className="text-lg text-gray-700 mb-0">
              My approach combines technical expertise with a strong focus on
              user experience. I believe in writing clean, maintainable code and
              continuously learning new technologies to stay at the forefront of
              web development.
            </p>
          </div>

          {/* Key highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((highlight, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-primary mb-3">
                  {getIcon(highlight.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
