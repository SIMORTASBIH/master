import { useState, useEffect } from 'react';
import { Profile } from '../lib/localStorage';

// Simple profile service for getting all profiles
class ProfileService {
  static async getAll(): Promise<Profile[]> {
    try {
      const profiles = localStorage.getItem('simor_profiles');
      return profiles ? JSON.parse(profiles) : [];
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  }
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfileService.getAll();
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
  };
}