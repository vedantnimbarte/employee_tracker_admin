import { Fragment } from "react";
import { Grid } from "@material-ui/core";

//Components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import AddHolidayForm from "../../components/Form/AddHoliday";

// styles
import useStyles from "./styles";

export default function NewUser() {
  const classes = useStyles();
  return (
    <Fragment>
      <PageTitle title="Add New Holiday" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="New Holiday"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <AddHolidayForm />
          </Widget>
        </Grid>
      </Grid>
    </Fragment>
  );
}
