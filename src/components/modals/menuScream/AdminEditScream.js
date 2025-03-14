/** @format */

import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

// MUI Stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

// REDUX Stuff
import { connect } from "react-redux";

import {
  createMuiTheme,
  MuiThemeProvider,
  NativeSelect,
  TextField,
} from "@material-ui/core";

import {
  adminEditScream,
  getUserData,
} from "../../../redux/actions/dataActions";

import L from "leaflet";


import _ from "lodash";

import Arrow from "../../../images/icons/arrow.png";

import Geocoder from "react-mapbox-gl-geocoder";

import Geocode from "react-geocode";
import Weblink from "../postModals/Weblink";
import Contact from "../postModals/Contact";
import InlineDatePicker from "../postModals/InlineDatePicker";
import ToggleDisplay from "react-toggle-display";

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&&&&:before": {
          borderBottom: "1px solid rgba(0, 0, 0, 0)",
        },
        "&&&&:after": {
          borderBottom: "1px solid rgba(255, 255, 255, 0)",
        },
      },
    },
    MuiNativeSelect: {
      icon: {
        opacity: 0,
      },
    },
  },
});

const styles = {
  paper: {
    borderRadius: "20px",

    // width: "95%",
    margin: "2.5%",
    maxWidth: "400px",
    width: "400px !important",
  },

  button: {
    fontSize: 20,
    textAlign: "center",
    textTransform: "none",
    width: "100%",
    height: "70px",
  },

  confirmButton: {
    fontSize: 20,
    textAlign: "center",
    textTransform: "none",
    width: "100%",
    height: "70%",
    clear: "both",
    color: "#353535",
  },
};

