import { useState, FormEvent } from "react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { PORTFOLIO_OWNER } from "@/lib/constants";
import { Mail, Users, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      contactFormSchema.parse(formData);

      setIsSubmitting(true);

      // Submit to API
      const res = await apiRequest("POST", "/api/contact", formData);
      const data = await res.json();

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
        variant: "default",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        toast({
          title: "Error",
          description:
            "There was a problem sending your message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Get In Touch
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="text-primary mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-700">{PORTFOLIO_OWNER.email}</p>
              <a
                href={`mailto:${PORTFOLIO_OWNER.email}`}
                className="text-primary hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                Send an email
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">LinkedIn</h3>
              <p className="text-gray-700">linkedin.com/in/johndoe</p>
              <a
                href={PORTFOLIO_OWNER.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                Connect with me
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="text-primary mb-4">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GitHub</h3>
              <p className="text-gray-700">github.com/johndoe</p>
              <a
                href={PORTFOLIO_OWNER.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                View my projects
              </a>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-semibold mb-6">Send Me a Message</h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.name ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.subject ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Subject of your message"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-2 border ${errors.message ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Your message"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className={`
                    ${isSubmitting ? "bg-gray-400" : "bg-primary hover:bg-blue-600"} 
                    text-white font-medium py-2 px-6 rounded-md transition-colors
                  `}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
