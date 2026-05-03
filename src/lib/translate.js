/**
 * @fileoverview Utility for integrating Google Translate into the application.
 * @module lib/translate
 */

/**
 * Initializes the Google Translate element.
 * Should be called once on application mount.
 */
export const initGoogleTranslate = () => {
  // If already loaded, don't load again
  if (document.getElementById('google_translate_element_script')) return;

  // Define the callback function globally
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'hi,mr,ta,te,kn,ml,gu,pa,bn',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  // Create the script element
  const script = document.createElement('script');
  script.id = 'google_translate_element_script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.head.appendChild(script);
};
