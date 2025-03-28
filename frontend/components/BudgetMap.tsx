import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap, LayerGroup, LatLngBounds, DivIcon, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface BudgetMapProps {
  minBudget: number;
  maxBudget: number;
  listings: any[];
}


// Create a component that will only be loaded on the client side
const BudgetMap: React.FC<BudgetMapProps> = ({ minBudget, maxBudget, listings }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter listings based on budget range
  useEffect(() => {
    if (!listings || listings.length === 0) return;

    const filtered = listings.filter(listing => {
      // Extract the numeric price from the formatted price string
      const priceString = listing['Property.LeaseRent'] || '';
      const priceMatch = priceString.match(/\$?([\d,]+)/);
      if (!priceMatch) return false;
      
      const price = parseFloat(priceMatch[1].replace(/,/g, ''));
      return price >= minBudget && price <= maxBudget;
    });

    setFilteredListings(filtered);
    console.log(`Found ${filtered.length} listings within budget range`);
  }, [listings, minBudget, maxBudget]);

  // Only render the map on the client side
  if (!isClient) {
    return (
      <div className="budget-map-container">
        <div className="map-stats bg-gray-800 p-3 rounded-t-lg">
          <p className="text-white text-sm">
            Loading map...
          </p>
        </div>
        <div className="map-container h-96 rounded-b-lg bg-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
        </div>
      </div>
    );
  }

  return <MapComponent 
    mapRef={mapRef} 
    filteredListings={filteredListings} 
    minBudget={minBudget} 
    maxBudget={maxBudget} 
  />;
};


// This component will only be loaded on the client side
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="map-container h-96 rounded-b-lg bg-gray-800 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
    </div>
  ),
});

export default BudgetMap; 