class AdminEditScream extends Component {
  state = {
    open: false,
    tab: 2,
    errors: {},

    openWeblink: false,
    weblinkTitle: null,
    weblink: null,

    openContact: false,
    contactTitle: null,
    contact: null,

    openCalendar: false,
    selectedDays: [],
    selectedUnix: [],

    notes: null,
  };
  handleOpen = () => {
    this.props.getUserData(this.props.scream.userHandle);

    this.setState({
      open: true,
      title: this.props.scream.title,
      body: this.props.scream.body,
      project: this.props.scream.project,
      topic: this.props.scream.Thema,
      locationHeader: this.props.scream.locationHeader,
      district: this.props.scream.district,
      lat: this.props.scream.lat,
      long: this.props.scream.long,
      viewport: {
        latitude: this.props.scream.lat,
        longitude: this.props.scream.long,
      },
      status: this.props.scream.status,
      notes: this.props.scream.notes,
    });

    if (this.props.scream.project === undefined) {
      this.setState({
        project: "",
      });
    }

    if (this.props.scream.weblink) {
      this.setState({
        weblink: this.props.scream.weblink,
        weblinkTitle: this.props.scream.weblinkTitle,
      });
    }
    if (this.props.scream.contact) {
      this.setState({
        contact: this.props.scream.contact,
        contactTitle: this.props.scream.contactTitle,
      });
    }

    if (this.props.scream.selectedUnix) {
      const selectedDays = [];
      const selectedUnix = this.props.scream.selectedUnix;
      var i;
      for (i = 0; i < selectedUnix.length; i++) {
        selectedDays[i] = new Date(selectedUnix[i] * 1000);
      }

      this.setState({
        selectedDays: selectedDays,
        selectedUnix: this.props.scream.selectedUnix,
      });
    }

    console.log(this.props);
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value, loading: false });

    console.log(this.state.selectedUnix);
  };

  handleChangeCalendar = (selectedDays) => {
    const selectedUnix = [];
    var i;
    for (i = 0; i < selectedDays.length; i++) {
      selectedUnix[i] = selectedDays[i]["unix"];
    }

    this.setState({ selectedDays: selectedDays, selectedUnix: selectedUnix });
  };

  handleDropdown = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleOpenWeblink = () => {
    this.setState({
      openWeblink: true,
    });
  };
  handleCloseWeblink = () => {
    this.setState({
      openWeblink: false,
      weblink: null,
      weblinkTitle: null,
    });
  };
  handleSaveWeblink = () => {
    this.setState({
      openWeblink: false,
    });
  };

  handleOpenContact = () => {
    this.setState({
      openContact: true,
    });
  };
  handleCloseContact = () => {
    this.setState({
      openContact: false,
      contact: null,
      contactTitle: null,
    });
  };
  handleSaveContact = () => {
    this.setState({
      openContact: false,
    });
  };

  handleOpenCalendar = () => {
    this.setState({
      openCalendar: true,
    });
    console.log(this.state.selectedDays);
  };
  handleCloseCalendar = () => {
    this.setState({
      openCalendar: false,
      // weblink: "",
      // weblinkTitle: "",
    });
  };
  handleSaveCalendar = () => {
    this.setState({
      openCalendar: false,
    });
  };

  onSelected = (viewport, item) => {
    this.setState({ viewport });
    setTimeout(() => {
      this._onMarkerDragEnd();
    }, 10);
  };

  _onMarkerDragEnd = (event) => {
    this.setState({
      longitude: this.state.viewport.longitude,
      latitude: this.state.viewport.latitude,
      long: this.state.viewport.longitude,
      lat: this.state.viewport.latitude,
    });
    
      const geocoder = L.Control.Geocoder.nominatim();
  
      geocoder.reverse(
        { lat: this.state.viewport.latitude, lng: this.state.viewport.longitude },
        12,
        (results) => {
          var r = results[0];
          var split = r.html.split("<br/>");
          var address = split[0];
          this.setState({ locationHeader: address, address: address, district: r.name });
         
        }
      );
  
      if (
        this.state.viewport.latitude > 51.08 ||
        this.state.viewport.latitude < 50.79 ||
        this.state.viewport.longitude < 6.712 ||
        this.state.viewport.longitude > 7.17
      ) {
        alert("Außerhalb von Köln kannst du leider noch keine Ideen teilen.");
        this.setState({
          Out: true,
        });
      } else {
        this.setState({
          Out: false,
        });
      }
  
    
        
    


   
  };

  editScream = () => {
    console.log(this.state);

    const editScream = {
      screamId: this.props.scream.screamId,
      title: this.state.title,
      body: this.state.body,

      project: this.state.project,
      Thema: this.state.topic,
      locationHeader: this.state.locationHeader,
      district: this.state.district,
      lat: this.state.lat,
      long: this.state.long,

      weblinkTitle: this.state.weblinkTitle,
      weblink: this.state.weblink,

      contactTitle: this.state.contactTitle,
      contact: this.state.contact,

      status: this.state.status,
      notes: this.state.notes,
    };

    console.log(this.state.selectedUnix);
    if (this.state.selectedUnix[0] === undefined) {
      editScream.selectedUnix = null;
    } else {
      editScream.selectedUnix = this.state.selectedUnix;
    }

    this.props.adminEditScream(editScream, this.props.history);
    // this.setState({ open: false });
    // window.location.reload(false);
  };

  handleClick = (tab) => {
    this.setState({
      tab,
    });
  };

  render() {
    const { projects, loadingProjects } = this.props.data;

    const { classes } = this.props;
    const { viewport, weblink, weblinkTitle, errors } = this.state;

    const queryParams = {
      bbox: [6.7, 50.8, 7.2, 51],
    };

    const projectsArray =
      this.state.open && !loadingProjects ? (
        <>
          {_.orderBy(projects, "createdAt", "desc").map((projects) => (
            <option value={projects.project} className={classes.formText}>
              + {projects.title}
            </option>
          ))}
        </>
      ) : null;

    const topicsArray = (
      <>
        <option value={"Inklusion / Soziales"} className={classes.formText}>
          Inklusion / Soziales
        </option>
        <option value={"Rad"} className={classes.formText}>
          Rad
        </option>
        <option value={"Sport / Freizeit"} className={classes.formText}>
          Sport / Freizeit
        </option>
        <option value={"Umwelt und Grün"} className={classes.formText}>
          Umwelt und Grün
        </option>
        <option value={"Verkehr"} className={classes.formText}>
          Verkehr
        </option>
        <option value={"Versorgung"} className={classes.formText}>
          Versorgung
        </option>
        <option value={"Sonstige"} className={classes.formText}>
          Sonstige
        </option>
      </>
    );

    const statusArray = (
      <>
        <option value={"None"} className={classes.formText}>
          Offen
        </option>
        <option value={"Eingereicht"} className={classes.formText}>
          Eingereicht
        </option>
        <option value={"Bereits umgesetzt"} className={classes.formText}>
          Bereits umgesetzt
        </option>
      </>
    );

    const MyInput = (props) => (
      <input
        {...props}
        placeholder={this.props.scream.locationHeader}
        id="geocoder"
      />
    );

    return (
      <Fragment>
        <Button className={classes.confirmButton} onClick={this.handleOpen}>
          Idee bearbeiten (Admin)
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          width="md"
          BackdropProps={{ classes: { root: classes.root } }}
          PaperProps={{ classes: { root: classes.paper } }}
        >
          <div
            style={{
              width: "100%",
              height: "110px",
              backgroundColor: "#f8f8f8",
            }}
          >
            <h3 className="modal_title">Idee bearbeiten (Admin)</h3>

            <div className="Tabs Dialog_Tabs">
              <div className="Tab">
                <div
                  className={
                    this.state.tab === 1 ? "Tab_active" : "Tab_not_active"
                  }
                  onClick={() => this.handleClick(1)}
                >
                  Details
                </div>
                <div className="Tab_Line" style={{ color: "white" }}>
                  |
                </div>{" "}
                <div
                  className={
                    this.state.tab === 2 ? "Tab_active" : "Tab_not_active"
                  }
                  onClick={() => this.handleClick(2)}
                >
                  Monitoring
                </div>
              </div>
            </div>
          </div>

          <div className="textFields">
            <ToggleDisplay show={this.state.tab === 1}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",

                  fontFamily: "Futura PT W01-Bold",
                }}
              >
                <span> Projektraum: </span>
                <MuiThemeProvider theme={theme}>
                  <NativeSelect
                    value={this.state.project}
                    onChange={this.handleDropdown}
                    name="project"
                    className="projectFormControl"
                    inputProps={{ "aria-label": "project" }}
                    id="project"
                    IconComponent={() => (
                      <img
                        src={Arrow}
                        width="20px"
                        style={{
                          marginTop: "0px",
                          marginLeft: "-24px",
                          pointerEvents: "none",
                        }}
                      ></img>
                    )}
                  >
                    <option value="" className={classes.formText}>
                      Allgemein (Alle Ideen)
                    </option>
                    {projectsArray}
                  </NativeSelect>
                </MuiThemeProvider>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "Futura PT W01-Bold",
                }}
              >
                <span> Thema:</span>

                <MuiThemeProvider theme={theme}>
                  <NativeSelect
                    value={this.state.topic}
                    onChange={this.handleDropdown}
                    name="topic"
                    className="projectFormControl"
                    inputProps={{ "aria-label": "topic" }}
                    id="topic"
                    IconComponent={() => (
                      <img
                        src={Arrow}
                        width="20px"
                        style={{
                          marginTop: "0px",
                          marginLeft: "-24px",
                          pointerEvents: "none",
                        }}
                      ></img>
                    )}
                  >
                    <option value="" className={classes.formText}>
                      Wähle ein Thema aus
                    </option>
                    {topicsArray}
                  </NativeSelect>
                </MuiThemeProvider>
              </div>{" "}
              <Geocoder
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                onSelected={this.onSelected}
                {...viewport}
                hideOnSelect={true}
                limit={3}
                queryParams={queryParams}
                id="geocoder-edit"
                className="geocoder-edit"
                inputComponent={MyInput}
                updateInputOnSelect
              ></Geocoder>
              <TextField
                id="title"
                name="title"
                type="text"
                label="Titel"
                margin="normal"
                color="transparent"
                variant="outlined"
                className="textField"
                multiline
                rowsMax="2"
                error={errors.title ? true : false}
                helperText={errors.title}
                value={this.state.title}
                onChange={this.handleChange}
                style={{ marginTop: "5px", marginBottom: "5px" }}
              ></TextField>
              <TextField
                id="body"
                name="body"
                type="text"
                label="Beschreibung"
                margin="normal"
                color="transparent"
                variant="outlined"
                className="textField"
                multiline
                rowsMax="12"
                error={errors.body ? true : false}
                helperText={errors.body}
                value={this.state.body}
                onChange={this.handleChange}
                style={{ marginTop: "5px", marginBottom: "5px" }}
              ></TextField>
              <div
                style={{
                  bottom: " -70px",
                  height: "50px",
                }}
              >
                <Weblink
                  openWeblink={this.state.openWeblink}
                  handleOpenWeblink={this.handleOpenWeblink}
                  handleCloseWeblink={this.handleCloseWeblink}
                  handleSaveWeblink={this.handleSaveWeblink}
                  weblinkTitle={this.state.weblinkTitle}
                  weblink={this.state.weblink}
                  handleChange={this.handleChange}
                ></Weblink>
                <Contact
                  openContact={this.state.openContact}
                  handleOpenContact={this.handleOpenContact}
                  handleCloseContact={this.handleCloseContact}
                  handleSaveContact={this.handleSaveContact}
                  contactTitle={this.state.contactTitle}
                  contact={this.state.contact}
                  handleChange={this.handleChange}
                ></Contact>
                <div
                  style={
                    this.state.project === "Agora:_Sommer_des_guten_lebens"
                      ? {}
                      : { display: "none" }
                  }
                >
                  <InlineDatePicker
                    openCalendar={this.state.openCalendar}
                    handleOpenCalendar={this.handleOpenCalendar}
                    handleCloseCalendar={this.handleCloseCalendar}
                    handleSaveCalendar={this.handleSaveCalendar}
                    handleChange={this.handleChangeCalendar}
                    selectedDays={this.state.selectedDays}
                  ></InlineDatePicker>
                </div>
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.tab === 2}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",

                  fontFamily: "Futura PT W01-Bold",
                  marginTop: "20px",
                }}
              >
                Email:
                <a
                  href={"mailto:" + this.props.data.scream_user.email}
                  style={{
                    fontFamily: "Futura PT W01 Book",
                    textDecoration: "underline",
                  }}
                >
                  {this.props.data.scream_user.email}
                </a>
              </div>{" "}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "Futura PT W01-Bold",
                }}
              >
                <span> Status:</span>

                <MuiThemeProvider theme={theme}>
                  <NativeSelect
                    value={this.state.status}
                    onChange={this.handleDropdown}
                    name="status"
                    className="projectFormControl"
                    inputProps={{ "aria-label": "status" }}
                    id="status"
                    IconComponent={() => (
                      <img
                        src={Arrow}
                        width="20px"
                        style={{
                          marginTop: "0px",
                          marginLeft: "-24px",
                          pointerEvents: "none",
                        }}
                      ></img>
                    )}
                  >
                    {statusArray}
                  </NativeSelect>
                </MuiThemeProvider>
              </div>{" "}
              <TextField
                id="notes"
                name="notes"
                type="text"
                label="Notizen"
                placeholder="Füge Notizen hinzu..."
                margin="normal"
                color="transparent"
                variant="outlined"
                className="textField"
                multiline
                rowsMax="12"
                error={errors.body ? true : false}
                helperText={errors.body}
                value={this.state.notes}
                onChange={this.handleChange}
                style={{ marginTop: "5px", marginBottom: "5px" }}
              ></TextField>
            </ToggleDisplay>
          </div>

          <div className="buttons">
            <Button className={classes.button} onClick={this.handleClose}>
              Abbrechen
            </Button>
            <Button
              className={classes.button}
              onClick={this.editScream}
              style={
                (this.state.weblink !== null || this.state.weblink !== " ") &&
                (this.state.weblinkTitle !== null ||
                  this.state.weblinkTitle !== " ")
                  ? {}
                  : { pointerEvents: "none", opacity: 0.6 }
              }
            >
              Speichern
            </Button>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

AdminEditScream.propTypes = {
  classes: PropTypes.object.isRequired,
  adminEditScream: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  scream: state.data.scream,
  scream_user: state.data.scream_user,
});

const mapActionsToProps = { adminEditScream, getUserData };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(AdminEditScream));
