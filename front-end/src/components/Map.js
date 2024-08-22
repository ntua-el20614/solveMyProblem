import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // Ensure Leaflet is imported to use 'L'

function MapComponent({ locations }) {
  // Component to adjust the map bounds
  const SetViewToFitBounds = ({ locations }) => {
    const map = useMap(); // Hook to access map instance
    useEffect(() => {
      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations.map(loc => [loc.Latitude, loc.Longitude]));
        map.fitBounds(bounds, { padding: [50, 50] }); // Optional padding for better view
      }
    }, [locations, map]);
    return null;
  };

  return (
    <MapContainer center={[0, 0]} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, index) => (
        <CircleMarker
          key={index}
          center={[loc.Latitude, loc.Longitude]}
          radius={5}
          fillColor="red"
          color="red"
          weight={1}
          fillOpacity={0.8}
        >
          <Popup>
            Latitude: {loc.Latitude}, Longitude: {loc.Longitude}
          </Popup>
        </CircleMarker>
      ))}
      <SetViewToFitBounds locations={locations} />
    </MapContainer>
  );
}

export default MapComponent;
