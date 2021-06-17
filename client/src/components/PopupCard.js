import React, { useState } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import { Card } from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { format } from "timeago.js";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EditForm from "../components/EditForm";
import axios from "axios";

require("../app.css");

const PopupCard = ({ pin, pins, setPins }) => {
  const currentUser = window.localStorage.getItem("userName");
  const [showPopupCard, togglePopupCard] = useState(true);

  const handleDeleteClick = async () => {
    const options = {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    };
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND}/api/pins/${pin._id}`,
        options
      );
      togglePopupCard(true);
      let filteredArray = pins.filter((p) => p._id !== pin._id);
      setPins(filteredArray);
    } catch (e) {}
  };

  const showStar = [];
  for (let i = 0; i < pin.rating; ++i)
    showStar.push(<StarRateIcon key={i} className="star" />);

  return showPopupCard ? (
    <>
      <Card>
        <CardActionArea>
          <CardContent className="popup">
            <Typography
              gutterBottom
              variant="h6"
              component="label"
              className="heading"
            >
              Place
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {pin.place}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              component="label"
              className="heading"
            >
              Review
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {pin.review}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              component="label"
              className="heading"
            >
              Rating
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {showStar}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              component="label"
              className="heading"
            >
              Information
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Created by {pin.userName}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ marginBottom: "20px" }}
            >
              {format(pin.createdAt)}
            </Typography>
            {currentUser === pin.userName ? (
              <>
                <DeleteIcon
                  fontSize="small"
                  className="delete"
                  onClick={() => handleDeleteClick()}
                />
                <EditIcon
                  onClick={() => togglePopupCard(false)}
                  fontSize="small"
                  className="edit"
                />
              </>
            ) : null}
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  ) : (
    <EditForm
      pin={pin}
      togglePopupCard={togglePopupCard}
      pins={pins}
      setPins={setPins}
    />
  );
};

export default PopupCard;
