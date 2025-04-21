import { EDUCATIONS, CERTIFICATIONS } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

const Education = () => {
  return (
    <section id="education" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Education
        </h2>

        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-8">
          {EDUCATIONS.map((education) => (
            <div
              key={education.id}
              className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {education.degree}
                  </h3>
                  <div className="text-primary font-medium mt-1">
                    {education.institution}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500 mt-1 md:mt-0">
                  {education.period}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{education.description}</p>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Key Courses:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {education.courses.map((course, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Certifications */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-6">Certifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((certification) => (
                <div
                  key={certification.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-3 flex-shrink-0">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {certification.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {certification.issuer} ({certification.year})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
