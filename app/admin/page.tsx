import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Fetch all necessary data
  const [contacts, demoRequests, projects, skills, sections] =
    await Promise.all([
      prisma.contacts.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.demo_requests.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.projects.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.skills.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.portfolio_sections.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    ]);

  return (
    <AdminDashboard
      contacts={contacts}
      demoRequests={demoRequests}
      projects={projects}
      sections={sections}
      skills={skills}
    />
  );
}
