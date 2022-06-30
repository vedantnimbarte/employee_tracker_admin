import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  TablePagination,
  Fab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@material-ui/icons";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import User from "../../components/Table/User";

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

export default function Users() {
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
      `${constants.apiUrl}/admin/user`,
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

  const onSearch = () => {
    setLoading(true);
    setRequestBody({
      searchEmail: email.includes("@samp.com")
        ? email
        : email.concat("@samp.com"),
      pageSize: 10,
      pageNumber: 0,
    });
  };

  useEffect(() => {
    getUsersData();
  }, [requestBody, pageNumber]);

  return (
    <>
      <PageTitle title="Users" />

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="Users"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <Grid
              style={{
                display: "flex",
                backgroundColor: "white",
                padding: 10,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <TextField
                  type="email"
                  id="outlined-basic"
                  variant="outlined"
                  label="Enter email"
                  size="small"
                  className="ml-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button color="primary" onClick={onSearch}>
                  <SearchIcon />
                </Button>
                <Button color="secondary" onClick={handleClearSearch}>
                  <CloseIcon />
                </Button>
              </Box>
              <Box>
                <Fab
                  color="primary"
                  aria-label="add"
                  size="small"
                  onClick={() => {
                    history.push("/app/new_user");
                  }}
                >
                  <AddIcon />
                </Fab>
              </Box>
            </Grid>
            <User
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
