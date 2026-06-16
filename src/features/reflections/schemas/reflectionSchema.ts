import z from "zod";

export const reflectionFormSchema = z.object({
    sleepHours: z
      .number()
      .min(0, 'Sleep cannot be less than 0 hours.')
      .max(24, 'Sleep cannot be more than 24 hours.'),
  
    energy: z
      .number()
      .min(1, 'Energy must be between 1 and 10.')
      .max(10, 'Energy must be between 1 and 10.'),
  
    mood: z
      .number()
      .min(1, 'Mood must be between 1 and 10.')
      .max(10, 'Mood must be between 1 and 10.'),
  
    stress: z
      .number()
      .min(1, 'Stress must be between 1 and 10.')
      .max(10, 'Stress must be between 1 and 10.'),
  
    exercise: z.boolean(),
  
    reflection: z
      .string()
      .trim()
      .min(20, 'Write at least 20 characters for your reflection.'),
  });