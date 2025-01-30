import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | Note Taking App`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}; 