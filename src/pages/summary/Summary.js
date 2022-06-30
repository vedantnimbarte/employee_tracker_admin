import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  TablePagination,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Search as SearchIcon, Close as CloseIcon } from "@material-ui/icons";
import moment from "moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import Summery from "../../components/Table/Summery";

//constants
import constants from "../../constants";

const useStyles = makeStyles((theme) => ({
  tableOverflow: {
    overflow: "auto",
  },
}));

export default function Summary() {
  const classes = useStyles();
  const [startDate, setStartDate] = useState("");
  const [rows, setRows] = useState();
  const [usersData, setUsersData] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [pageNumber, setPage] = useState(0);
  const [requestBody, setRequestBody] = useState({ pageNumber, pageSize: 10 });

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
      `${constants.apiUrl}/admin/report`,
      requestOptions,
    );
    const result = await response.json();
    result.data.startDate &&
      setStartDate(moment(result.data.startDate).format("YYYY-MM"));

    if (result.status) {
      setRows(result.data.totalRows);
      setUsersData(result.data.users);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setLoading(true);
    setRequestBody({ pageNumber: 0, pageSize: 10 });
    setUsersData("");
  };

  const handlePageChange = (event, page) => {
    setPage(page);
    setRequestBody({
      pageNumber: page,
      pageSize: 10,
      // startDate,
    });
  };

  const onSearch = () => {
    setLoading(true);
    setPage(0);

    setRequestBody({
      startDate: moment(startDate).format("YYYY-MM"),
      pageSize: 10,
      pageNumber: 0,
    });
  };

  useEffect(() => {
    getUsersData();
  }, [requestBody]);

  return (
    <>
      <PageTitle title="Summary" />
      <Grid
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: 10,
          width: "100%",
          justifyContent: "right",
          alignItems: "center",
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            views={["year", "month"]}
            label="Year and Month"
            value={startDate}
            onChange={setStartDate}
            variant="outlined"
          />
        </MuiPickersUtilsProvider>

        <IconButton onClick={onSearch}>
          <SearchIcon />
        </IconButton>
        <IconButton onClick={handleClearSearch}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="Summary"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <Summery
              users={usersData}
              isLoading={isLoading}
              page_no={pageNumber}
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
    </>
  );
}
