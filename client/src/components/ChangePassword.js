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

export default function ChangePassword({ togglePassword }) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [currentPassword, setcurrentPassword] = useState("");
  const [success, toggleSuccess] = useState(false);
  const [currentError, toggleCurrentError] = useState(false);
  const [currentErrorText, setCurrentErrorText] = useState("");
  const [newError, toggleNewError] = useState(false);
  const [newErrorText, setNewErrorText] = useState("");

  const handleInputChange = (e) => {
    if (e.name === "newpassword") {
      setPassword(e.value);
      if (e.value.length < 6) {
        toggleNewError(true);
        setNewErrorText("Password must be at least 6 digits long");
      } else {
        toggleNewError(false);
        setNewErrorText("");
      }
    } else {
      setcurrentPassword(e.value);
      toggleCurrentError(false);
      setCurrentErrorText("");
    }
    toggleSuccess(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const options = {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      const userName = window.localStorage.getItem("userName");
      const data = {
        currentPassword,
        password,
      };
      await axios.patch(
        `${process.env.REACT_APP_BACKEND}/api/user/${userName}`,
        data,
        options
      );
      toggleSuccess(true);
    } catch (e) {
      if (e.response.data.message === "password") {
        toggleCurrentError(true);
        setCurrentErrorText("Wrong Password");
      } else alert("Something is Wrong!");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justify="flex-end">
          <Grid item>
            <Cancel onClick={() => togglePassword(false)} />
          </Grid>
        </Grid>
        {success ? (
          <Alert severity="success">Password Changed successfully</Alert>
        ) : null}
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={currentError}
                autoComplete=""
                name="currentpassword"
                variant="outlined"
                required
                fullWidth
                label="Current Password"
                autoFocus
                value={currentPassword}
                onChange={(e) => handleInputChange(e.target)}
                helperText={currentErrorText}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={newError}
                autoComplete=""
                name="newpassword"
                variant="outlined"
                required
                fullWidth
                label="New Password"
                autoFocus
                value={password}
                onChange={(e) => handleInputChange(e.target)}
                helperText={newErrorText}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => handleChangePassword(e)}
          >
            Change Password
          </Button>
        </form>
      </div>
    </Container>
  );
}
