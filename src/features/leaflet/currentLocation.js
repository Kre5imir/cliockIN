import React, { useState, useRef } from "react";
import { Map, TileLayer, Marker, Popup, MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "leaflet/dist/leaflet.css";
import osmProviders from "./osm-providers";

import useGeoLocation from "../../hooks/useGeoLocation";

const markerIcon = new L.Icon({
    iconUrl: require("./img/marker.png"),
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });


const MarkersMap = () => {
  const location = useGeoLocation();

  const [center, setCenter] = useState({lat:'53.3475',lng:'-6.2404'});
  const ZOOM_LEVEL = 11;
  //const mapRef = useMap();

  

  const content = (
    <>
      <div className="row">
        <div className="col text-center">
          
          
          <div className="col">
            <MapContainer center={center} zoom={ZOOM_LEVEL} /*ref={mapRef}*/ >
              <TileLayer
                url={osmProviders.maptiler.url}
                attribution={osmProviders.maptiler.attribution}
              />

              {location.loaded && !location.error && (
                <Marker
                  icon={markerIcon}
                  position={[
                    location.coordinates.lat,
                    location.coordinates.lng,
                  ]}
                ></Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col d-flex justify-content-center">
          
        </div>
      </div>
      </>
  ) 
  return content 
}

export default MarkersMap;