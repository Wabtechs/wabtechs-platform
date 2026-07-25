"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trash2 } from "lucide-react";
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

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  ADMIN: { bg: "bg-[#842ae3]/10", text: "text-[#842ae3]", label: "Admin" },
  MODERATOR: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Modérateur" },
  USER: { bg: "bg-gray-100 dark:bg-white/5", text: "text-gray-500 dark:text-gray-400", label: "Utilisateur" },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function UsersClient({
  users: initialUsers,
  currentUserId,
}: {
  users: UserItem[];
  currentUserId: string;
}) {
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
    if (!confirm("Supprimer cet utilisateur ? Cette action est irréversible."))
      return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setUsers(users.filter((u) => u.id !== id));
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <User className="h-5 w-5 text-violet-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Utilisateurs
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            {users.length} utilisateurs au total
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-[13px] text-gray-500">Aucun utilisateur</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          <AnimatePresence>
            {users.map((user) => {
              const roleStyle = ROLE_STYLES[user.role] ?? { bg: "bg-gray-100 dark:bg-white/5", text: "text-gray-500 dark:text-gray-400", label: "Utilisateur" };
              return (
                <motion.div
                  key={user.id}
                  variants={item}
                  layout
                  className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#111] dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                      <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                        {(user.name ?? user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-white">
                          {user.name ?? "Sans nom"}
                        </p>
                        {user.id === currentUserId && (
                          <span className="text-[10px] font-medium text-gray-400">(vous)</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">
                      {user._count.posts} articles · {user._count.comments} commentaires
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${roleStyle.bg} ${roleStyle.text}`}
                    >
                      {roleStyle.label}
                    </span>
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      disabled={user.id === currentUserId}
                      className="rounded-lg border border-gray-200/80 bg-gray-50 px-2 py-1.5 text-[11px] text-gray-900 transition-colors focus:border-[#842ae3] focus:outline-none disabled:opacity-50 dark:border-white/[0.06] dark:bg-[#0a0a0a] dark:text-white"
                    >
                      <option value="USER">USER</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <span className="text-[11px] text-gray-400">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
