import {
  FormLabel,
  MenuItem,
  TextField,
  Chip,
  FormControl,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { get, post } from "../Utilities/APIHelper";
import "./trader.css";
import dayjs from "dayjs";
import Confirmation from "../Utilities/ConfirmationHelper";
import { CustomizedSnackbars } from "../Utilities/notification";

export function OrderEntry({ positionSummary, cftId }) {
  const [contract, setContract] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  useEffect(() => {
    if (cftId !== "") {
      PopulateOrder();
    }
  }, [cftId]);
  const PopulateOrder = () => {
    var filterd = positionSummary.filter((x) => {
      return x.ID === cftId;
    });
    if (filterd.length > 0) {
      setContract(filterd[0].ID);
      setselectedContract(filterd[0]);
    }
  };
  const [order, setOrder] = useState({
    cftid: "",
    transactionType: "",
    quantity: "",
    price: "",
    commodityGrade: "",
    repId: "751a7d05-1c09-4512-8ecd-090a18b13352",
    sessionId: "",
    rtc: "Head Office",
    whrId: "",
    createdBy: "751a7d05-1c09-4512-8ecd-090a18b13352",
  });
  const [priceLimit, setPriceLimits] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedContract, setselectedContract] = useState({});
  const [showconfirmation, setShowconfirmation] = useState(false);

  const onContractIdChanged = (contract_id) => {
    setselectedContract({});
    var filterd = positionSummary.filter((x) => {
      return x.ID === contract_id;
    });
    if (filterd.length > 0) {
      setselectedContract(filterd[0]);
      setContract(filterd[0].ID);
    }
  };
  const onSymbolChanged = async (_symbol) => {
    setSelectedSymbol(_symbol);
    if (
      selectedContract.ECXWarehouseId !== "00000000-0000-0000-0000-000000000000"
    ) {
      await get(
        `Contract/pricelimit?symbol=${_symbol}&warehouseId=${selectedContract.ECXWarehouseId}&productionYear=${selectedContract.ProductionYear}`
      ).then((res) => {
        if (res.data.length > 0) {
          setPriceLimits(res.data);
          get(
            `Contract/whrbycftid?cftId=${
              selectedContract.ID
            }&commodityGradeId=${
              res.data[0].CommodityGradeId
            }&transactionType=${selectedContract.Side === "Buy" ? 1 : 2}`
          ).then((result) => {
            if (result.data) {
              if (result.data.length > 0) {
                setOrder((prev) => ({
                  ...prev,
                  cftid: selectedContract.ID,
                  transactionType: selectedContract.Side === "Buy" ? 1 : 2,
                  quantity: result.data[0].CurrentQuantity,
                  commodityGrade: result.data[0].CommodityGradeId,
                  //repId: "",
                  sessionId: res.data[0].SessionId,

                  whrId: result.data[0].Id,
                  price: selectedContract.Price,
                }));
              } else {
                setNotification({
                  message:
                    "Warehouse Receipt not Exists for this Selected Symbol",
                  openNotif: true,
                  severity: "error",
                });
              }
            }
          });
        } else {
          setNotification({
            message: "Price Limit not Exist",
            openNotif: true,
            severity: "error",
          });
        }
      });
    } else {
      console.log(selectedContract.ECXWarehouseId);
    }
  };

  const handlePrice = (_price) => {
    setOrder((prev) => ({
      ...prev,
      price: _price,
    }));
  };
  const handleSubmit = async () => {
    if (
      order.price !== "" &&
      order.cftid !== "" &&
      order.transactionType !== "" &&
      order.quantity !== "" &&
      order.price !== "" &&
      order.commodityGrade !== "" &&
      order.repId !== "" &&
      order.sessionId !== "" &&
      order.rtc !== "" &&
      order.whrId !== "" &&
      order.createdBy !== ""
    ) {
      setShowconfirmation(true);
    } else {
      setNotification({
        message: "Please Provide all necessary Information",
        openNotif: true,
        severity: "error",
      });
    }
  };
  const submitOrder = async (_id, action) => {
    if (action === "ok") {
      if (
        order.price != null &&
        order.cftid != null &&
        order.transactionType != null &&
        order.quantity != null &&
        order.price != null &&
        order.commodityGrade != null &&
        order.repId != null &&
        order.sessionId != null &&
        order.rtc != null &&
        order.whrId != null &&
        order.createdBy != null
      ) {
        if (
          order.price >= priceLimit[0].LowerPriceLimit &&
          order.price <= priceLimit[0].UpperPriceLimit
        ) {
          await post(`Contract/saveorder`, order).then(
            (result) => {
              if (result.data === "OK") {
                setShowconfirmation(false);
                clearForm();
                setNotification({
                  message: "Order Submitted successfuly",
                  openNotif: true,
                  severity: "success",
                });
              } else {
                setNotification({
                  message: result.data,
                  openNotif: true,
                  severity: "error",
                });
              }
            },
            (err) => {
              setShowconfirmation(false);
              clearForm();
              setNotification({
                message: err.message,
                openNotif: true,
                severity: "error",
              });
            }
          );
        } else {
          setShowconfirmation(false);
          setNotification({
            message: "The Price is out of Limit Price Range",
            openNotif: true,
            severity: "error",
          });
        }
      } else {
        setNotification({
          message: "Please Provide all necessary Information",
          openNotif: true,
          severity: "error",
        });
        setShowconfirmation(false);
      }
    }
    setShowconfirmation(false);
  };
  const clearForm = () => {
    setContract("");
    setOrder({
      cftid: "",
      transactionType: "",
      quantity: "",
      price: "",
      commodityGrade: "",
      repId: "751a7d05-1c09-4512-8ecd-090a18b13352",
      sessionId: "",
      rtc: "Head Office",
      whrId: "",
      createdBy: "751a7d05-1c09-4512-8ecd-090a18b13352",
    });
    setPriceLimits({});
    setSelectedSymbol("");
    setselectedContract({});
    setShowconfirmation(false);
  };
  return (
    <>
      <Card align="left">
        <h3>Order Entry</h3>
        <CardContent>
          <FormControl sx={{ ml: 2 }}>
            <FormLabel id="cftNumber"></FormLabel>
            <TextField
              sx={{ mb: 1 }}
              size="small"
              aria-labelledby="cftNumber"
              value={contract}
              label="Contract ID"
              select
              onChange={(e) => onContractIdChanged(e.target.value)}
            >
              {positionSummary.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.ID}>
                    {item.ContractNumber}
                  </MenuItem>
                );
              })}
            </TextField>

            <FormLabel sx={{ mb: 1 }}>
              {" "}
              Owner Id:{selectedContract.OwnerID}
            </FormLabel>
            <FormLabel sx={{ mb: 1 }}>
              {" "}
              Maturity Date:
              {selectedContract.MaturityDate &&
                dayjs(selectedContract.MaturityDate).format("DD/MM/YYYY")}
            </FormLabel>
            <FormLabel sx={{ mb: 1 }}>
              {" "}
              Side:
              {selectedContract.Side && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={selectedContract.Side}
                  color={
                    selectedContract.Side === "Sell" ? "success" : "warning"
                  }
                />
              )}
            </FormLabel>
            <FormLabel sx={{ mb: 1 }}>
              {" "}
              Production Year:{selectedContract.ProductionYear}
            </FormLabel>
            <FormLabel id="symbol"></FormLabel>
            <TextField
              size="small"
              margin="dense"
              value={selectedSymbol}
              label="Symbol"
              select
              aria-labelledby="symbol"
              onChange={(e) => onSymbolChanged(e.target.value)}
            >
              {selectedContract.Symbol &&
                selectedContract.Symbol.split(",").map((x, index) => {
                  return (
                    <MenuItem key={index} value={x}>
                      {x}
                    </MenuItem>
                  );
                })}
            </TextField>

            <TextField
              label="Quantity"
              value={order.quantity}
              variant="outlined"
              size="small"
              margin="normal"
              disabled
            />
            <TextField
              label="Price"
              value={order.price}
              variant="outlined"
              size="small"
              type="number"
              margin="normal"
              onChange={(e) => handlePrice(e.target.value)}
            />
            <FormLabel>
              [{priceLimit[0] && priceLimit[0].LowerPriceLimit}-
              {priceLimit[0] && priceLimit[0].UpperPriceLimit}]
            </FormLabel>
            <Stack direction="row" spacing={2} style={{ marginTop: "30px" }}>
              <Button
                variant="contained"
                color="success"
                onClick={(e) => handleSubmit()}
              >
                Submit
              </Button>
              {showconfirmation && (
                <Confirmation
                  title={`Order Submition (${selectedContract.ContractNumber} )`}
                  open={showconfirmation}
                  body={`Are you sure you want to Submit this Order?  Quantity: ${order.quantity} with Price:${order.price}`}
                  callback={submitOrder.bind(
                    this,
                    selectedContract.ContractNumber
                  )}
                />
              )}
              <Button
                variant="outlined"
                color="error"
                onClick={() => clearForm()}
              >
                Reset
              </Button>
            </Stack>
          </FormControl>
        </CardContent>
      </Card>
      <CustomizedSnackbars
          notification={notification}
          handleNotificationClose={handleNotificationClose}
        ></CustomizedSnackbars>
    </>
  );
}
