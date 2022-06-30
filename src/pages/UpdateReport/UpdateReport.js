import { Fragment } from "react";
import { Grid } from "@material-ui/core";

//Components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import UpdateReportForm from "../../components/Form/UpdateReport";

// styles
import useStyles from "./styles";

export default function UpdateReport() {
  const classes = useStyles();

  return (
    <Fragment>
      <PageTitle title="Update Report" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="User Status"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <UpdateReportForm />
          </Widget>
        </Grid>
      </Grid>
    </Fragment>
  );
}
