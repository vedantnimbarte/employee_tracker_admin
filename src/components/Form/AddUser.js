import { useState } from "react";
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
} from "@material-ui/core";
import useStyles from "./styles";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { useHistory } from "react-router-dom";

//constants
import constants from "../../constants";

momentDurationFormatSetup(moment);

export default function AddUserComponent() {
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
  const [profilePic, setProfilePic] = useState("");
  const [aadharPic, setAadharPic] = useState("");
  const [designation, setDesignation] = useState("");

  const handleUserDetails = () => {
    const body = {};
    const error = {};
    const SUPPORTED_FILETYPES = ["image/png", "image/jpeg", "image/jpg"];

    !profilePic &&
      Object.assign(error, {
        profile: "Please select employees profile picture",
      });
    SUPPORTED_FILETYPES.includes(profilePic.type)
      ? Object.assign(body, { profile: profilePic })
      : Object.assign(error, {
          profile: "please select .png, .jpeg or .jpg file for profile picture",
        });
    !aadharPic &&
      Object.assign(error, {
        aadhar: "Please upload aadhar card",
      });
    SUPPORTED_FILETYPES.includes(aadharPic.type)
      ? Object.assign(body, { profile: aadharPic })
      : Object.assign(error, {
          aadhar: "please select .png, .jpeg or .jpg file for aadhar card",
        });
    email.length > 0
      ? Object.assign(body, { email })
      : Object.assign(error, {
          email: "Please enter your email",
        });
    name.length > 0
      ? Object.assign(body, { name })
      : Object.assign(error, { name: "Please enter your name" });
    mobile.length > 0 && Object.assign(body, { mobile });
    role.length > 0 && Object.assign(body, { role });
    address.length > 0 && Object.assign(body, { address });
    dob.length > 0 && Object.assign(body, { birthDate: dob });
    gender.length > 0 && Object.assign(body, { gender });
    pincode.length > 0 && Object.assign(body, { pincode });
    password.length > 0
      ? Object.assign(body, { password })
      : Object.assign(error, {
          password: "Please enter your password",
        });
    setErrors(error);
    return { body, error };
  };
  const createUser = async () => {
    setLoading(true);
    const { body, error } = handleUserDetails();
    if (Object.keys(error).length === 0) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("id_token"),
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        `${constants.apiUrl}/admin/user/register`,
        requestOptions,
      );
      const result = await response.json();
      if (result.status === true) {
        history.push("/app/users");
      } else {
        setErrors({
          errorCode: result.code,
        });
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
          {errors.profile && (
            <Typography className={classes.errorMsg} style={{ marginLeft: 10 }}>
              {errors.profile}
            </Typography>
          )}
          <InputLabel>Profile Picture</InputLabel>
          <TextField
            type="file"
            variant="outlined"
            style={{ width: "100%", margin: 10 }}
            size="small"
            onChange={(e) => setProfilePic(e.target.files[0])}
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
          {errors.email && (
            <Typography className={classes.errorMsg} style={{ marginLeft: 10 }}>
              {errors.email}
            </Typography>
          )}
          <TextField
            type="email"
            id="email"
            variant="outlined"
            label="Email"
            size="small"
            style={{ width: "100%", margin: 10 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setDob(e.target.value)}
            style={{ width: "100%", margin: 10 }}
          />
        </Grid>
        <Grid xs={5}>
          {errors.aadhar && (
            <Typography className={classes.errorMsg} style={{ marginLeft: 10 }}>
              {errors.aadhar}
            </Typography>
          )}
          <InputLabel>Upload Aadhar Card (upload only image)</InputLabel>
          <TextField
            type="file"
            id="aadhar"
            variant="outlined"
            size="small"
            style={{ width: "100%", margin: 10 }}
            onChange={(e) => setAadharPic(e.target.files[0])}
            required
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
            size="small"
            label="Designation"
            style={{ width: "100%", margin: 10 }}
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
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
        </Grid>
      </Grid>
      <FormControl
        style={{
          margin: 10,
          width: "40%",
        }}
      >
        <Button variant="outlined" color="primary" onClick={createUser}>
          {isLoading && <CircularProgress size="small" />}
          Add User
        </Button>
      </FormControl>
    </Box>
  );
}
