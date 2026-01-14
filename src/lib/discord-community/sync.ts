import { useEffect, useState } from 'react';
import type { UserProfile } from './types';

export function useProfileSync(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const response = await fetch(`/api/profile/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load profile');
        }
        
        const data = await response.json();
        setProfile(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  return { profile, loading, error };
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const response = await fetch(`/api/profile/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
}

export async function syncRolesToDiscord(userId: string, roles: string[]) {
  const response = await fetch(`/api/roles/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ roles })
  });

  if (!response.ok) {
    throw new Error('Failed to sync roles');
  }

  return response.json();
}
