'use client';

import { useState, useEffect } from 'react';
import type { DeploymentTag, TagsApiResponse } from '@/types/deployment';

interface UseGitHubTagsReturn {
  tags: DeploymentTag[];
  currentSha: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useGitHubTags(): UseGitHubTagsReturn {
  const [tags, setTags] = useState<DeploymentTag[]>([]);
  const [currentSha, setCurrentSha] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTags() {
      try {
        const res = await fetch('/api/github-tags');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: TagsApiResponse = await res.json();
        if (!cancelled) {
          setTags(data.tags);
          setCurrentSha(data.currentSha);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch tags'
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchTags();
    return () => {
      cancelled = true;
    };
  }, []);

  return { tags, currentSha, isLoading, error };
}
