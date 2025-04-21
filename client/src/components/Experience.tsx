import { EXPERIENCES } from "@/lib/constants";
import { getYearFromNow } from "@/lib/utils";

const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Work Experience
        </h2>

        <div className="max-w-3xl mx-auto">
          {EXPERIENCES.map((experience, index) => (
            <div
              key={experience.id}
              className="timeline-item relative pl-10 pb-12 last:pb-0"
            >
              <div className="absolute left-0 top-0 bg-primary w-5 h-5 rounded-full border-4 border-white"></div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {experience.role}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 mt-1 md:mt-0">
                    {experience.period}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-primary font-medium">
                    {experience.company}
                  </span>
                  {experience.period.includes("Present") && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {getYearFromNow(experience.period.split(" - ")[0])}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{experience.description}</p>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Key Achievements:
                  </h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm">
                    {experience.achievements.map(
                      (achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .timeline-item:not(:last-child)::before {
          content: "";
          position: absolute;
          left: 0;
          top: 24px;
          bottom: 0;
          width: 1px;
          background-color: #e5e7eb;
        }
      `}</style>
    </section>
  );
};

export default Experience;
