import { useState } from "react";
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
  Box,
  Typography,
} from "@material-ui/core";
import {
  Create as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewMoreIcon,
} from "@material-ui/icons";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { useHistory } from "react-router-dom";

//constants
import constants from "../../constants";

momentDurationFormatSetup(moment);

export default function UserComponent({ users, isLoading, page_no }) {
  const history = useHistory();
  const [deletingUser, setDeleting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [forceDelete, setForceDelete] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = (email) => {
    setUserEmail(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = async () => {
    setDeleting(true);
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
      body: JSON.stringify({ isForceDelete: forceDelete }),
    };
    const response = await fetch(
      `${constants.apiUrl}/admin/user/${userEmail}`,
      requestOptions,
    );
    const result = await response.json();
    if (result.status === true) {
      window.location.reload();
    }
    setDeleting(false);
    setOpen(false);
  };
  return (
    <>
      <Table className="mb-0">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Sr No</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Active</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Created At</TableCell>
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
            {users.map(
              (user, index) =>
                user.email !== localStorage.getItem("email") && (
                  <TableRow key={user._id}>
                    <TableCell style={{ textAlign: "center" }}>
                      {index + 1 + 10 * page_no}
                    </TableCell>
                    <TableCell className="pl-3 fw-normal">
                      {user.email}
                    </TableCell>
                    <TableCell className="pl-3 fw-normal">
                      <Checkbox checked={user.isActive} color="secondary" />
                    </TableCell>
                    <TableCell className="pl-3 fw-normal">
                      {moment(user.createDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>
                      <IconButton color="default">
                        <EditIcon
                          onClick={() =>
                            history.push({
                              pathname: "/app/update_user",
                              state: user,
                            })
                          }
                          style={{ margin: 0 }}
                        />
                      </IconButton>
                      <IconButton
                        style={{ color: "red", margin: 0 }}
                        onClick={() => handleClickOpen(user.email)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ),
            )}
          </TableBody>
        )}
      </Table>
      {/* Delete user confirmation window */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete User Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
            <Box
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={forceDelete}
                onChange={() => setForceDelete(!forceDelete)}
              />
              <Typography>Delete user forcefully?</Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => deleteUser()} color="primary" autoFocus>
            {forceDelete && "Force "}Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
