import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import PopupCard from "./PopupCard";
import axios from "axios";

require("../app.css");

function Map() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 6,
  });
  const [showPopup, togglePopup] = React.useState(false);
  const [currentPinId, setPinId] = React.useState(null);
  const [pins, setPins] = React.useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const pins = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/pins`
        );
        setPins(pins.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchPins();
  }, []);

  const handleMarkerClick = (id) => {
    console.log(id);
    setPinId(id);
  };

  const displayPins = pins.map((p) => {
    return (
      <>
        <Marker
          latitude={p.latitude}
          longitude={p.langitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <RoomIcon
            onClick={() => handleMarkerClick(p._id)}
            style={{ fontSize: viewport.zoom * 6, color: "blue" }}
          />
        </Marker>
        {currentPinId === p._id ? (
          <Popup
            latitude={p.latitude}
            longitude={p.langitude}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            onClose={() => setPinId(null)}
          >
            <PopupCard pin={p} />
          </Popup>
        ) : null}
      </>
    );
  });

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOXID}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {displayPins}s
    </ReactMapGL>
  );
}

export default Map;
