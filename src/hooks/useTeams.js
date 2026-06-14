import { useState, useEffect, useCallback } from 'react';
import { dbService } from '../lib/dbService';
import { useLanguage } from '../context/LanguageContext';

export function useTeams() {
  const { lang } = useLanguage();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeamsData = useCallback(async () => {
    setLoading(true);
    try {
      const [teamsData, membersData] = await Promise.all([
        dbService.getTeams(lang),
        dbService.getMembers(lang),
      ]);
      setTeams(teamsData);
      setMembers(membersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching teams/members:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchTeamsData();
  }, [fetchTeamsData]);

  const getTeamById = useCallback(async (id) => {
    try {
      return await dbService.getTeamById(id, lang);
    } catch (err) {
      console.error(`Error fetching team ${id}:`, err);
      throw err;
    }
  }, [lang]);

  const getMembersByTeam = useCallback(async (teamId) => {
    try {
      return await dbService.getMembersByTeam(teamId, lang);
    } catch (err) {
      console.error(`Error fetching members for team ${teamId}:`, err);
      throw err;
    }
  }, [lang]);

  const getProjectsByTeam = useCallback(async (teamId) => {
    try {
      return await dbService.getProjectsByTeam(teamId, lang);
    } catch (err) {
      console.error(`Error fetching projects for team ${teamId}:`, err);
      throw err;
    }
  }, [lang]);

  const getMemberById = useCallback(async (id) => {
    try {
      return await dbService.getMemberById(id, lang);
    } catch (err) {
      console.error(`Error fetching member ${id}:`, err);
      throw err;
    }
  }, [lang]);

  const getProjectById = useCallback(async (id) => {
    try {
      return await dbService.getProjectById(id, lang);
    } catch (err) {
      console.error(`Error fetching project ${id}:`, err);
      throw err;
    }
  }, [lang]);

  return {
    teams,
    members,
    loading,
    error,
    refetch: fetchTeamsData,
    getTeamById,
    getMembersByTeam,
    getProjectsByTeam,
    getMemberById,
    getProjectById,
  };
}
