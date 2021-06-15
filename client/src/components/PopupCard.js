import React from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import { Card } from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { format } from "timeago.js";

const PopupCard = ({ pin }) => {
  const showStar = [];
  for (let i = 0; i < pin.rating; ++i)
    showStar.push(<StarRateIcon className="star" />);
  return (
    <Card>
      <CardActionArea>
        <CardContent>
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
          <Typography variant="body2" color="textSecondary" component="p">
            {format(pin.createdAt)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PopupCard;
