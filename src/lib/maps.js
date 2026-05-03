/**
 * @fileoverview Utility for loading and interacting with the Google Maps JavaScript API.
 * @module lib/maps
 */

let isLoading = false;
let isLoaded = false;

/**
 * Dynamically loads the Google Maps JavaScript API script.
 * @returns {Promise<void>} Resolves when the API is ready to use.
 */
export const loadGoogleMaps = () => {
  if (isLoaded) return Promise.resolve();
  if (isLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (isLoaded) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  isLoading = true;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Google Maps script failed to load. Check your API key.'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Mock polling booth locations for demonstration.
 * In a production app, these would come from an ECI API or Firestore.
 * @type {Array<{id: number, name: string, lat: number, lng: number, address: string}>}
 */
export const MOCK_BOOTHS = [
  { id: 1, name: 'Goverment Primary School', lat: 28.6139, lng: 77.2090, address: 'Central Delhi, India' },
  { id: 2, name: 'Public Library Hall', lat: 28.6150, lng: 77.2100, address: 'Janpath, Delhi' },
  { id: 3, name: 'Community Center', lat: 28.6120, lng: 77.2080, address: 'Chanakyapuri, Delhi' },
];
