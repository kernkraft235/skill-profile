import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ExplanationResponse {
  explanation: string;
}

/**
 * Hook for fetching AI-powered explanations for technical terms
 */
export function useAIExplanation() {
  const [explanation, setExplanation] = useState<string | null>(null);
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ term, context }: { term: string; context?: string }) => {
      const res = await apiRequest('POST', '/api/explain', { term, context });
      return res.json() as Promise<ExplanationResponse>;
    },
    onSuccess: (data) => {
      setExplanation(data.explanation);
    },
  });
  
  const fetchExplanation = useCallback((term: string, context?: string) => {
    setExplanation(null);
    mutate({ term, context });
  }, [mutate]);
  
  return {
    explanation,
    isLoading: isPending,
    error: isError ? error : null,
    fetchExplanation,
  };
}