import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import PopupCard from "./PopupCard";
import axios from "axios";
import PlaceForm from "./PlaceForm";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { Button } from "@material-ui/core";

require("../app.css");

function Map() {
  const storage = window.localStorage;
  const [currentuserName, setCurrentUser] = useState(
    storage.getItem("userName")
  );
  const [toggleRegister, setToggleRegister] = useState(false);
  const [toggleLogin, setToggleLogin] = useState(false);
  const [currentPinId, setPinId] = React.useState(null);
  const [newLocation, setNewLocation] = React.useState(null);
  const [pins, setPins] = React.useState([]);

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 6,
  });

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

  const afterSavingPin = (pin) => {
    setPins([...pins, pin.data]);
    setNewLocation(null);
  };

  const handleMarkerClick = (id, latitude, longitude) => {
    setViewport({ ...viewport, longitude, latitude });
    setPinId(id);
  };

  const handleDblClick = ({ lngLat }) => {
    setNewLocation({
      latitude: lngLat[1],
      longitude: lngLat[0],
    });
  };

  const handleLogout = () => {
    storage.removeItem("userName");
    setCurrentUser(null);
  };

  const displayPins = pins.map((p) => {
    return (
      <>
        <Marker
          latitude={p.latitude}
          longitude={p.longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <RoomIcon
            onClick={(e) => handleMarkerClick(p._id, p.latitude, p.longitude)}
            style={{
              fontSize: viewport.zoom * 6,
              color: "blue",
              cursor: "pointer",
            }}
          />
        </Marker>
        {currentPinId === p._id ? (
          <Popup
            latitude={p.latitude}
            longitude={p.longitude}
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
      width="100vw"
      height="100vh"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOXID}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={(e) => handleDblClick(e)}
      transitionDuration="300ms"
    >
      {!currentuserName ? (
        <>
          <Button
            variant="contained"
            color="primary"
            cursor="pointer"
            onClick={() => setToggleRegister(!toggleRegister)}
          >
            Sign Up
          </Button>
          <Button
            variant="contained"
            color="primary"
            cursor="pointer"
            onClick={() => setToggleLogin(!toggleLogin)}
          >
            Login
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          cursor="pointer"
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      )}
      {displayPins}
      {newLocation ? (
        <Popup
          latitude={newLocation.latitude}
          longitude={newLocation.longitude}
          closeButton={true}
          closeOnClick={false}
          anchor="top"
          onClose={() => setNewLocation(null)}
        >
          <PlaceForm
            userName={currentuserName}
            latitude={newLocation.latitude}
            longitude={newLocation.longitude}
            afterSavingPin={afterSavingPin}
          />
        </Popup>
      ) : null}
      {toggleRegister ? (
        <RegisterForm
          setCurrentUser={setCurrentUser}
          setToggleRegister={setToggleRegister}
          storage={storage}
        />
      ) : null}
      {toggleLogin ? (
        <LoginForm
          setCurrentUser={setCurrentUser}
          setToggleLogin={setToggleLogin}
          storage={storage}
        />
      ) : null}
    </ReactMapGL>
  );
}

export default Map;
