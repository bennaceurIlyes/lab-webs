import { useState, useEffect, useCallback } from 'react';
import { dbService } from '../lib/dbService';
import { useLanguage } from '../context/LanguageContext';

export function usePublications() {
  const { lang } = useLanguage();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dbService.getArticles(lang);
      setPublications(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching publications:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const getPublicationById = useCallback(async (id) => {
    try {
      return await dbService.getArticleById(id, lang);
    } catch (err) {
      console.error(`Error fetching article ${id}:`, err);
      throw err;
    }
  }, [lang]);

  const getArticleCoAuthors = useCallback(async (articleId) => {
    try {
      return await dbService.getArticleCoAuthors(articleId, lang);
    } catch (err) {
      console.error(`Error fetching co-authors for article ${articleId}:`, err);
      throw err;
    }
  }, [lang]);

  const getPublicationsByMember = useCallback(async (memberId) => {
    try {
      return await dbService.getArticlesByMember(memberId, lang);
    } catch (err) {
      console.error(`Error fetching publications for member ${memberId}:`, err);
      throw err;
    }
  }, [lang]);

  // Dynamic formatting of citations
  const getCitationText = useCallback((art, format, primaryAuthorName = 'LDREAS Researchers') => {
    if (!art) return '';
    const year = art.published_at ? new Date(art.published_at).getFullYear() : '2026';
    const authors = [primaryAuthorName, ...(art.coAuthors || [])].join(', ');

    if (format === 'bibtex') {
      return `@article{ldreas_${art.id},\n  author = {${authors}},\n  title = {${art.name}},\n  journal = {${art.journal_name || 'Saharan Energy Journal'}},\n  year = {${year}},\n  volume = {${art.volume || '1'}},\n  number = {${art.issue || '1'}},\n  pages = {${art.pages || '1-10'}},\n  doi = {${art.doi || ''}}\n}`;
    }
    if (format === 'ris') {
      const authorBlock = [primaryAuthorName, ...(art.coAuthors || [])].map(a => `AU  - ${a}`).join('\n');
      return `TY  - JOUR\n${authorBlock}\nTI  - ${art.name}\nJO  - ${art.journal_name || 'Saharan Energy Journal'}\nPY  - ${year}\nVL  - ${art.volume || '1'}\nIS  - ${art.issue || '1'}\nSP  - ${art.pages?.split('-')[0] || '1'}\nEP  - ${art.pages?.split('-')[1] || '10'}\nUR  - https://doi.org/${art.doi || ''}\nER  - `;
    }
    if (format === 'apa') {
      return `${authors}. (${year}). ${art.name}. ${art.journal_name || 'Saharan Energy Journal'}, ${art.volume || '1'}(${art.issue || '1'}), ${art.pages || '1-10'}. https://doi.org/${art.doi || ''}`;
    }
    if (format === 'chicago') {
      return `${authors}. "${art.name}." ${art.journal_name || 'Saharan Energy Journal'} ${art.volume || '1'}, no. ${art.issue || '1'} (${year}): ${art.pages || '1-10'}.`;
    }
    return '';
  }, []);

  return {
    publications,
    loading,
    error,
    refetch: fetchPublications,
    getPublicationById,
    getArticleCoAuthors,
    getPublicationsByMember,
    getCitationText,
  };
}
