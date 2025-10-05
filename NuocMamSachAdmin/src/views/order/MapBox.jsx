import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoiaG92aW5oNDE0IiwiYSI6ImNscTgyNnc0ZjE0ZmcyaXNnNWk2Y2I3ZjYifQ.GnJmCU2qNgAWrFPABAu_hA';

const MapBox = ({ address }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
          params: {
            access_token: mapboxgl.accessToken
          }
        });

        const [longitude, latitude] = response.data.features[0].center;
        setCoordinates({ latitude, longitude });
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      if (!map.current) {
        // Initialize the map if it doesn't exist
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 14 // Set zoom level to make the location visible
        });
      } else {
        // Center the map on new coordinates
        map.current.setCenter([coordinates.longitude, coordinates.latitude]);
      }
    }
  }, [coordinates]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '300px', // Adjust height as needed
        borderRadius: '8px',
        border: '1px solid #D1D5DB'
      }}
    />
  );
};

export default MapBox;
