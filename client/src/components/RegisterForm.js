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
import validator from "validator";

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
    cursor: "pointer",
  },
}));

export default function RegisterForm({
  setToken,
  setToggleRegister,
  setToggleLogin,
  storage,
}) {
  const classes = useStyles();
  const [userNameError, toggleUserNameError] = useState(false);
  const [userNameErrorText, setUserNameErrorText] = useState("");
  const [emailError, toggleEmailError] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordError, togglePasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [details, setDetails] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    if (e.name === "userName") {
      if (e.value.length < 3) {
        toggleUserNameError(true);
        setUserNameErrorText("Username must be greater than 3 characters");
      } else if (e.value.length > 25) {
        toggleUserNameError(true);
        setUserNameErrorText("Username must be less than 25 characters");
      } else {
        toggleUserNameError(false);
        setUserNameErrorText("");
      }
    } else if (e.name === "email") {
      if (!validator.isEmail(e.value)) {
        toggleEmailError(true);
        setEmailErrorText("Invalid Email");
      } else {
        toggleEmailError(false);
        setEmailErrorText("");
      }
    } else {
      if (e.value.length < 6) {
        togglePasswordError(true);
        setPasswordErrorText("Password must be at least 6 digits long");
      } else {
        togglePasswordError(false);
        setPasswordErrorText("");
      }
    }
    setDetails({ ...details, [e.name]: e.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError || userNameError) {
      alert("Invalid Entries");
      return;
    }
    try {
      const user = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/user/signup`,
        details
      );
      storage.setItem("userName", user.data.userName);
      storage.setItem("token", user.data.token);
      setToken(user.data.token);
      setToggleRegister(false);
    } catch (e) {
      if (e.response.data.message.email) {
        toggleEmailError(true);
        setEmailErrorText("Email already exists!");
      }
      if (e.response.data.message.userName) {
        toggleUserNameError(true);
        setUserNameErrorText("User Name Already Taken!");
      } else alert("Something Went Wrong!");
    }
  };

  const handleOnClick = () => {
    setToggleRegister(false);
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
          Register
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={userNameError}
                name="userName"
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                helperText={userNameErrorText}
                autoFocus
                onChange={(e) => handleInputChange(e.target)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={emailError}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => handleInputChange(e.target)}
                helperText={emailErrorText}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={passwordError}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => handleInputChange(e.target)}
                helperText={passwordErrorText}
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
            Register
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => {
                  setToggleRegister(false);
                  setToggleLogin(true);
                }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
