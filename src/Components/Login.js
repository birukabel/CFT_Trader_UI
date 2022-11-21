import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { get } from "./../Utilities/APIHelper";
import "./Login.css";
import { Stack } from "@mui/system";

function Login({ setToken }) {
  const [loggedUser, setLoggedUser] = useState({ userName: "", password: "" });
  const [message, setMessage] = useState();

  const populateUserToken = (event) => {
    event.preventDefault();
    if (loggedUser.userName !== "" && loggedUser.password !== "")
      get(
        `Authentication/autenticate?userName=${loggedUser.userName}&password=${loggedUser.password}`
      ).then((result) => {
       
       /* if (!result.data) {
          setMessage("Incorrect user name password");
        }*/
         if (result.data) setToken(result.data);
      });
  };

  const handleTextChange = (target) => {
    const { name, value } = target;
    if (target.name)
      setLoggedUser((previousValue) => ({ ...previousValue, [name]: value }));
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12} md={12} className="login-center">
        <Card
          sx={{
            width: 325,
          }}
        >
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={window.location.origin + "/images/login_avatar.png"}
              alt="Avatar"
              className="avatar"
            ></img>
            <Typography component="div" variant="h6" sx={{ color: "#46505A" }}>
              CFT Trader Login
            </Typography>
          </Stack>

          <Divider />
          <CardContent sx={{ display: "flex", justifyContent: "center" }}>
            <form onSubmit={populateUserToken}>
              <FormControl>
                <TextField
                  name="userName"
                  size="small"
                  label="User Name"
                  margin="normal"
                  value={loggedUser.userName}
                  onChange={(e) => {
                    handleTextChange(e.target);
                  }}
                ></TextField>
                <TextField
                  name="password"
                  type="password"
                  size="small"
                  label="Password"
                  margin="normal"
                  value={loggedUser.password}
                  onChange={(e) => {
                    handleTextChange(e.target);
                  }}
                ></TextField>
                <Button
                sx={[{mt:'10px',background:"#74A631"} ]}
                  type="submit"
                  size="small"                  
                  variant="contained"
                  color='success'
                >
                  Login
                </Button>
                <Typography component="div" variant="p" sx={{ color: "red",marginTop:'10px' }}>
                  {message}
                </Typography>
                <Stack direction='column'
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop:'20px'
              }}
            >
              <img
                src={window.location.origin + "/images/ECXLogoBlack.png"}
                alt="logo" width="50px" hight="50px"                
              ></img>
            </Stack>
              </FormControl>
            </form>
           
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
export { Login };
