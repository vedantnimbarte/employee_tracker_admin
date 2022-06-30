import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import useStyles from "./styles";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { useHistory } from "react-router-dom";

//constants
import constants from "../../constants";

momentDurationFormatSetup(moment);

export default function UpdateUserComponent({ userEmail }) {
  const classes = useStyles();
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [isLoading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [profilePic, setProfilePic] = useState();
  const [aadharPic, setAadharPic] = useState();
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (userEmail === undefined || userEmail.length === 0) {
      history.push("/app/users");
    }
    getUserData();
  }, []);

  const setUserData = (user) => {
    user.name && setName(user.name);
    user.email && setEmail(user.email);
    user.mobile && setMobile(user.mobile);
    user.role && setRole(user.role);
    user.gender && setGender(user.gender);
    user.pincode && setPincode(user.pincode);
    user.address && setAddress(user.address);
    user.birthDate && setDob(user.birthDate);
    user.password && setPassword(user.password);
    user.isActive !== undefined && setActive(user.isActive);
    user.designation && setDesignation(user.designation);
  };

  const getUserData = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
    };
    const response = await fetch(
      `${constants.apiUrl}/admin/user/${userEmail}`,
      requestOptions,
    );
    const result = await response.json();
    if (result.status === true) {
      setUserData(result.data);
    }
  };

  const validateRequiredData = () => {
    const error = {};
    const SUPPORTED_FILETYPES = ["image/png", "image/jpeg", "image/jpg"];

    password.length < 8 &&
      Object.assign(error, { password: "Password must be 8 characters long" });
    name.length === 0 &&
      Object.assign(error, { name: "Please enter your name." });
    mobile.length < 10 &&
      Object.assign(error, { mobile: "Please enter valid mobile no" });
    setErrors(error);
  };

  const updateUser = async () => {
    setLoading(true);
    validateRequiredData();
    const body = {
      name,
      email,
      password,
      mobile,
      address,
      role,
      pincode,
      gender,
      birthDate: dob,
      isActive: active,
      profile: profilePic,
      aadhar: aadharPic,
      designation,
    };
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("id_token"),
      },
      body: JSON.stringify(body),
    };
    if (Object.keys(errors).length === 0) {
      const response = await fetch(
        `${constants.apiUrl}/admin/user`,
        requestOptions,
      );
      const result = await response.json();

      if (result.status === true) {
        history.push("/app/users");
      }
    }
    setLoading(false);
  };

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Grid
        xs={12}
        style={{
          padding: 10,
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Grid xs={5}>
          <InputLabel>Profile Picture</InputLabel>
          <TextField
            type="file"
            id="profile"
            variant="outlined"
            size="small"
            style={{ width: "100%", margin: 10 }}
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
          <TextField
            type="email"
            id="email"
            variant="outlined"
            label="Email"
            size="small"
            style={{ width: "100%", margin: 10 }}
            value={email}
          />
          {errors.name && (
            <Typography className={classes.errorMsg} style={{ marginLeft: 10 }}>
              {errors.name}
            </Typography>
          )}
          <TextField
            type="text"
            id="outlined-basic"
            variant="outlined"
            label="Name"
            size="small"
            style={{ width: "100%", margin: 10 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.mobile && (
            <Typography className={classes.errorMsg} style={{ marginLeft: 10 }}>
              {errors.mobile}
            </Typography>
          )}
          <TextField
            type="text"
            id="outlined-basic"
            variant="outlined"
            label="Mobile No"
            size="small"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={{ width: "100%", margin: 10 }}
            required
          />
          {errors.password && (
            <Typography className={classes.errorMsg} style={{ marginLeft: 10 }}>
              {errors.password}
            </Typography>
          )}
          <TextField
            type="password"
            id="password"
            variant="outlined"
            size="small"
            label="Password"
            style={{ width: "100%", margin: 10 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputLabel style={{ marginLeft: 10 }}>Date of birth</InputLabel>
          <TextField
            type="date"
            variant="outlined"
            size="small"
            value={moment(dob).format("YYYY-MM-DD")}
            onChange={(e) => setDob(e.target.value)}
            style={{ width: "100%", margin: 10 }}
          />
        </Grid>
        <Grid xs={5}>
          <InputLabel>Aadhar Card (only image)</InputLabel>
          <TextField
            type="file"
            id="aadhar"
            variant="outlined"
            size="small"
            style={{ width: "100%", margin: 10 }}
            onChange={(e) => setAadharPic(e.target.files[0])}
          />
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            style={{ margin: 10 }}
          >
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="gender"
              label="Gender"
              variant="outlined"
              size="small"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            style={{ margin: 10 }}
          >
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="role"
              label="Role"
              variant="outlined"
              size="small"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="text"
            id="designation"
            variant="outlined"
            label="Designation"
            size="small"
            style={{ width: "100%", margin: 10 }}
            required
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <TextField
            type="number"
            id="pincode"
            variant="outlined"
            label="Pincode"
            size="small"
            style={{ width: "100%", margin: 10 }}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <TextField
            type="text"
            id="address"
            variant="outlined"
            label="Address"
            size="small"
            multiline
            rows={4}
            maxRows={4}
            style={{ width: "100%", margin: 10 }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={() => setActive(!active)}
                style={{ margin: 1 }}
                name="isActive"
              />
            }
            style={{ width: "100%", margin: 10 }}
            label="Is Active"
          />
        </Grid>
      </Grid>
      <FormControl
        style={{
          margin: 10,
          width: "40%",
        }}
      >
        <Button variant="outlined" color="primary" onClick={updateUser}>
          {isLoading && <CircularProgress size="small" />}
          Update User
        </Button>
      </FormControl>
    </Box>
  );
}
