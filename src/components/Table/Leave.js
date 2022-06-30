import { useState, Fragment } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  Snackbar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Box,
} from "@material-ui/core";
import moment from "moment";
import {
  Create as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@material-ui/icons";
import constants from "../../constants";
import { useHistory } from "react-router-dom";

export default function LeaveComponent({
  users,
  isLoading,
  page_no,
  getLeaveData,
}) {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [leaveId, setLeaveId] = useState();
  const [status, setStatus] = useState();
  const [leaveStatus, setLeaveStatus] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  const history = useHistory();

  const handleClickOpen = (id) => {
    setOpen(true);
    setLeaveId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSnackbar = () => {
    setSnackbar(false);
  };

  const updateLeaveStatus = async () => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
      body: JSON.stringify({
        _id: leaveId,
        ispaid: isPaid,
        isaccept: leaveStatus,
      }),
    };
    const response = await fetch(
      `${constants.apiUrl}/admin/leave`,
      requestOptions,
    );
    const result = await response.json();
    if (result.status === true) {
      setStatus(true);
      setSnackbar(true);
      getLeaveData();
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
            <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Accepted</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Paid</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Start Date</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>End Date</TableCell>
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
              <TableRow key={user._id}>
                <TableCell style={{ textAlign: "center" }}>
                  {index + 1 + 10 * page_no}
                </TableCell>
                <TableCell className="pl-3 fw-normal">{user.email}</TableCell>
                <TableCell className="pl-3 fw-normal">
                  <Checkbox checked={user.isaccept} color="secondary" />
                </TableCell>
                <TableCell className="pl-3 fw-normal">
                  <Checkbox checked={user.ispaid} color="secondary" />
                </TableCell>
                <TableCell className="pl-3 fw-normal">{user.type}</TableCell>
                <TableCell>
                  {moment(user.startDate).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>
                  {moment(user.endDate)
                    .add(-330, "minutes")
                    .format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="default"
                    onClick={() => handleClickOpen(user._id)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {/* Update leave confirmation window */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Leave Status Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl fullWidth>
              <InputLabel>Leave Approve/Reject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={leaveStatus}
                label="Leave Approved/Rejected"
                onChange={(e) => setLeaveStatus(e.target.value)}
              >
                <MenuItem value={true}>Approve</MenuItem>
                <MenuItem value={false}>Reject</MenuItem>
              </Select>
            </FormControl>
            <Box style={{ display: "flex", margin: 5, alignItems: "center" }}>
              <InputLabel>Leave Is Paid:</InputLabel>
              <Switch
                checked={isPaid}
                onChange={() => setIsPaid(!isPaid)}
                style={{ margin: 1 }}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateLeaveStatus} color="primary" autoFocus>
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
            ? "Leave updated successfully"
            : "Something went wrong. Please try again"
        }
      />
    </>
  );
}
