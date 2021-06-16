import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { FormControl } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Box } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 150,
    outerHeight: 200,
    justifyContent: "center",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 140,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
}));

const EditForm = ({ pin, togglePopupCard, pins, setPins }) => {
  const classes = useStyles();

  const [details, setDetails] = useState({
    place: pin.place,
    review: pin.review,
    rating: pin.rating,
  });

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.name]: e.value });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      place: details.place,
      review: details.review,
      rating: details.rating,
    };
    try {
      const options = {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      const updatedPin = await axios.patch(
        `${process.env.REACT_APP_BACKEND}/api/pins/${pin._id}`,
        newPin,
        options
      );
      togglePopupCard(true);
      let filteredArray = pins.filter((p) => p._id !== pin._id);
      setPins([...filteredArray, updatedPin.data]);
    } catch (e) {
      alert("Something went wrong!");
      console.log(e);
    }
  };

  return (
    <form className={classes.root} onSubmit={(e) => onFormSubmit(e)}>
      <TextField
        id="outlined-basic"
        label="Place"
        variant="outlined"
        size="small"
        name="place"
        value={details.place}
        onChange={(e) => handleInputChange(e.target)}
      />
      <TextField
        id="outlined-basic"
        label="Review"
        variant="outlined"
        fullWidth
        multiline={true}
        name="review"
        value={details.review}
        onChange={(e) => handleInputChange(e.target)}
      />
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-native-simple">Rating</InputLabel>
        <Select
          native
          size="small"
          label="rating"
          name="rating"
          value={details.rating}
          onChange={(e) => handleInputChange(e.target)}
        >
          <option aria-label="None" value="" />
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </Select>
      </FormControl>
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          cursor="pointer"
          type="submit"
        >
          Save Pin
        </Button>
      </Box>
    </form>
  );
};

export default EditForm;
