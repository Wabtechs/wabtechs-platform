import { z } from "zod";

export const taskStatusEnum = z.enum(["todo", "in-progress", "done"]);
export const taskPriorityEnum = z.enum(["low", "medium", "high"]);
export const taskLabelEnum = z.enum(["bug", "feature", "improvement", "documentation"]);

export type TaskStatus = z.infer<typeof taskStatusEnum>;
export type TaskPriority = z.infer<typeof taskPriorityEnum>;
export type TaskLabel = z.infer<typeof taskLabelEnum>;

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Le titre est requis"),
  status: taskStatusEnum,
  priority: taskPriorityEnum,
  label: taskLabelEnum,
  createdAt: z.date(),
});

export const taskFormSchema = taskSchema.omit({ id: true, createdAt: true });

export type Task = z.infer<typeof taskSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
