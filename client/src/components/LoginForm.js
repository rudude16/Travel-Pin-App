import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Cancel from "@material-ui/icons/Cancel";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  close: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "lightgray",
    color: "gray",
    cursor: "pointer",
  },
}));

export default function RegisterForm({
  setToken,
  setToggleLogin,
  setToggleRegister,
  storage,
}) {
  const classes = useStyles();
  const [details, setDetails] = useState({
    userName: "",
    password: "",
  });

  const [success, toggleSuccess] = useState(false);
  const [sucessText, setSuccessText] = useState("");

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.name]: e.value });
    toggleSuccess(false);
    setSuccessText("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/user/login`,
        details
      );
      storage.setItem("token", user.data.token);
      storage.setItem("userName", user.data.userName);
      setToken(user.data.token);
      setToggleLogin(false);
    } catch (e) {
      if (e.response.data.message === "password") {
        toggleSuccess(true);
        setSuccessText("Wrong Username or Password");
      } else alert("Something Went wrong!");
    }
  };

  const handleOnClick = () => {
    setToggleLogin(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justify="flex-end">
          <Grid item>
            <Cancel onClick={() => handleOnClick()} />
          </Grid>
        </Grid>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={success}
                autoComplete="uname"
                name="userName"
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                autoFocus
                onChange={(e) => handleInputChange(e.target)}
                helperText={sucessText}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={success}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => handleInputChange(e.target)}
                helperText={sucessText}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => {
                  setToggleLogin(false);
                  setToggleRegister(true);
                }}
              >
                New User? Sign up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
