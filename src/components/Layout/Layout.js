import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Reports from "../../pages/reports/Reports";
import Users from "../../pages/users/Users";
import NewUser from "../../pages/NewUser";
import UpdateUser from "../../pages/UpdateUser";
import UpdateReport from "../../pages/UpdateReport";
import Holidays from "../../pages/holidays/holidays";
import AddHoliday from "../../pages/AddHoliday";
import UpdateHoliday from "../../pages/UpdateHoliday/UpdateHoliday";
import Leave from "../../pages/leave/leave";
import Summary from "../../pages/summary/Summary";
import Profile from "../../pages/ChangePassword/ChangePassword";

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/reports" component={Reports} />
            <Route path="/app/users" component={Users} />
            <Route path="/app/new_user" component={NewUser} />
            <Route path="/app/update_user" component={UpdateUser} />
            <Route path="/app/update_report" component={UpdateReport} />
            <Route path="/app/holidays" component={Holidays} />
            <Route path="/app/add_holiday" component={AddHoliday} />
            <Route path="/app/update_holiday" component={UpdateHoliday} />
            <Route path="/app/leave" component={Leave} />
            <Route path="/app/summary" component={Summary} />
            <Route path="/app/profile" component={Profile} />
          </Switch>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
