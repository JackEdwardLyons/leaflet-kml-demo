import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import ReactLeafletKml from "react-leaflet-kml";

function LocationMarker() {
  const [position, setPosition] = useState({ lat: -28.142509, lng: 153.438919 });
  // const map = useMapEvents({
  //   click() {
  //     map.locate();
  //   },
  //   locationfound(e) {
  //     setPosition(e.latlng);
  //     map.flyTo(e.latlng, map.getZoom());
  //   },
  // });

  const map = useMapEvents({
    click: (e) => {
      // map.locate();
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      console.log("location clicked:", { e });
    },
    locationfound: (location) => {
      // console.log("location found:", location);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function App() {
  const [kml, setKml] = React.useState(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/JackEdwardLyons/leaflet-kml-demo/main/public/qld-lgas")
      .then((res) => res.text())
      .then((kmlText) => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, "text/xml");
        setKml(kml);
      });
  }, []);

  // const onEachFeature = (feature, layer) => {
  //   console.log({ feature });
  //   layer.on({
  //     mouseover: (e) => {
  //       const layer = e.target;
  //       console.log("I moused over on " + layer.feature.properties.name);
  //     },
  //     mouseout: (e) => {
  //       const layer = e.target;
  //       console.log("I moused out on " + layer.feature.properties.name);
  //     },
  //     click: (e) => {
  //       const layer = e.target;
  //       console.log("I clicked on " + layer.feature.properties.name);
  //     },
  //   });
  // };

  return (
    <div>
      <MapContainer style={{ height: "500px", width: "100%" }} zoom={5} center={[-20.917574, 142.702789]}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {kml && <ReactLeafletKml kml={kml} />}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
