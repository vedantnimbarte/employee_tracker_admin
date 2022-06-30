import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  TablePagination,
  Fab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import { Add as AddIcon } from "@material-ui/icons";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import HolidaysTable from "../../components/Table/Holidays";
import LeaveTable from "../../components/Table/Leave";

//constants
import constants from "../../constants";

const useStyles = makeStyles((theme) => ({
  tableOverflow: {
    overflow: "auto",
  },
  addButton: {
    margin: theme.spacing(2),
    padding: 0,
    width: 40,
    height: 40,
    fontSize: 20,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "rgba(255, 255, 255, 0.35)",
    },
  },
}));

export default function Leave() {
  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState("");

  const [usersData, setUsersData] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [pageNumber, setPage] = useState(0);
  const [rows, setRows] = useState();
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
      `${constants.apiUrl}/admin/leave`,
      requestOptions,
    );
    const result = await response.json();
    if (result.status === true) {
      setRows(result.data.totalRows);
      setUsersData(result.data.users);
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setPage(page);
    setRequestBody({ pageNumber: page, pageSize: 10 });
  };

  const handleClearSearch = () => {
    setLoading(true);
    setRequestBody({ pageNumber: 0, pageSize: 10 });
    setEmail("");
    setUsersData("");
  };

  useEffect(() => {
    getUsersData();
  }, [requestBody, pageNumber]);

  return (
    <>
      <PageTitle title="Leaves" />

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="List of Leaves"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <LeaveTable
              users={usersData}
              isLoading={isLoading}
              page_no={pageNumber}
              getLeaveData={getUsersData}
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
