import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BoothLocatorPage from './BoothLocatorPage';
import * as maps from '../lib/maps';

// Mock the maps library
vi.mock('../lib/maps', () => ({
  loadGoogleMaps: vi.fn().mockResolvedValue(true),
  MOCK_BOOTHS: [
    { id: 1, name: 'Test Booth', address: '123 Test St', lat: 28.6, lng: 77.2 }
  ],
}));

// Mock Google Maps globally
const mockMap = {
  setCenter: vi.fn(),
  setZoom: vi.fn(),
  fitBounds: vi.fn(),
};

const mockMapConstructor = vi.fn().mockImplementation(function() { return mockMap; });
const mockMarkerConstructor = vi.fn();
const mockTrafficLayerConstructor = vi.fn().mockImplementation(function() { 
  return { setMap: vi.fn() }; 
});
const mockAutocompleteConstructor = vi.fn().mockImplementation(function() { 
  return {
    bindTo: vi.fn(),
    addListener: vi.fn(),
  };
});

global.google = {
  maps: {
    Map: mockMapConstructor,
    Marker: mockMarkerConstructor,
    TrafficLayer: mockTrafficLayerConstructor,
    SymbolPath: { BACKWARD_CLOSED_ARROW: 1 },
    places: {
      Autocomplete: mockAutocompleteConstructor,
    },
  },
};

// Helper to access the mocks
const mockAutocomplete = mockAutocompleteConstructor;

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn().mockImplementation((success) => 
    success({ coords: { latitude: 28.6, longitude: 77.2 } })
  ),
};
global.navigator.geolocation = mockGeolocation;

describe('BoothLocatorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and loads map with markers', async () => {
    render(<BoothLocatorPage />);
    
    expect(screen.getByText(/Polling Booth Locator/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(maps.loadGoogleMaps).toHaveBeenCalled();
      expect(global.google.maps.Map).toHaveBeenCalled();
      // Verify marker was created for the mock booth
      expect(global.google.maps.Marker).toHaveBeenCalled();
    });

    expect(screen.getByText('Test Booth')).toBeInTheDocument();
  });

  it('handles autocomplete place selection', async () => {
    // Get the listener that was registered
    let placeChangedCallback;
    mockAutocomplete.mockImplementation(function() {
      return {
        bindTo: vi.fn(),
        addListener: vi.fn((event, cb) => {
          if (event === 'place_changed') placeChangedCallback = cb;
        }),
        getPlace: vi.fn().mockReturnValue({
          geometry: {
            location: { lat: 28.7, lng: 77.3 },
            viewport: { north: 28.8, south: 28.6, east: 77.4, west: 77.2 }
          }
        })
      };
    });

    render(<BoothLocatorPage />);

    await waitFor(() => {
      expect(placeChangedCallback).toBeDefined();
    });

    // Simulate place selection
    placeChangedCallback();

    expect(mockMap.fitBounds).toHaveBeenCalled();
  });

  it('handles autocomplete without viewport', async () => {
    let placeChangedCallback;
    mockAutocomplete.mockImplementation(function() {
      return {
        bindTo: vi.fn(),
        addListener: vi.fn((event, cb) => {
          if (event === 'place_changed') placeChangedCallback = cb;
        }),
        getPlace: vi.fn().mockReturnValue({
          geometry: {
            location: { lat: 28.7, lng: 77.3 }
            // No viewport
          }
        })
      };
    });

    render(<BoothLocatorPage />);
    await waitFor(() => expect(placeChangedCallback).toBeDefined());
    placeChangedCallback();
    expect(mockMap.setCenter).toHaveBeenCalled();
  });

  it('handles autocomplete without geometry', async () => {
    let placeChangedCallback;
    mockAutocomplete.mockImplementation(function() {
      return {
        bindTo: vi.fn(),
        addListener: vi.fn((event, cb) => {
          if (event === 'place_changed') placeChangedCallback = cb;
        }),
        getPlace: vi.fn().mockReturnValue({}) // No geometry
      };
    });

    render(<BoothLocatorPage />);
    await waitFor(() => expect(placeChangedCallback).toBeDefined());
    placeChangedCallback();
    expect(mockMap.fitBounds).not.toHaveBeenCalled();
  });

  it('handles autocomplete with geometry but no location', async () => {
    let placeChangedCallback;
    mockAutocomplete.mockImplementation(function() {
      return {
        bindTo: vi.fn(),
        addListener: vi.fn((event, cb) => {
          if (event === 'place_changed') placeChangedCallback = cb;
        }),
        getPlace: vi.fn().mockReturnValue({ geometry: {} }) // No location
      };
    });

    render(<BoothLocatorPage />);
    await waitFor(() => expect(placeChangedCallback).toBeDefined());
    placeChangedCallback();
    // Should only have been called once during initial load (geolocation success)
    expect(mockMap.setCenter).toHaveBeenCalledTimes(1);
  });

  it('handles geolocation failure', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => error());
    
    render(<BoothLocatorPage />);
    
    await waitFor(() => {
      expect(maps.loadGoogleMaps).toHaveBeenCalled();
    });
    // Should still render without crashing
    expect(screen.getByText(/Polling Booth Locator/i)).toBeInTheDocument();
  });

  it('handles map loading error', async () => {
    vi.mocked(maps.loadGoogleMaps).mockRejectedValueOnce(new Error('Maps failed'));
    
    render(<BoothLocatorPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Google Maps Error: Maps failed/i)).toBeInTheDocument();
    });
  });
});
