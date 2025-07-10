import { title } from "@/components/primitives";

export default function AdminCommentsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className={title({ size: "lg" })}>Comment Management</h1>
      <p className="text-default-500 mb-8">Manage and moderate blog comments</p>

      {/* Comments management component will go here */}
    </div>
  );
}
