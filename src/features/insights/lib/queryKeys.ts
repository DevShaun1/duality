export const insightsQueryKeys = {
  all: ['insights'] as const,
  reflection: (reflectionId?: string) => ['insights', 'reflection', reflectionId] as const,
};
