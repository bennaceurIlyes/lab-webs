import { useState, useEffect, useCallback } from 'react';
import { dbService } from '../lib/dbService';
import { useLanguage } from '../context/LanguageContext';

export function useNews() {
  const { lang } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dbService.getNews(lang);
      setNews(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const getNewsById = useCallback(async (id) => {
    try {
      return await dbService.getNewsById(id, lang);
    } catch (err) {
      console.error(`Error fetching news item ${id}:`, err);
      throw err;
    }
  }, [lang]);

  return { news, loading, error, refetch: fetchNews, getNewsById };
}
