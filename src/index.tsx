import { LeafletMouseEvent } from "leaflet";
import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, Tooltip } from "react-leaflet";
import ReactLeafletKml from "react-leaflet-kml";

function LocationMarker({ kmlRef }) {
  const [position, setPosition] = useState({ lat: -28.142509, lng: 153.438919 });

  const isInBounds = (e: LeafletMouseEvent) => {
    const bounds = kmlRef.current.getBounds();
    const location = e.latlng;
    return bounds.contains(location);
  };

  const map = useMapEvents({
    click: (e) => {
      if (kmlRef.current) {
        if (isInBounds(e)) {
          // map.locate(); // users location on load
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
          console.log("location clicked:", { e });
        }
      }
    },

    mousemove: (e) => {
      if (kmlRef.current) {
        if (isInBounds(e)) {
          console.log("in bounds -- ", { location });
        }
      }
    },
    locationfound: (location) => {
      // console.log("location found:", location);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here {JSON.stringify(position)}</Popup>
    </Marker>
  );
}

function App() {
  const [kml, setKml] = React.useState(null);
  const kmlRef = useRef(undefined);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/JackEdwardLyons/leaflet-kml-demo/main/public/qld-lgas")
      .then((res) => res.text())
      .then((kmlText) => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, "text/xml");
        setKml(kml);
      });
  }, []);

  // for testing
  useEffect(() => {
    if (kml) {
      console.log({ kml });
      console.log({ kmlRef });
    }
  }, [kml]);
  // TODO: remove above once done

  return (
    <div>
      <MapContainer style={{ height: "500px", width: "100%" }} zoom={5} center={[-20.917574, 142.702789]}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {kml && <ReactLeafletKml kml={kml} ref={kmlRef} />}
        <LocationMarker kmlRef={kmlRef} />
      </MapContainer>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
