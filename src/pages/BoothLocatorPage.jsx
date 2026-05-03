/**
 * @fileoverview Polling Booth Locator page using Google Maps.
 * @module pages/BoothLocatorPage
 */

import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps, MOCK_BOOTHS } from '../lib/maps';
import { trackEvent } from '../lib/firebase';

const BoothLocatorPage = () => {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('page_view', { page_title: 'Booth Locator' });
    
    const init = async () => {
      try {
        await loadGoogleMaps();
        setLoading(false);
        
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
          zoom: 14,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          ],
        });

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

      <div
        className="glass-card"
        style={{
          height: '500px',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          padding: 0,
        }}
      >
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 10,
            }}
          >
            <div className="spinner" />
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
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
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
