import { Fragment } from "react";
import { Grid } from "@material-ui/core";

//Components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import AddUserForm from "../../components/Form/AddUser";

// styles
import useStyles from "./styles";

export default function NewUser() {
  const classes = useStyles();
  return (
    <Fragment>
      <PageTitle title="Add New User" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="New User"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <AddUserForm />
          </Widget>
        </Grid>
      </Grid>
    </Fragment>
  );
}
