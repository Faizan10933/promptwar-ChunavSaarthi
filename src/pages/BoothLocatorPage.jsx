/**
 * @fileoverview Polling Booth Locator page using Google Maps.
 * @module pages/BoothLocatorPage
 */

import { useEffect, useRef, useState } from 'react';
import { usePageView } from '../hooks/usePageView';
import { Spinner } from '../components/UI';
import { loadGoogleMaps, MOCK_BOOTHS } from '../lib/maps';

/**
 * Interactive Polling Booth Locator page.
 * Uses Google Maps API to display nearby stations and user location.
 * @returns {React.ReactElement} The BoothLocatorPage component.
 */
const BoothLocatorPage = () => {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track page view via custom hook
  usePageView('Booth Locator');

  useEffect(() => {
    const init = async () => {
      try {
        await loadGoogleMaps();
        setLoading(false);
        
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
          zoom: 14,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          ],
        });

        // Add Traffic Layer for advanced service usage
        const trafficLayer = new window.google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        // Add markers for booths
        MOCK_BOOTHS.forEach((booth) => {
          new window.google.maps.Marker({
            position: { lat: booth.lat, lng: booth.lng },
            map,
            title: booth.name,
            icon: {
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: '#ff9933',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            },
          });
        });

        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              map.setCenter(userPos);
              new window.google.maps.Marker({
                position: userPos,
                map,
                title: 'Your Location',
                label: 'YOU',
              });
            },
            () => {
              console.warn('Geolocation failed or denied.');
            }
          );
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span aria-hidden="true">📍</span> Polling Booth Locator
      </h1>
      <p className="page-subtitle">
        Find your nearest polling station powered by **Google Maps**. Enter your EPIC number or
        search by location to verify your booth details.
      </p>

      <div className="booth-map-container">
        {loading && (
          <div className="booth-loading-overlay">
            <Spinner size="md" />
          </div>
        )}
        {error && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--red)',
            }}
          >
            <h3>⚠️ Google Maps Error</h3>
            <p>{error}</p>
          </div>
        )}
        <div 
          ref={mapRef} 
          style={{ width: '100%', height: '100%' }} 
          aria-label="Interactive Google Map showing polling booth locations" 
          role="region"
        />
      </div>

      <div className="features-grid" style={{ marginTop: '32px' }}>
        {MOCK_BOOTHS.map((booth) => (
          <div key={booth.id} className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{booth.name}</h3>
            <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {booth.address}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoothLocatorPage;
