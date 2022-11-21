import { Chip, Table } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Stack,
  Button,
} from "@mui/material";
import { Cancel, Edit } from "@mui/icons-material";
import "./trader.css";
import { get, put } from "../Utilities/APIHelper";
import Confirmation, { EditOrder } from "../Utilities/ConfirmationHelper";
import { CustomizedSnackbars } from "../Utilities/notification";

export function OrderView() {
  const [orderView, setOrderview] = useState([]);
  const [showconfirmation, setShowconfirmation] = useState(false);
  const [showEditconfirmation, setShowEditconfirmation] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  useEffect(() => {
    PopulateOrder();
  }, []);

  const PopulateOrder = async () => {
    await get(
      `Contract/orderview?RepId=${"751a7d05-1c09-4512-8ecd-090a18b13352"}`
    ).then((result) => {
      if (result.data) {
        setOrderview(result.data);
      }
    });
  };
  const handleEdit = () => {
    setShowEditconfirmation(true);
  };
  const handleCancel = () => {
    setShowconfirmation(true);
  };

const cancelOrder = (_id,action) => {
    if (action === "ok") {
      put(`Contract/cancelorder?orderId=${_id}&createdBy=751a7d05-1c09-4512-8ecd-090a18b13352`,{}).then(
        (result) => {
          if(result.data){
            PopulateOrder();
            setNotification({
              message: "Order Canceled successfuly",
              openNotif: true,
              severity: "success",
            });
          }
          else{
            setNotification({
              message: "Error While Order Canceling",
              openNotif: true,
              severity: "danger",
            });
          } 
        }
      );
    }
    setShowconfirmation(false);
  };
  const editOrder= (_id,action) => {
    if (action === "OK") {
      setNotification({
        message: "Order Edited successfuly",
        openNotif: true,
        severity: "success",
      });
      setShowEditconfirmation(false);
    }
    else if(action === "cancel"){
      setShowEditconfirmation(false);
    }
    else{
      setNotification({
        message: action,
        openNotif: true,
        severity: "danger",
      });
      setShowEditconfirmation(false);
    }
  };
  return (
    <Card sx={{ height: "200px", overflowY: "auto" }}>
      <h3>Order View</h3>
      <CardContent sx={{ pt: 0 }}>
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Contract Number</TableCell>
                <TableCell>Ticket Number</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderView.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.ContractNumber}</TableCell>
                  <TableCell>{row.TicketNo}</TableCell>
                  <TableCell>{row.OwnerID}</TableCell>
                  <TableCell>
                    <Chip
                     variant="outlined"
                      label={row.Buy_Sell}
                      color={row.Buy_Sell === "Sell" ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell>{row.Symbol}</TableCell>
                  <TableCell>{row.Quantity}</TableCell>
                  <TableCell>{row.Price}</TableCell>
                  <TableCell>{row.OrderStatus}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        onClick={() => handleEdit(row.OwnerID)}
                        startIcon={<Edit />}
                        disabled={row.OrderStatus!=='Pending'}
                      >
                        Edit
                      </Button>
                      {showEditconfirmation && (
                    <EditOrder
                      open={showEditconfirmation}
                      Id={row.ID}
                      price={row.Price}
                      Symbol={row.Symbol}
                      Quantity={row.Quantity}
                      ContractNumber={row.ContractNumber}
                      warehouseId={row.ECXWarehouseId}
                      productionYear={row.ProductionYear}
                      updatedBy={'751a7d05-1c09-4512-8ecd-090a18b13352'}
                      callback={editOrder.bind(this,row.ID)}
                    />
                  )}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancel(row.ID)}
                        startIcon={<Cancel />}
                        disabled={row.OrderStatus!=='Pending'}
                      >
                        Cancel
                      </Button>
                      {showconfirmation && (
                    <Confirmation
                      title={`Order Cancellation (${row.ContractNumber} )`}
                      open={showconfirmation}
                      body="Are you sure you want to cancel Order?"
                      callback={cancelOrder.bind(this,row.ID)}
                    />
                  )}
                    </Stack>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
