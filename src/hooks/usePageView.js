import { useEffect } from 'react';
import { trackEvent } from '../lib/firebase';

/**
 * Custom hook to track page views automatically.
 * @param {string} pageTitle - The title of the page to track.
 */
export const usePageView = (pageTitle) => {
  useEffect(() => {
    trackEvent('page_view', { page_title: pageTitle });
  }, [pageTitle]);
};
