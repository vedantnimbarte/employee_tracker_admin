import { useState, useEffect, Fragment } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
  Snackbar,
} from "@material-ui/core";
import useStyles from "./styles";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Close as CloseIcon } from "@material-ui/icons";

//constants
import constants from "../../constants";

export default function UpdateHolidayComponent() {
  const classes = useStyles();
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAccept, setIsAccept] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("FULL");
  const [isLoading, setLoading] = useState(true);
  const [id, setId] = useState();
  const [snackbar, setSnackbar] = useState(false);
  const [status, setStatus] = useState();

  useEffect(() => {
    console.log(history.location.state);
    if (history.location.state === undefined) {
      history.goBack();
    } else {
      setName(history.location.state.name);
      setStartDate(history.location.state.startDate);
      setEndDate(history.location.state.endDate);
      setIsAccept(history.location.state.isaccept);
      setIsPaid(history.location.state.ispaid);
      setType(history.location.state.type);
      setDescription(history.location.state.description);
      setId(history.location.state._id);
    }
    setLoading(false);
  }, []);

  const handleHolidayDetails = () => {
    const body = {};
    const error = {};

    name.length > 0
      ? Object.assign(body, { name })
      : Object.assign(error, { name: "Please enter the name of holiday." });
    startDate.length > 0
      ? Object.assign(body, { startDate })
      : Object.assign(error, { startDate: "Please select the start date" });
    endDate.length > 0
      ? Object.assign(body, { endDate })
      : Object.assign(error, { endDate: "Please select the end date" });
    console.log(typeof description);
    description !== undefined && Object.assign(body, { description });
    type.length > 0 && Object.assign(body, { type });

    Object.assign(body, { ispaid: isPaid });
    Object.assign(body, { isaccept: isAccept });
    Object.assign(body, { _id: id });

    setErrors(error);
    return { body, error };
  };

  const handleSnackbar = () => {
    setSnackbar(false);
  };

  const updateHoliday = async () => {
    const { body, error } = handleHolidayDetails();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
      body: JSON.stringify(body),
    };
    if (Object.keys(error).length === 0) {
      const response = await fetch(
        `${constants.apiUrl}/admin/holiday`,
        requestOptions,
      );
      const result = await response.json();
      if (result.status === true) {
        setStatus(true);
        setSnackbar(true);
      } else {
        setStatus(false);
        setSnackbar(true);
      }
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {isLoading ? (
        <CircularProgress size="small" />
      ) : (
        <Fragment>
          <Grid
            xs={12}
            style={{
              padding: 10,
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Grid xs={5}>
              {errors.name && (
                <Typography
                  className={classes.errorMsg}
                  style={{ marginLeft: 10 }}
                >
                  {errors.name}
                </Typography>
              )}
              <TextField
                type="text"
                id="outlined-basic"
                variant="outlined"
                label="Name"
                size="small"
                style={{ width: "100%", margin: 10 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.startDate && (
                <Typography
                  className={classes.errorMsg}
                  style={{ marginLeft: 10 }}
                >
                  {errors.startDate}
                </Typography>
              )}
              <InputLabel style={{ marginLeft: 10 }}>Start Date</InputLabel>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={moment(startDate).format("YYYY-MM-DD")}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: "100%", margin: 10 }}
                required
              />
              {errors.endDate && (
                <Typography
                  className={classes.errorMsg}
                  style={{ marginLeft: 10 }}
                >
                  {errors.endDate}
                </Typography>
              )}
              <InputLabel style={{ marginLeft: 10 }}>End Date</InputLabel>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={moment(endDate).format("YYYY-MM-DD")}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: "100%", margin: 10 }}
                required
              />
            </Grid>
            <Grid xs={5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAccept}
                    onChange={() => setIsAccept(!isAccept)}
                    style={{ margin: 1 }}
                  />
                }
                label=" Is Accepted"
              ></FormControlLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPaid}
                    onChange={() => setIsPaid(!isPaid)}
                    style={{ margin: 1 }}
                  />
                }
                label=" Is Paid"
              ></FormControlLabel>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                style={{ margin: 10 }}
              >
                <InputLabel id="demo-simple-select-label">
                  Type of Holiday
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="gender"
                  label="Type of holiday"
                  variant="outlined"
                  size="small"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="FULL">Full</MenuItem>
                  <MenuItem value="HALF">Half</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="text"
                id="description"
                variant="outlined"
                label="Description"
                size="small"
                multiline
                rows={4}
                maxRows={4}
                style={{ width: "100%", margin: 10 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
          <FormControl
            style={{
              margin: 10,
              width: "40%",
            }}
          >
            <Button variant="outlined" color="primary" onClick={updateHoliday}>
              {isLoading && <CircularProgress size="small" />}
              Update Holiday
            </Button>
          </FormControl>
        </Fragment>
      )}

      {/* Snackbar for showing status of delete operation */}
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={handleSnackbar}
        message={
          status
            ? "Holiday updated successfully"
            : "Something went wrong. Please try again"
        }
      />
    </Box>
  );
}
