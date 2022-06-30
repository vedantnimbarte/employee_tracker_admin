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
} from "@material-ui/core";
import moment from "moment";
import {
  Create as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@material-ui/icons";
import constants from "../../constants";
import { useHistory } from "react-router-dom";

export default function HolidaysComponent({
  users,
  isLoading,
  page_no,
  getHolidayData,
}) {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [holidayId, setHolidayId] = useState();
  const [status, setStatus] = useState();

  const history = useHistory();

  const handleClickOpen = (id) => {
    setOpen(true);
    setHolidayId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSnackbar = () => {
    setSnackbar(false);
  };

  const deleteHoliday = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
    };
    const response = await fetch(
      `${constants.apiUrl}/admin/holiday/${holidayId}`,
      requestOptions,
    );
    const result = await response.json();
    if (result.status === true) {
      setStatus(true);
      setSnackbar(true);
      getHolidayData();
    } else {
      setStatus(false);
      setSnackbar(true);
    }
    setOpen(!open);
  };

  const action = (
    <Fragment>
      <Button color="secondary" size="small" onClick={handleSnackbar}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <>
      <Table className="mb-0">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Sr No</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
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
                <TableCell className="pl-3 fw-normal">{user.name}</TableCell>
                <TableCell className="pl-3 fw-normal">
                  <Checkbox checked={user.isaccept} color="secondary" />
                </TableCell>
                <TableCell className="pl-3 fw-normal">
                  <Checkbox checked={user.ispaid} color="secondary" />
                </TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>
                  {console.log(user.startDate)}
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
                    onClick={() =>
                      history.push({
                        pathname: "/app/update_holiday",
                        state: user,
                      })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    style={{ color: "red" }}
                    onClick={() => handleClickOpen(user._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {/* Delete holiday confirmation window */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete holiday Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this holiday?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteHoliday} color="primary" autoFocus>
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
            ? "Holiday deleted successfully"
            : "Something went wrong. Please try again"
        }
        action={action}
      />
    </>
  );
}
