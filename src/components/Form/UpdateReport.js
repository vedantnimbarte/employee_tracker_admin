import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
  Snackbar,
} from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";
import constants from "../../constants";

export default function UpdateReportComponent() {
  const history = useHistory();

  const [userBreak, setBreak] = useState();
  const [userActive, SetUserActive] = useState();
  const [email, setEmail] = useState();
  const [timeCount, setTimeCount] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState();
  const [snackbar, setSnackbar] = useState();
  const [reportId, setReportId] = useState();

  useEffect(() => {
    if (history.location.state !== undefined) {
      const { _id, isBreak, isActive } = history.location.state;
      SetUserActive(isActive);
      setBreak(isBreak);
      setEmail(email);
      setReportId(_id);
      setLoading(false);
    } else {
      history.goBack();
    }
  }, []);

  const handleSnackbar = () => {
    setSnackbar(false);
  };

  const handleBody = () => {
    const body = {};
    Object.assign(body, { isTimeCount: timeCount });
    Object.assign(body, { isBreak: userBreak });
    Object.assign(body, { isActive: userActive });
    Object.assign(body, { uniqueId: reportId });
    return body;
  };

  const updateReport = async () => {
    const body = handleBody();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(
      `${constants.apiUrl}/admin/dashboard`,
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
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography style={{ margin: 20 }}>User: {email}</Typography>
          <Grid
            style={{
              padding: 10,
              display: "flex",
              justifyContent: "space-between",
              marginLeft: 20,
            }}
          >
            <Grid xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userActive}
                    onChange={() => SetUserActive(!userActive)}
                    name="Work"
                    style={{ margin: 1 }}
                  />
                }
                label="On Duty"
              />
            </Grid>
            <Grid xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userBreak}
                    onChange={() => setBreak(!userBreak)}
                    name="Break"
                    style={{ margin: 1 }}
                  />
                }
                label="Break"
              />
            </Grid>
            <Grid xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={timeCount}
                    onChange={() => setTimeCount(!timeCount)}
                    name="Time Count"
                    style={{ margin: 1 }}
                  />
                }
                label="Time Count"
              />
            </Grid>
          </Grid>
        </Box>
      )}
      <Button
        style={{ margin: 20, width: "30%", alignSelf: "center" }}
        color="secondary"
        variant="outlined"
        onClick={updateReport}
      >
        Update
      </Button>

      {/* Snackbar for showing status of update operation */}
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={handleSnackbar}
        message={
          status
            ? "Report updated successfully"
            : "Something went wrong. Please try again"
        }
      />
    </Box>
  );
}
