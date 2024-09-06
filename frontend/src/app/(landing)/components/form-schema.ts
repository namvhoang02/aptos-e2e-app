import { z } from 'zod';

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long.' })
    .max(50, { message: 'Title must be no more than 50 characters long.' }),
});

export default formSchema;
