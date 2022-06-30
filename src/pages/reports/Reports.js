import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  TablePagination,
  IconButton,
  Box,
  Tooltip,
  DialogTitle,
  DialogContentText,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import {
  Search as SearchIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@material-ui/icons";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import Report from "../../components/Table/Report";

//constants
import constants from "../../constants";

const useStyles = makeStyles((theme) => ({
  tableOverflow: {
    overflow: "auto",
  },
}));

export default function Reports() {
  const classes = useStyles();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState();
  const [usersData, setUsersData] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [pageNumber, setPage] = useState(0);
  const [requestBody, setRequestBody] = useState({ pageNumber, pageSize: 10 });
  const [infoStatus, setInfoStatus] = useState(false);

  const getUsersData = async () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${constants.apiUrl}/admin/dashboard`,
      requestOptions,
    );
    const result = await response.json();
    result.data.startDate &&
      setStartDate(moment(result.data.startDate).format("YYYY-MM-DD"));
    result.data.endDate &&
      setEndDate(moment(result.data.endDate).format("YYYY-MM-DD"));
    setRows(result.data.totalRows);
    setUsersData(result.data.users);
    setLoading(false);
  };

  const handleClearSearch = () => {
    setLoading(true);
    setRequestBody({ pageNumber: 0, pageSize: 10 });
    setEmail("");
    setUsersData("");
  };

  const handlePageChange = (event, page) => {
    console.log(page);
    setPage(page);
    setRequestBody({
      pageNumber: page,
      pageSize: 10,
      searchEmail: email.length > 0 ? email.concat("@samp.com") : undefined,
      startDate,
      endDate,
    });
  };

  const onSearch = () => {
    setLoading(true);
    setPage(0);
    if (email.length > 0) {
      setRequestBody({
        searchEmail: email.includes("@samp.com")
          ? email
          : email.concat("@samp.com"),
        startDate,
        endDate,
        pageSize: 10,
        pageNumber: 0,
      });
    } else {
      setRequestBody({
        startDate,
        endDate,
        pageSize: 10,
        pageNumber: 0,
      });
    }
  };

  useEffect(() => {
    getUsersData();
  }, [requestBody]);

  return (
    <>
      <PageTitle title="Reports" />
      <Grid
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: 10,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Tooltip title="Info">
            <IconButton
              onClick={() => setInfoStatus(!infoStatus)}
              style={{ color: "lightgray" }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          style={{
            display: "flex",
            backgroundColor: "white",
            padding: 10,
            width: "100%",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <div>
            <InputLabel>Username</InputLabel>
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              className="ml-2"
              placeholder="@samp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>Start Date</InputLabel>
            <TextField
              type="date"
              id="outlined-basic"
              variant="outlined"
              size="small"
              className="ml-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>End Date</InputLabel>
            <TextField
              type="date"
              id="outlined-basic"
              variant="outlined"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <IconButton color="primary" onClick={onSearch}>
              <SearchIcon />
            </IconButton>
            <IconButton color="secondary" onClick={handleClearSearch}>
              <CancelIcon />
            </IconButton>
          </div>
        </Box>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="Reports"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <Report
              users={usersData}
              isLoading={isLoading}
              page_no={pageNumber}
              getReportData={getUsersData}
            />
          </Widget>
        </Grid>
      </Grid>
      <Grid
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: 10,
          width: "100%",
          justifyContent: "right",
        }}
      >
        <TablePagination
          page={pageNumber}
          count={rows}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          variant="outlined"
          onChangePage={handlePageChange}
        />
      </Grid>

      <Dialog
        open={infoStatus}
        onClose={() => setInfoStatus(!infoStatus)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">
          Info about color highlights
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box>
              <Typography
                style={{
                  backgroundColor: "#f2d40f",
                  margin: 5,
                  padding: 5,
                  borderRadius: 2,
                }}
              >
                Unusual IP activity
              </Typography>
              <Typography
                style={{
                  backgroundColor: "#FFC260",
                  margin: 5,
                  padding: 5,
                  borderRadius: 2,
                }}
              >
                Break time greater than 1 hour
              </Typography>
              <Typography
                style={{
                  backgroundColor: "#f781ae",
                  margin: 5,
                  padding: 5,
                  borderRadius: 2,
                }}
              >
                Unusual Activity
              </Typography>
              <Typography
                style={{
                  backgroundColor: "green",
                  margin: 5,
                  padding: 5,
                  borderRadius: 2,
                  color: "white",
                }}
              >
                Employee's day completed (displayed only on present day)
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoStatus(!infoStatus)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
