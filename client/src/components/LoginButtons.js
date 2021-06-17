import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FollowingList from "../components/FollowingList";
import ChangePassword from "../components/ChangePassword";

require("../app.css");

const LoginButtons = ({ storage, setToken }) => {
  const [followingList, toggleFollowingList] = useState(false);
  const [showPassword, togglePassword] = useState(false);
  const handleLogout = () => {
    storage.removeItem("token");
    setToken(null);
  };

  return (
    <>
      <div className="buttons">
        <Button
          variant="contained"
          color="primary"
          cursor="pointer"
          style={{ backgroundColor: "green", color: "black", margin: "2px" }}
          onClick={() => toggleFollowingList(!followingList)}
        >
          Following
        </Button>
        <Button
          variant="contained"
          color="primary"
          cursor="pointer"
          style={{ backgroundColor: "orchid", color: "black", margin: "2px" }}
          onClick={() => togglePassword(!followingList)}
        >
          Change Password
        </Button>
        <Button
          variant="contained"
          color="primary"
          cursor="pointer"
          style={{ backgroundColor: "orange", color: "black", margin: "2px" }}
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </div>
      {followingList ? (
        <FollowingList
          toggleFollowingList={toggleFollowingList}
          setToken={setToken}
        />
      ) : null}
      {showPassword ? <ChangePassword togglePassword={togglePassword} /> : null}
    </>
  );
};

export default LoginButtons;
