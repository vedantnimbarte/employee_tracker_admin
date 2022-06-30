import React from "react";
import constants from "../constants";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

async function loginUser(
  dispatch,
  login,
  password,
  history,
  setIsLoading,
  setError,
) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("id_token"),
    },
    body: JSON.stringify({
      email: login.includes("@samp.com") ? login : login.concat("@samp.com"),
      password: password,
    }),
  };
  const response = await fetch(`${constants.apiUrl}/user`, requestOptions);
  const data = await response.json();
  // setError(false);
  // setIsLoading(true);

  if (data.status) {
    if (data.data.role != "EMPLOYEE") {
      setTimeout(() => {
        localStorage.setItem("id_token", data.data._id);
        localStorage.setItem("email", data.data.email);
        localStorage.setItem("name", data.data.name);
        setError(null);
        setIsLoading(false);
        dispatch({ type: "LOGIN_SUCCESS" });
        history.push("/app/dashboard");
      }, 2000);
    } else {
      dispatch({ type: "LOGIN_FAILURE" });
      alert("You don't have sufficient permission to login");
      setError(true);
      setIsLoading(false);
    }
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
    alert("Login Failed");
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
