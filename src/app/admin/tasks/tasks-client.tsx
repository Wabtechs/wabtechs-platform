"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ListTodo,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { cn, formatDate } from "@/lib/utils";
import type { Task, TaskFormValues, TaskStatus, TaskPriority, TaskLabel } from "./data/schema";
import {
  statuses,
  priorities,
  labels,
  getStatusByValue,
  getPriorityByValue,
  getLabelByValue,
} from "./data/tasks";

interface Props {
  initialTasks: Task[];
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "todo":
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
}

function getPriorityIcon(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "medium":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "low":
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
}

export function TasksClient({ initialTasks }: Props) {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<{ id: string; value: unknown }[]>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);
  const [formData, setFormData] = React.useState<TaskFormValues>({
    title: "",
    status: "todo",
    priority: "medium",
    label: "feature",
  });

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({ title: "", status: "todo", priority: "medium", label: "feature" });
    setDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      status: task.status,
      priority: task.priority,
      label: task.label,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...formData }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (task: Task) => {
    setDeletingTask(task);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingTask) {
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      setDeleteDialogOpen(false);
      setDeletingTask(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    const selectedIds = new Set(Object.keys(rowSelection));
    setTasks((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    setRowSelection({});
    setBulkDeleteDialogOpen(false);
  };

  const columns: ColumnDef<Task, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Tout sélectionner"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label="Sélectionner"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Titre" />,
      cell: ({ row }) => (
        <span className="text-[13px] font-medium text-gray-900 dark:text-foreground">
          {row.getValue("title")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
      cell: ({ row }) => {
        const status = getStatusByValue(row.getValue("status") as TaskStatus);
        return status ? (
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", status.color)}>
            {getStatusIcon(row.getValue("status") as TaskStatus)}
            {status.label}
          </span>
        ) : null;
      },
      filterFn: (row, id, value) => {
        const filterValues = value as string[];
        return filterValues.includes(row.getValue(id) as string);
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priorité" />,
      cell: ({ row }) => {
        const priority = getPriorityByValue(row.getValue("priority") as TaskPriority);
        return priority ? (
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", priority.color)}>
            {getPriorityIcon(row.getValue("priority") as TaskPriority)}
            {priority.label}
          </span>
        ) : null;
      },
      filterFn: (row, id, value) => {
        const filterValues = value as string[];
        return filterValues.includes(row.getValue(id) as string);
      },
    },
    {
      accessorKey: "label",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Étiquette" />,
      cell: ({ row }) => {
        const label = getLabelByValue(row.getValue("label") as TaskLabel);
        return label ? (
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium", label.color)}>
            {label.label}
          </span>
        ) : null;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Créé le" />,
      cell: ({ row }) => (
        <span className="text-[12px] text-gray-500 dark:text-gray-400">
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original)} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: tasks,
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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    globalFilterFn: (row, _columnId, filterValue) => {
      const title = row.getValue("title") as string;
      return title.toLowerCase().includes((filterValue as string).toLowerCase());
    },
  });

  const selectedCount = Object.keys(rowSelection).length;
  const taskCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div>
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                  Tâches
                </h1>
                <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                  {taskCount} tâches · {todoCount} à faire · {inProgressCount} en cours · {doneCount} terminées
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedCount > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Supprimer ({selectedCount})
                </Button>
              )}
              <Button
                size="sm"
                className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
                onClick={handleCreate}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Ajouter une tâche
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeUp} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            { label: "Total", value: taskCount, icon: ListTodo, color: "#842ae3" },
            { label: "À faire", value: todoCount, icon: Circle, color: "#6b7280" },
            { label: "En cours", value: inProgressCount, icon: Clock, color: "#3b82f6" },
            { label: "Terminées", value: doneCount, icon: CheckCircle2, color: "#10b981" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${stat.color}12` }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Data Table */}
        <motion.div variants={fadeUp}>
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <ListTodo className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
                    Liste des tâches
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative">
                    <Input
                      placeholder="Rechercher..."
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      className="h-8 w-[200px] pl-8 lg:w-[300px]"
                    />
                    <svg
                      className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <DataTableFacetedFilter
                    column={table.getColumn("status")}
                    title="Statut"
                    options={statuses.map((s) => ({ label: s.label, value: s.value }))}
                  />
                  <DataTableFacetedFilter
                    column={table.getColumn("priority")}
                    title="Priorité"
                    options={priorities.map((p) => ({ label: p.label, value: p.value }))}
                  />
                  {columnFilters.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setColumnFilters([]);
                        setGlobalFilter("");
                      }}
                      className="h-8 px-2 lg:px-3"
                    >
                      Réinitialiser
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b last:border-0"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <ListTodo className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                          <p className="text-[13px] text-gray-500">Aucune tâche trouvée</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t px-4 py-3">
                <div className="flex-1 text-sm text-muted-foreground">
                  {selectedCount} ligne(s) sélectionnée(s)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Modifiez les détails de la tâche ci-dessous."
                : "Remplissez les informations pour créer une nouvelle tâche."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Titre de la tâche"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value as TaskStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priority: value as TaskPriority }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Étiquette</Label>
              <Select
                value={formData.label}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, label: value as TaskLabel }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {labels.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
            >
              {editingTask ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Supprimer la tâche</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {deletingTask && (
            <div className="py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                {deletingTask.title}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Supprimer les tâches</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {Object.keys(rowSelection).length} tâche(s) ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmBulkDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
