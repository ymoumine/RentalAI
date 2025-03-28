import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  mapRef: React.RefObject<HTMLDivElement>;
  filteredListings: any[];
  minBudget: number;
  maxBudget: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  mapRef, 
  filteredListings,
  minBudget,
  maxBudget
}) => {
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  // Fix Leaflet icon issue with webpack
  useEffect(() => {
    // This is needed to fix the broken icon paths in leaflet when using webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Create map instance
    leafletMap.current = L.map(mapRef.current).setView([45.4215, -75.6972], 11);

    // Add dark theme tile layer (using CartoDB dark matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap.current);

    // Create a layer group for markers
    markersLayer.current = L.layerGroup().addTo(leafletMap.current);

    // Clean up on unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersLayer.current = null;
      }
    };
  }, [mapRef]);

  // Add markers for filtered listings
  useEffect(() => {
    if (!leafletMap.current || !markersLayer.current || filteredListings.length === 0) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Create bounds object to fit map to markers
    const bounds = L.latLngBounds([]);
    let hasValidMarkers = false;
    
    // Custom purple marker icon
    const purpleIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #9333ea; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add markers for each listing
    filteredListings.forEach(listing => {
      // Check if listing has coordinates
      const lat = parseFloat(listing['Property.Address.Latitude']);
      const lng = parseFloat(listing['Property.Address.Longitude']);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.log('Listing missing coordinates:', listing.Id);
        return;
      }

      // handle bedroom calculation
    const handBedroomNumber = (bedroom: string) => {
      // param is a string : 1 || 1 + 0 eg.
      if (bedroom.includes('+')) {
          const parts = bedroom.split('+');
          bedroom = (Number(parts[0]) + Number(parts[1])).toString();
      }

      return bedroom
  }

      // Get property details
      const bedrooms = handBedroomNumber(listing['Building.Bedrooms']) || 'Studio';
      const bathrooms = listing['Building.BathroomTotal'] || 'N/A';
      const buildingType = listing['Building.Type'] || 'Property';
      const address = listing['Property.Address.AddressText'] || 'Property';
      const price = listing['Property.LeaseRent'] || 'Contact for price';

      // Create popup content
      const popupContent = `
        <div style="font-family: sans-serif; max-width: 240px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: #9333ea;">${address}</h3>
          <p style="margin-bottom: 5px;"><strong>Price:</strong> ${price}</p>
          <p style="margin-bottom: 5px;"><strong>Type:</strong> ${buildingType}</p>
          <p style="margin-bottom: 5px;"><strong>Bedrooms:</strong> ${bedrooms}</p>
          <p style="margin-bottom: 5px;"><strong>Bathrooms:</strong> ${bathrooms}</p>
          <a href="/listings/property/${listing.Id}" style="color: #9333ea; text-decoration: underline; display: inline-block; margin-top: 8px;">View Details</a>
        </div>
      `;

      // Create marker and add to layer group
      const marker = L.marker([lat, lng], { icon: purpleIcon })
        .bindPopup(popupContent)
        .addTo(markersLayer.current!);

      // Extend bounds to include this marker
      bounds.extend([lat, lng]);
      hasValidMarkers = true;
    });

    // Fit map to bounds if we have any valid markers
    if (hasValidMarkers && bounds.isValid()) {
      leafletMap.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  }, [filteredListings]);

  return (
    <div className="budget-map-container">
      <div className="map-stats bg-gray-800 p-3 rounded-t-lg">
        <p className="text-white text-sm">
          Found <span className="text-fuchsia-500 font-bold">{filteredListings.length}</span> properties 
          within budget range: <span className="text-fuchsia-500 font-bold">${minBudget} - ${maxBudget}</span>
        </p>
      </div>
      <div ref={mapRef} className="map-container h-96 rounded-b-lg" />
      <style jsx>{`
        .budget-map-container {
          width: 100%;
          margin-top: 20px;
        }
        .map-container {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default MapComponent; 