import { Fragment } from "react";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";

//Components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import ChangePasswordForm from "../../components/Form/ChangePassword";

// styles
import useStyles from "./styles";

export default function ChangePassword() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Fragment>
      <PageTitle title="Profile Update" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="Update Account"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <ChangePasswordForm userEmail={localStorage.getItem("email")} />
          </Widget>
        </Grid>
      </Grid>
    </Fragment>
  );
}
