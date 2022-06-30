import { Fragment } from "react";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";

//Components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import UpdateUserForm from "../../components/Form/UpdateUser";

// styles
import useStyles from "./styles";

export default function UpdateUser() {
  const classes = useStyles();
  const history = useHistory();
  const { email } = history.location.state;

  return (
    <Fragment>
      <PageTitle title="Update User Details" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="Update User"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
          >
            <UpdateUserForm userEmail={email} />
          </Widget>
        </Grid>
      </Grid>
    </Fragment>
  );
}
