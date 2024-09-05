import { z } from "zod";
import { HTTP_STATUS } from '@/lib/constants';

export interface FetchStatus {
  fetchStatus: HTTP_STATUS | null;
  errors: Error | null;
}

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  // label: z.string(),
  // priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>

export interface InitialLandingState extends FetchStatus {
  // Mutable value
  list: string[];
  data: Record<string, Task>;
  // Immutable value
}
