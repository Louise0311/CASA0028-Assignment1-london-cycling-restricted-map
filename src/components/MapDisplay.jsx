import React, { useRef } from 'react';
import { Map, Source, Layer, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function MapDisplay({ bikePoints, selectedPoint, setSelectedPoint }) {
  // Define the styling for GeoJSON points [cite: 853, 913]
  const mapRef = useRef();
  const layerStyle = {
    id: 'point-layer',
    type: 'circle',
    paint: {
      'circle-radius': 7,
      'circle-color': '#ff4d4d', // Red color for restricted points
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  };

  // Wrap the array back into a GeoJSON FeatureCollection structure [cite: 826, 897]
  const geojson = { type: 'FeatureCollection', features: bikePoints };

  // The logic for clicking on the map (Week 3 core)
  const onMapClick = (event) => {
    const feature = event.features[0]; // Get the first element clicked
    if (feature) {
      console.log("Selected Point:", feature.properties);
      setSelectedPoint(feature); // Update the parent component's state
    }
  };


  return (
    <Map
      initialViewState={{ longitude: -0.1276, latitude: 51.5072, zoom: 11 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      // Specify which layers are clickable and bind click functions (Week 3)
      interactiveLayerIds={['point-layer']}
      onClick={onMapClick}
      ref={mapRef}
      onMouseEnter={() => {
        if (mapRef.current) mapRef.current.getCanvas().style.cursor = 'pointer';
      }}
      onMouseLeave={() => {
        if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
      }}
      
    >
      <Source id="cycling-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>

      {/* Popup (Week 3 & 4 ) */}
      {selectedPoint && (
        <Popup
          longitude={selectedPoint.geometry.coordinates[0]}
          latitude={selectedPoint.geometry.coordinates[1]}
          anchor="bottom"
          onClose={() => setSelectedPoint(null)} // "click cross to close"
          closeOnClick={false}
        >
          <div style={{ maxWidth: '200px', fontFamily: 'sans-serif' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{selectedPoint.properties.BOROUGH}</h3>
            <p style={{ fontSize: '12px', margin: '5px 0' }}>
              <strong>Steps:</strong> {selectedPoint.properties.RST_STEPS}
            </p>
            {/*Showing photos from the scene (using PHOTO1_URL from the data).*/}
            <img 
              src={selectedPoint.properties.PHOTO1_URL} 
              alt="Barrier location" 
              style={{ width: '100%', borderRadius: '4px', marginTop: '5px' }}
              // If the image fails to load, a message will be displayed.
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
            />
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default MapDisplay;