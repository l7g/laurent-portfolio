"use client";

interface LoadingSkeletonProps {
  type?: "about" | "projects" | "education";
  className?: string;
}

// Super simple, clean loading state - no complex layouts or animations
const LoadingSkeleton = ({
  type = "about",
  className = "",
}: LoadingSkeletonProps) => {
  const getSectionId = () => {
    switch (type) {
      case "about":
        return "about";
      case "projects":
        return "projects";
      case "education":
        return "education-skills";
      default:
        return "section";
    }
  };

  const getSectionTitle = () => {
    switch (type) {
      case "about":
        return "About";
      case "projects":
        return "Projects";
      case "education":
        return "Education & Skills";
      default:
        return "Content";
    }
  };

  return (
    <section
      className={`py-12 sm:py-16 lg:py-20 ${className}`}
      id={getSectionId()}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-default-50 rounded-lg border border-default-200">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-default-600">
                Loading {getSectionTitle()}...
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingSkeleton;
