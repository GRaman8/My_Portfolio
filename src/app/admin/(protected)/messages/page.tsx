"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/messages");
    const { data } = await res.json();
    setMessages(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read } : m));
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/messages/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) { toast.success("Deleted"); load(); }
    else toast.error("Delete failed");
  }

  async function openMessage(msg: Message) {
    setSelected(msg);
    if (!msg.read) await markRead(msg.id, true);
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Messages" />
      <main className="flex-1 p-6 space-y-4">
        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No messages yet.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => openMessage(msg)}
              >
                <div className="shrink-0">
                  {msg.read
                    ? <MailOpen className="w-4 h-4 text-muted-foreground" />
                    : <Mail className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${!msg.read ? "font-semibold" : ""}`}>
                      {msg.name}
                    </p>
                    {!msg.read && <Badge variant="default" className="text-xs">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{formatDate(new Date(msg.createdAt))}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{selected?.email} · {selected && formatDate(new Date(selected.createdAt))}</p>
            <p className="text-sm whitespace-pre-wrap">{selected?.message}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => { if(selected) markRead(selected.id, !selected.read); setSelected(prev => prev ? {...prev, read: !prev.read} : null); }}>
              Mark as {selected?.read ? "unread" : "read"}
            </Button>
            <a
              href={`mailto:${selected?.email}`}
              className="inline-flex items-center h-7 gap-1 rounded-md border border-border bg-background px-2.5 text-[0.8rem] text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Reply via email
            </a>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="Delete message?" description="This will permanently delete this message." onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
