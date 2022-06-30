import React from "react";
import { AppBar, Tooltip, Toolbar, IconButton } from "@material-ui/core";
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  Gavel as RulesIcon,
  ExitToApp as LogoutIcon,
} from "@material-ui/icons";
import classNames from "classnames";
import moment from "moment";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

import { signOut, useUserDispatch } from "../../context/UserContext";

//constants
import constants from "../../constants";

export default function Header(props) {
  var classes = useStyles();
  var userDispatch = useUserDispatch();

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  console.log(`history: ${props.history}`);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButtonSandwich,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          {localStorage.getItem("name")}
        </Typography>
        <div className={classes.grow} />

        <IconButton
          color="inherit"
          onClick={() => window.open(`${constants.apiUrl}/company_rules.pdf`)}
        >
          <RulesIcon />
          <Typography>Company Rules</Typography>
        </IconButton>

        <Tooltip title="Logout">
          <IconButton
            style={{ marginRight: 20 }}
            color="inherit"
            onClick={() => signOut(userDispatch, props.history)}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
