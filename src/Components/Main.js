import {
  AppBar,
  Box,
  Avatar,
  Toolbar,
  Typography,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { OrderEntry } from "./OrderEntry";
import { OrderView } from "./OrderView";
import { PositionSummary } from "./PositionSummary";

import { get } from "../Utilities/APIHelper";
import { Login } from "./Login";
import { Person } from "@mui/icons-material";

export function Main({ setToken }) {
  const [positionSummary, setPositionSummary] = useState([]);
  const [cashBalance, setCashBalance] = useState([]);
  const [cftId, setCftId] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
  };

  useEffect(() => {
    populatePositionSummary();
  }, []);

  (function () {
    if (!localStorage.getItem("userToken")) {
      return <Login setToken={null} />;
    }
  })();

  const decodedJwt = JSON.parse(
    atob(localStorage.getItem("userToken").split(".")[1])
  );
  if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
    setToken(null);
    return <Login setToken={setToken} />;
  }

  const populatePositionSummary = async () => {
    await get("Contract/PositionSummary").then((result) => {
      if (result.data) setPositionSummary(result.data);
    });
    await get("Contract/CashBalance").then((result) => {
      if (result.data) setCashBalance(result.data);
    });
  };
  const PopulateOrder = (_cftId) => {
    setCftId(_cftId);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{ backgroundColor: "#556438" }}>
          <Toolbar>
            <img
              src="./../images/ECXLogo.png"
              alt="ECX Logo"
              style={{ width: "60px", height: "60px" }}
            ></img>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, ml: 3 }}
              style={{ color: "rgb(136 143 153)" }}
              align="left"
            >
              Customized Forward Trading
            </Typography>
            <Chip
              sx={{ marginRight: "30px" }}
              style={{
                backgroundColor: "rgb(193 176 18)",
                marginRight: "10px",
                fontSize: "12px",
              }}
              icon={<Person />}
              label={decodedJwt.name}
            />

            <Button
              variant="contained"
              color="success"
              onClick={(e) => handleLogout()}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={2} sx={{ mt: 10, pr: 2, pl: 2 }}>
        <Grid
          contatiner={"true"}
          item
          xs={12}
          sm={7}
          md={9}
          sx={{ pl: 5 }}
          container
          spacing={2}
        >
          <Grid item xs={12} sm={12} md={12}>
            <PositionSummary
              positionSummary={positionSummary}
              cashBalance={cashBalance}
              getCFTNumber={PopulateOrder}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <OrderView />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5} md={3}>
          <OrderEntry positionSummary={positionSummary} cftId={cftId} />
        </Grid>
      </Grid>
    </>
  );
}
