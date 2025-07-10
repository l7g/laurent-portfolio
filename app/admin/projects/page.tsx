import { title } from "@/components/primitives";

export default function AdminProjectsPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className={title()}>Projects Management</h1>
          <p className="mt-4 text-lg text-default-600">
            Manage your portfolio projects
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-default-600">
            Project editing functionality coming soon...
          </p>
          <p className="text-sm text-default-500 mt-2">
            For now, you can manage projects through the database or contact the
            developer.
          </p>
        </div>
      </div>
    </div>
  );
}
