"use client";

import { useState } from "react";
import { User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { posts: number; comments: number };
}

export function UsersClient({ users: initialUsers, currentUserId }: { users: UserItem[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);

  async function changeRole(id: string, role: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setUsers(users.filter((u) => u.id !== id));
  }

  return (
    <div className="mt-8 space-y-2">
      {users.length === 0 ? (
        <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun utilisateur.
          </CardContent>
        </Card>
      ) : (
        users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name ?? "Sans nom"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {user._count.posts} articles · {user._count.comments} commentaires
              </span>
              <select
                value={user.role}
                onChange={(e) => changeRole(user.id, e.target.value)}
                disabled={user.id === currentUserId}
                className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-900 disabled:opacity-50 dark:border-white/10 dark:bg-[#131313] dark:text-white"
              >
                <option value="USER">USER</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {user.id !== currentUserId && (
                <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <span className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
