import L from "leaflet";
import { Map, MapContainer, Marker, TileLayer } from "react-leaflet";
import osm from "./osm-providers";
import "leaflet/dist/leaflet.css";
import React from "react";
const markerIcon = new L.Icon({
    iconUrl: require("./img/marker.png"),
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

const interactionOptions = {
  zoomControl: false,
  doubleClickZoom: false,
  closePopupOnClick: false,
  dragging: false,
  zoomSnap: false,
  zoomDelta: false,
  trackResize: false,
  touchZoom: false,
  scrollWheelZoom: false,
};

const marker = {lat:'52.975',lng:'-6.04944'}

const StaticMap = ( props ) => {

const {latitude, longitude} = props;
const long = {longitude}
const lati = {latitude}
    return (
        
    <>
      <div className="row">
        <div className="col text-center">
          <h2>lng {long}</h2>
          <h2>lat {lati}</h2>

          <div className="col">
            <MapContainer
              center={marker}
              zoom={12}
              className="static-map"
              {...interactionOptions}
            >
              <TileLayer url={osm.maptiler.url} />
              <Marker 
              icon={markerIcon}
              position= {[marker.lat, marker.lng]}>

              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticMap;
//