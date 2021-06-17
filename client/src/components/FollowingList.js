import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Cancel from "@material-ui/icons/Cancel";
import { Alert } from "@material-ui/lab";
import axios from "axios";

require("../app.css");

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "whitesmoke",
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
  close: {
    position: "absolute",
    top: "5px",
    right: "5px",
    cursor: "pointer",
  },
}));

export default function FollowingList({ toggleFollowingList }) {
  const classes = useStyles();
  const [userNameError, toggleUserNameError] = useState(false);
  const [userNameErrorText, setUserNameErrorText] = useState("");
  const [following, setFollowing] = useState("");
  const [success, toggleSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleUnfollowClick = async (e) => {
    e.preventDefault();
    try {
      const options = {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      const userName = window.localStorage.getItem("userName");
      await axios.delete(
        `${process.env.REACT_APP_BACKEND}/api/user/${userName}/${following}`,
        options
      );
      toggleSuccess(true);
      setSuccessMessage(`Unfollowed ${following} !`);
    } catch (e) {
      if (e.response.data.message === "invalid") {
        toggleUserNameError(true);
        setUserNameErrorText("Invalid User Name");
      } else if (e.response.data.message === "notfound") {
        toggleUserNameError(true);
        setUserNameErrorText("Didn't following that user");
      } else alert("Something went wrong!");
    }
  };
  const handleFollowClick = async (e) => {
    e.preventDefault();
    try {
      const options = {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      const userName = window.localStorage.getItem("userName");
      const data = {
        following,
      };
      await axios.patch(
        `${process.env.REACT_APP_BACKEND}/api/user/${userName}`,
        data,
        options
      );
      toggleSuccess(true);
      setSuccessMessage(`Following ${following} successfully!`);
    } catch (e) {
      if (e.response.data.message === "user") {
        toggleUserNameError(true);
        setUserNameErrorText("Invalid User Name");
      } else if (e.response.data.message === "sameuser") {
        toggleUserNameError(true);
        setUserNameErrorText("Can't follow yourself");
      } else if (e.response.data.message === "already") {
        toggleUserNameError(true);
        setUserNameErrorText("User already followed");
      } else alert("Something went Wrong!");
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justify="flex-end">
          <Grid item>
            <Cancel onClick={() => toggleFollowingList(false)} />
          </Grid>
        </Grid>
        {success ? <Alert severity="success">{successMessage}</Alert> : null}
        <Typography component="h1" variant="h5">
          Follow/Unfollow User
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={userNameError}
                autoComplete="uname"
                name="userName"
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                autoFocus
                value={following}
                onChange={(e) => {
                  setFollowing(e.target.value);
                  toggleSuccess(false);
                  toggleUserNameError(false);
                  setUserNameErrorText("");
                }}
                helperText={userNameErrorText}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => handleFollowClick(e)}
          >
            Follow User
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => handleUnfollowClick(e)}
          >
            Unfollow User
          </Button>
        </form>
      </div>
    </Container>
  );
}
