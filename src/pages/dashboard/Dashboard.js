import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { LineChart, Line } from "recharts";
import { useUserDispatch, signOut } from "../../context/UserContext";

// styles
import useStyles from "./styles";

// components
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";

//constants
import constants from "../../constants";

export default function Dashboard(props) {
  var classes = useStyles();
  var theme = useTheme();
  var userDispatch = useUserDispatch();

  const [stats, setStats] = useState("");
  const [isLoading, setLoading] = useState(true);

  const getStatData = async () => {
    setLoading(true);
    const response = await fetch(`${constants.apiUrl}/admin/dashboard`, {
      headers: {
        authorization: localStorage.getItem("id_token"),
      },
    });
    if (response.status != 403) {
      const result = await response.json();
      if (result.data) {
        setStats(result);
        setLoading(false);
      }
    } else {
      signOut(userDispatch, props.history);
    }
  };

  React.useEffect(() => {
    getStatData();
  }, []);

  return (
    <>
      <PageTitle
        title="Dashboard"
        button={
          <Button
            onClick={getStatData}
            variant="contained"
            size="medium"
            color="secondary"
          >
            Refresh
          </Button>
        }
      />
      <Grid container spacing={4}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="Total Users"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  {!isLoading && (
                    <Typography size="xl" weight="medium" noWrap>
                      {stats.data.totalUser}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <LineChart
                    width={100}
                    height={30}
                    data={[
                      { value: 10 },
                      { value: 15 },
                      { value: 10 },
                      { value: 17 },
                      { value: 18 },
                    ]}
                  >
                    <Line
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Grid>
              </Grid>
            </div>
          </Widget>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="LoggedIn Users"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  {!isLoading && (
                    <Typography size="xl" weight="medium" noWrap>
                      {stats.data.loginUser}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <LineChart
                    width={100}
                    height={30}
                    data={[
                      { value: 10 },
                      { value: 15 },
                      { value: 10 },
                      { value: 17 },
                      { value: 18 },
                    ]}
                  >
                    <Line
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Grid>
              </Grid>
            </div>
          </Widget>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="Absent Users"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  {!isLoading && (
                    <Typography size="xl" weight="medium" noWrap>
                      {stats.data.absentUser}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <LineChart
                    width={100}
                    height={30}
                    data={[
                      { value: 10 },
                      { value: 15 },
                      { value: 10 },
                      { value: 17 },
                      { value: 18 },
                    ]}
                  >
                    <Line
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Grid>
              </Grid>
            </div>
          </Widget>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="Total Working Users"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  {!isLoading && (
                    <Typography size="xl" weight="medium" noWrap>
                      {stats.data.isWork}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <LineChart
                    width={100}
                    height={30}
                    data={[
                      { value: 10 },
                      { value: 15 },
                      { value: 10 },
                      { value: 17 },
                      { value: 18 },
                    ]}
                  >
                    <Line
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Grid>
              </Grid>
            </div>
          </Widget>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="Users taking break"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  {!isLoading && (
                    <Typography size="xl" weight="medium" noWrap>
                      {stats.data.isBreak}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <LineChart
                    width={100}
                    height={30}
                    data={[
                      { value: 10 },
                      { value: 15 },
                      { value: 10 },
                      { value: 17 },
                      { value: 18 },
                    ]}
                  >
                    <Line
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Grid>
              </Grid>
            </div>
          </Widget>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="Work Hours Completed"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
                  {!isLoading && (
                    <Typography size="xl" weight="medium" noWrap>
                      {stats.data.isDayoff}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <LineChart
                    width={100}
                    height={30}
                    data={[
                      { value: 10 },
                      { value: 15 },
                      { value: 10 },
                      { value: 17 },
                      { value: 18 },
                    ]}
                  >
                    <Line
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Grid>
              </Grid>
            </div>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}
