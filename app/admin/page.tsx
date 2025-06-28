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
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.demoRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.project.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.skill.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.portfolioSection.findMany({
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
