import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { FolderGit2, Briefcase, Code2, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [projectCount, expCount, skillCount, messages] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const unread = await prisma.contactMessage.count({ where: { read: false } });

  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Projects", value: projectCount, icon: FolderGit2 },
    { label: "Experience", value: expCount, icon: Briefcase },
    { label: "Skills", value: skillCount, icon: Code2 },
    { label: "Unread Messages", value: unread, icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">{value}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((msg: { id: string; name: string; message: string; read: boolean; createdAt: Date }) => (
                  <li key={msg.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {msg.name}
                        {!msg.read && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(msg.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
