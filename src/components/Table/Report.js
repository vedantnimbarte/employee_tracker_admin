import { useState } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  Snackbar,
  Tooltip,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  Create as EditIcon,
  Delete as DeleteIcon,
  FreeBreakfast as BreakIcon,
  Work as WorkIcon,
  ToggleOn as ActiveIcon,
} from "@material-ui/icons";
import useStyles from "./styles";
import moment from "moment";
import constants from "../../constants";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";

export default function ReportComponent({
  users,
  isLoading,
  page_no,
  getReportData,
}) {
  const classes = useStyles();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [reportId, setReportId] = useState();
  const [snackbar, setSnackbar] = useState(false);
  const [status, setStatus] = useState();
  const [note, setNote] = useState({});
  const [time, setTime] = useState();

  const [activeUserDialog, setActiveUserDialog] = useState(false);
  const [activeStatus, setActiveStatus] = useState(false);

  const [breakUserDialog, setBreakUserDialog] = useState(false);
  const [breakStatus, setBreakStatus] = useState(false);

  const [workUserDialog, setWorkUserDialog] = useState(false);
  const [workStatus, setWorkStatus] = useState(false);

  // const handleActiveUserTime()

  const handleClickOpen = (id) => {
    setOpen(true);
    setReportId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbar = () => {
    setSnackbar(false);
  };

  const handleActiveUserDialog = (activeStatus) => {
    setActiveUserDialog(!activeUserDialog);
    setActiveStatus(activeStatus);
  };

  const handleBreakDialog = (breakStatus) => {
    setBreakUserDialog(!breakUserDialog);
    setBreakStatus(breakStatus);
  };

  const handleWorkDialog = (workStatus) => {
    setWorkUserDialog(!workUserDialog);
    setWorkStatus(workStatus);
  };

  const deleteReport = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
    };
    const response = await fetch(
      `${constants.apiUrl}/admin/dashboard/${reportId}`,
      requestOptions,
    );
    const result = await response.json();
    if (result.status === true) {
      setStatus(true);
      setSnackbar(true);
      getReportData();
    } else {
      setStatus(false);
      setSnackbar(true);
    }
    setOpen(!open);
  };

  return (
    <>
      <Table className="mb-0">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Sr No</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Entry</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Break Time</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Work Time</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Active</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Break</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Notes</TableCell>

            <TableCell style={{ fontWeight: "bold" }}>Exit Time</TableCell>

            <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={10} style={{ textAlign: "center" }}>
              <CircularProgress size={26} />
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} style={{ textAlign: "center" }}>
              No Data Available
            </TableCell>
          </TableRow>
        ) : (
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user._id}
                className={
                  (user.ipAddress?.length > 1 && classes.ipError) ||
                  (moment(user.lastUpdateDate).diff(
                    moment(user.firstworkentryDateTime),
                    "second",
                  ) -
                    (user.workdifferenceInSeconds +
                      user.breakdifferenceInSeconds) >
                    60 &&
                    classes.error) ||
                  (user.breakdifferenceInSeconds > 3600 && classes.warning) ||
                  (moment(new Date(user.lastUpdateDate)).diff(
                    new Date(user.exitDateTime),
                  ) !== 0 &&
                    classes.error &&
                    user.isActive !== false) ||
                  (parseInt(
                    moment(new Date())
                      .startOf("date")
                      .diff(
                        moment(new Date(user.firstworkentryDateTime)).startOf(
                          "date",
                        ),
                        "days",
                      ),
                  ) === 0 &&
                    !user.isBreak &&
                    !user.isActive &&
                    classes.success)
                }
              >
                <TableCell style={{ textAlign: "center" }}>
                  {index + 1 + 10 * page_no}
                </TableCell>
                <TableCell style={{ width: "10%" }}>
                  {moment(user.firstworkentryDateTime).format(
                    "DD-MM-YYYY hh:mm a",
                  )}
                </TableCell>
                <TableCell className="pl-3 fw-normal">{user.email}</TableCell>
                <TableCell>
                  {moment
                    .duration(user.breakdifferenceInSeconds, "seconds")
                    .format("hh:mm:ss", {
                      trim: false,
                    })}
                </TableCell>
                <TableCell>
                  {moment
                    .duration(user.workdifferenceInSeconds, "seconds")
                    .format("hh:mm:ss", {
                      trim: false,
                    })}
                </TableCell>
                {parseInt(
                  moment(new Date())
                    .startOf("date")
                    .diff(
                      moment(new Date(user.firstworkentryDateTime)).startOf(
                        "date",
                      ),
                      "days",
                    ),
                ) === 0 ? (
                  <TableCell>
                    <Checkbox checked={user.isActive} color="secondary" />
                  </TableCell>
                ) : (
                  <TableCell></TableCell>
                )}

                <TableCell>
                  <Checkbox checked={user.isBreak} color="secondary" />
                </TableCell>

                <TableCell
                  style={{ width: "15%" }}
                  onMouseOver={() =>
                    setNote({ value: user.notes, id: user._id })
                  }
                  onMouseOut={() => setNote({})}
                >
                  {note.value && note.id === user._id
                    ? note.value
                    : user.notes && user.notes.length > 20
                    ? user.notes.substring(0, 20) + "..."
                    : user.notes}
                  {/* {user.notes} */}
                </TableCell>
                <TableCell style={{ width: "10%" }}>
                  {moment(user.exitDateTime).format("DD-MM-YYYY hh:mm a")}
                </TableCell>
                <TableCell>
                  {/* <Tooltip title="Active">
                    <IconButton
                      size="small"
                      style={{ margin: 0, color: "green" }}
                      onClick={() => handleActiveUserDialog(user.isActive)}
                    >
                      <ActiveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Break">
                    <IconButton
                      size="small"
                      style={{ margin: 0, color: "brown" }}
                      onClick={() => handleBreakDialog(user.isBreak)}
                    >
                      <BreakIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Work">
                    <IconButton
                      size="small"
                      style={{ margin: 0, color: "orange" }}
                      onClick={() => handleWorkDialog(user.isWork)}
                    >
                      <WorkIcon />
                    </IconButton>
                  </Tooltip> */}
                  {/* {parseInt(
                    moment(new Date())
                      .startOf("date")
                      .diff(
                        moment(new Date(user.firstworkentryDateTime)).startOf(
                          "date",
                        ),
                        "days",
                      ),
                  ) === 0 && (
                    <Tooltip title="Edit">
                      <IconButton
                        color="default"
                        onClick={() =>
                          history.push({
                            pathname: "/app/update_report",
                            state: user,
                          })
                        }
                        size="small"
                        style={{ margin: 0 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )} */}

                  <Tooltip title="Delete">
                    <IconButton
                      style={{ color: "red", margin: 0 }}
                      size="small"
                      onClick={() => handleClickOpen(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {/* Delete report confirmation window */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Report Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this report?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteReport} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Active User  window */}
      <Dialog
        open={activeUserDialog}
        onClose={() => setActiveUserDialog(!activeUserDialog)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Active User</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              border: "1px solid lightgray",
              borderRadius: 5,
            }}
          >
            <Box>
              <Typography>
                Date: {moment(new Date()).format("DD-MM-YYYY")}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.checked)}
                  style={{ margin: 1 }}
                />
              }
              label={activeStatus ? "Active" : "Inactive"}
              style={{ margin: 10 }}
            ></FormControlLabel>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              style={{ margin: 10 }}
            >
              <TimePicker
                autoOk
                label="Select Time"
                value={time}
                onChange={setTime}
                style={{ marginLeft: 10 }}
                inputVariant="outlined"
              />
            </MuiPickersUtilsProvider>

            {!activeStatus && (
              <TextField
                label="Enter today's work"
                size="small"
                multiline
                rows={5}
                variant="outlined"
                style={{ margin: 10 }}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleActiveUserDialog(null)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleActiveUserDialog(null)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Break User  window */}
      <Dialog
        open={breakUserDialog}
        onClose={() => setBreakUserDialog(!breakUserDialog)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Break</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              borderRadius: 5,
              border: "1px solid lightgray",
            }}
          >
            <Box>
              <Typography>
                Date: {moment(new Date()).format("DD-MM-YYYY")}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={breakStatus}
                  onChange={(e) => setBreakStatus(e.target.checked)}
                  style={{ margin: 1 }}
                />
              }
              label={breakStatus ? "Active" : "Inactive"}
              style={{ margin: 10 }}
            ></FormControlLabel>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              style={{ margin: 10 }}
            >
              <TimePicker
                autoOk
                label="Select Time"
                value={time}
                onChange={setTime}
                style={{ marginLeft: 10 }}
                inputVariant="outlined"
              />
            </MuiPickersUtilsProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBreakUserDialog(!breakUserDialog)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setBreakUserDialog(!breakUserDialog)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Work User  window */}
      <Dialog
        open={workUserDialog}
        onClose={() => setWorkUserDialog(!workUserDialog)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Work</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              borderRadius: 5,
              border: "1px solid lightgray",
            }}
          >
            <Box>
              <Typography>
                Date: {moment(new Date()).format("DD-MM-YYYY")}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={workStatus}
                  onChange={(e) => setWorkStatus(e.target.checked)}
                  style={{ margin: 1 }}
                />
              }
              label={workStatus ? "Active" : "Inactive"}
              style={{ margin: 10 }}
            ></FormControlLabel>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              style={{ margin: 10 }}
            >
              <TimePicker
                autoOk
                label="Select Time"
                value={time}
                onChange={setTime}
                inputVariant="outlined"
                style={{ marginLeft: 10 }}
              />
            </MuiPickersUtilsProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setWorkUserDialog(!workUserDialog)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setWorkUserDialog(!workUserDialog)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for showing status of delete operation */}
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={handleSnackbar}
        message={
          status
            ? "Report deleted successfully"
            : "Something went wrong. Please try again"
        }
      />
    </>
  );
}
