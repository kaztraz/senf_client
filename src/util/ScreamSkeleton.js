/** @format */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "95%",
    borderRadius: 20,
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0)"
  },

  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 25
  },
  cover: {
    minWidth: 200,
    objectFit: "cover"
  },
  handle: {
    width: 60,
    height: 18,
    backgroundColor: "rgba(0,0,0, 0.0)",
    marginBottom: 7
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(0,0,0, 0.0)",
    marginBottom: 10
  },
  fullLine: {
    height: 15,
    width: "90%",
    backgroundColor: "rgba(0,0,0, 0.0)",
    marginBottom: 10
  },
  halfLine: {
    height: 15,
    width: "50%",
    backgroundColor: "rgba(0,0,0, 0.0)",
    marginBottom: 10
  }
};

const ScreamSkeleton = props => {
  const { classes } = props;

  const content = Array.from({ length: 5 }).map((item, index) => (
    <div className="MainAnimation">
      <Card className={classes.card} key={index}>
        {/* <CardMedia className={classes.cover} image={NoImg} /> */}
        <CardContent className={classes.cardContent}>
          <div className={classes.handle} />
          <div className={classes.date} />
          <div className={classes.fullLine} />
          <div className={classes.fullLine} />
          <div className={classes.halfLine} />
        </CardContent>
      </Card>
    </div>
  ));

  return <Fragment>{content}</Fragment>;
};

ScreamSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScreamSkeleton);
