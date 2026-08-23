"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  type ColumnDef,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Users,
  Trash2,
  Eye,
  ShieldCheck,
  CheckCircle2,
  MoreHorizontal,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  UserCog,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { roles, statuses, getRoleConfig, getUserStatus } from "./data/users";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  avatar: string | null;
  _count: { posts: number; comments: number };
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function UserAvatar({ user }: { user: UserItem }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? user.email} />
      <AvatarFallback className="bg-gray-100 text-[11px] font-semibold text-gray-500 dark:bg-white/5 dark:text-gray-400">
        {(user.name ?? user.email).charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config = getRoleConfig(role);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
      <config.icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function UsersClient({
  users: initialUsers,
  currentUserId,
}: {
  users: UserItem[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [viewUser, setViewUser] = useState<UserItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [roleDialogUser, setRoleDialogUser] = useState<UserItem | null>(null);
  const [newRole, setNewRole] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  const handleRoleChange = async (user: UserItem, role: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, role }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, role } : u)));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedUsers = users.filter((u) => selectedIds.includes(u.id));
    const deletable = selectedUsers.filter((u) => u.id !== currentUserId);

    for (const user of deletable) {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
    }

    setUsers(users.filter((u) => !deletable.some((d) => d.id === u.id)));
    setRowSelection({});
    setBulkDeleteOpen(false);
  };

  const columns: ColumnDef<UserItem, unknown>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-primary"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-primary"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Utilisateur",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <UserAvatar user={user} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13px] font-medium text-gray-900 dark:text-foreground">
                    {user.name ?? "Sans nom"}
                  </p>
                  {user.id === currentUserId && (
                    <Badge variant="secondary" className="text-[9px]">
                      vous
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">{user.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-[12px] text-gray-500 dark:text-gray-400">
            {row.original.email}
          </span>
        ),
        enableHiding: true,
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
        filterFn: (row, columnId, value) => {
          const filterValues = value as string[];
          return filterValues.includes(row.getValue(columnId) as string);
        },
      },
      {
        id: "status",
        header: "Statut",
        cell: ({ row }) => {
          const status = getUserStatus(row.original);
          const statusConfig = statuses.find((s) => s.value === status);
          return (
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig?.color ?? "bg-gray-400"}`} />
              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                {statusConfig?.label ?? status}
              </span>
            </div>
          );
        },
        filterFn: (row, _columnId, value) => {
          const filterValues = value as string[];
          const status = getUserStatus(row.original);
          return filterValues.includes(status);
        },
      },
      {
        accessorKey: "createdAt",
        header: "Inscrit le",
        cell: ({ row }) => (
          <span className="text-[12px] text-gray-500 dark:text-gray-400">
            {formatDateShort(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const user = row.original;
          const isCurrentUser = user.id === currentUserId;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => setViewUser(user)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setRoleDialogUser(user);
                    setNewRole(user.role);
                  }}
                  disabled={isCurrentUser}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Changer le rôle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteTarget(user)}
                  disabled={isCurrentUser}
                  className="text-red-600 focus:text-red-600 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [currentUserId]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = (filterValue as string).toLowerCase();
      return (
        row.original.name?.toLowerCase().includes(search) ||
        row.original.email.toLowerCase().includes(search)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRowCount = Object.keys(rowSelection).length;
  const filteredUsers = table.getFilteredRowModel().rows;
  const roleColumn = table.getColumn("role");
  const statusColumn = table.getColumn("status");

  return (
    <div className="min-h-screen">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                  Utilisateurs
                </h1>
                <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                  {users.length} utilisateurs au total
                </p>
              </div>
            </div>
            {selectedRowCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="h-8"
                onClick={() => setBulkDeleteOpen(true)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Supprimer ({selectedRowCount})
              </Button>
            )}
          </div>
        </motion.div>

        {/* Table Card */}
        <motion.div variants={fadeUp}>
          <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
            <CardContent className="p-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/[0.04]">
                <div className="flex flex-1 items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom ou email..."
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      className="h-8 w-[250px] pl-8 lg:w-[300px]"
                    />
                  </div>

                  {/* Role Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Rôle
                        {((roleColumn?.getFilterValue() as string[]) ?? []).length > 0 && (
                          <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                              {(roleColumn?.getFilterValue() as string[]).length}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                              {((roleColumn?.getFilterValue() as string[]) ?? []).map((v) => (
                                <Badge key={v} variant="secondary" className="rounded-sm px-1 font-normal">
                                  {roles.find((r) => r.value === v)?.label ?? v}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Rôle" />
                        <CommandList>
                          <CommandEmpty>Aucun résultat.</CommandEmpty>
                          <CommandGroup>
                            {roles.map((role) => {
                              const isSelected = ((roleColumn?.getFilterValue() as string[]) ?? []).includes(role.value);
                              return (
                                <CommandItem
                                  key={role.value}
                                  onSelect={() => {
                                    const current = (roleColumn?.getFilterValue() as string[]) ?? [];
                                    const next = isSelected
                                      ? current.filter((v) => v !== role.value)
                                      : [...current, role.value];
                                    roleColumn?.setFilterValue(next.length ? next : undefined);
                                  }}
                                >
                                  <div
                                    className={cn(
                                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                      isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                    )}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                  <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{role.label}</span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                          {((roleColumn?.getFilterValue() as string[]) ?? []).length > 0 && (
                            <>
                              <CommandSeparator />
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => roleColumn?.setFilterValue(undefined)}
                                  className="justify-center text-center"
                                >
                                  Effacer les filtres
                                </CommandItem>
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Status Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Statut
                        {((statusColumn?.getFilterValue() as string[]) ?? []).length > 0 && (
                          <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                              {(statusColumn?.getFilterValue() as string[]).length}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                              {((statusColumn?.getFilterValue() as string[]) ?? []).map((v) => (
                                <Badge key={v} variant="secondary" className="rounded-sm px-1 font-normal">
                                  {statuses.find((s) => s.value === v)?.label ?? v}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Statut" />
                        <CommandList>
                          <CommandEmpty>Aucun résultat.</CommandEmpty>
                          <CommandGroup>
                            {statuses.map((status) => {
                              const isSelected = ((statusColumn?.getFilterValue() as string[]) ?? []).includes(status.value);
                              return (
                                <CommandItem
                                  key={status.value}
                                  onSelect={() => {
                                    const current = (statusColumn?.getFilterValue() as string[]) ?? [];
                                    const next = isSelected
                                      ? current.filter((v) => v !== status.value)
                                      : [...current, status.value];
                                    statusColumn?.setFilterValue(next.length ? next : undefined);
                                  }}
                                >
                                  <div
                                    className={cn(
                                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                      isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                    )}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                  <span className={`mr-2 h-2 w-2 rounded-full ${status.color}`} />
                                  <span>{status.label}</span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                          {((statusColumn?.getFilterValue() as string[]) ?? []).length > 0 && (
                            <>
                              <CommandSeparator />
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => statusColumn?.setFilterValue(undefined)}
                                  className="justify-center text-center"
                                >
                                  Effacer les filtres
                                </CommandItem>
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {((roleColumn?.getFilterValue() as string[]) ?? []).length > 0 ||
                  ((statusColumn?.getFilterValue() as string[]) ?? []).length > 0 ||
                  globalFilter ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 lg:px-3"
                      onClick={() => {
                        table.resetColumnFilters();
                        setGlobalFilter("");
                      }}
                    >
                      Réinitialiser
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  ) : null}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                      <Settings2 className="mr-2 h-4 w-4" />
                      Colonnes
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    <div className="px-2 py-1.5 text-[12px] font-medium text-muted-foreground">
                      Afficher colonnes
                    </div>
                    <DropdownMenuSeparator />
                    {table
                      .getAllColumns()
                      .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                      .map((column) => (
                        <DropdownMenuItem
                          key={column.id}
                          className="capitalize"
                          onClick={() => column.toggleVisibility(!column.getIsVisible())}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              column.getIsVisible()
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50"
                            )}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          {column.id === "createdAt" ? "Inscrit le" : column.id}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Table */}
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Users className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                  <p className="text-[13px] text-gray-500">Aucun utilisateur</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Search className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                  <p className="text-[13px] text-gray-500">Aucun résultat pour cette recherche</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="border-b border-gray-100 dark:border-white/[0.04]">
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/80 dark:border-white/[0.02] dark:hover:bg-accent/[0.02]"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Pagination */}
              {users.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-white/[0.04]">
                  <div className="flex-1 text-[12px] text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                    {table.getFilteredRowModel().rows.length} utilisateur(s) sélectionné(s)
                  </div>
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <p className="text-[12px] font-medium">Par page</p>
                      <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-[12px] font-medium">
                      Page {table.getState().pagination.pageIndex + 1} /{" "}
                      {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* User Detail Dialog */}
      <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails de l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Informations complètes sur le compte utilisateur.
            </DialogDescription>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={viewUser.avatar ?? undefined} alt={viewUser.name ?? viewUser.email} />
                  <AvatarFallback className="bg-gray-100 text-lg font-semibold text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    {(viewUser.name ?? viewUser.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[15px] font-semibold text-gray-900 dark:text-foreground">
                    {viewUser.name ?? "Sans nom"}
                  </p>
                  <p className="text-[13px] text-gray-500">{viewUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <RoleBadge role={viewUser.role} />
                    <div className="flex items-center gap-1">
                      {getUserStatus(viewUser) === "active" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span className="text-[11px] text-gray-400">
                        {getUserStatus(viewUser) === "active" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Calendar className="h-3 w-3" />
                    Inscrit le
                  </div>
                  <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                    {formatDateShort(viewUser.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Mail className="h-3 w-3" />
                    Email
                  </div>
                  <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                    {viewUser.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <FileText className="h-3 w-3" />
                    Articles
                  </div>
                  <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                    {viewUser._count.posts}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <MessageSquare className="h-3 w-3" />
                    Commentaires
                  </div>
                  <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                    {viewUser._count.comments}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={!!roleDialogUser}
        onOpenChange={(open) => {
          if (!open) {
            setRoleDialogUser(null);
            setNewRole("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Changer le rôle</DialogTitle>
            <DialogDescription>
              Modifier le rôle de {roleDialogUser?.name ?? roleDialogUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setNewRole(role.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                  newRole === role.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 dark:border-border dark:hover:border-border/80"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    newRole === role.value ? "bg-primary/10" : "bg-gray-100 dark:bg-white/5"
                  )}
                >
                  <role.icon
                    className={cn(
                      "h-4 w-4",
                      newRole === role.value ? "text-primary" : "text-gray-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                    {role.label}
                  </p>
                  <p className="text-[11px] text-gray-400">{role.value}</p>
                </div>
                {newRole === role.value && (
                  <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRoleDialogUser(null);
                setNewRole("");
              }}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (roleDialogUser && newRole && newRole !== roleDialogUser.role) {
                  handleRoleChange(roleDialogUser, newRole);
                }
                setRoleDialogUser(null);
                setNewRole("");
              }}
              disabled={!newRole || newRole === roleDialogUser?.role}
              className="bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4]"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Supprimer l&apos;utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name ?? deleteTarget?.email}
              </span>{" "}
              ? Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Supprimer les utilisateurs
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-medium text-foreground">
                {selectedRowCount} utilisateur(s)
              </span>{" "}
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Tout supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
