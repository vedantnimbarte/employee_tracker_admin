import { Fragment } from "react";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";

//Components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import UpdateHolidayForm from "../../components/Form/UpdateHoliday";

// styles
import useStyles from "./styles";

export default function UpdateHoliday() {
  const classes = useStyles();
  const history = useHistory();
  const { name } = history.location.state;

  return (
    <Fragment>
      <PageTitle title="Update Holiday Details" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="Update Holiday"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <UpdateHolidayForm holiday={name} />
          </Widget>
        </Grid>
      </Grid>
    </Fragment>
  );
}
