import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { FormLabel, Stack, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { get, put } from "./APIHelper";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Confirmation(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.body}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="small"
            color="success"
            onClick={() => props.callback("ok")}
          >
            Ok
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => props.callback("cancel")}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export function EditOrder(props) {

  const [price, setPrice] = React.useState("");
  const [priceRange, setPriceRange] = React.useState({
    lowerRange: "",
    upperRange: "",
  });

  React.useEffect(() => {
    populatePriceRange();
  }, []);
  const populatePriceRange = async () => {
    await get(
      `Contract/pricelimit?symbol=${props.Symbol}&warehouseId=${props.warehouseId}&productionYear=${props.productionYear}`
    ).then((result) => {
      //populate
      if (result.data)
        setPriceRange((prev) => ({
          ...prev,
          lowerRange: result.data[0].LowerPriceLimit,
          upperRange: result.data[0].UpperPriceLimit,
        }));
    });
  };
  const editOrder = async () => {
    if (price >= priceRange.lowerRange && price <= priceRange.upperRange) {
      await put(`Contract/editorder?orderId=${props.Id}&price=${price}&updatedBy=${props.updatedBy}`).then(
        (result) => {
          if (result.data) {
            props.callback(result.data)
          }
        }
      );
    }
    else{
      props.callback('Price Range Error')
    }
  };
  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Edit Order</DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Stack direction="row">
            <FormLabel margin="normal">
              CFT Number: {props.ContractNumber}
            </FormLabel>
          </Stack>
          <Stack direction="row">
            <FormLabel margin="normal">
              Commodity Grade: {props.Symbol}
            </FormLabel>
          </Stack>
          <Stack direction="row">
            <FormLabel margin="normal">Quantity: {props.Quantity}</FormLabel>
          </Stack>
          <Stack direction="row">
            <FormLabel margin="normal">Old Price: {props.price}</FormLabel>
          </Stack>
          <Stack direction="row">
            <TextField
              type="number"
              label="New Price"
              value={price}
              margin="normal"
              size="small"
              onChange={(e) => setPrice(e.target.value)}
            />
          </Stack>
          <Stack direction="row">
            <FormLabel margin="normal">
              {[priceRange.lowerRange + "-" + priceRange.upperRange]}
            </FormLabel>
          </Stack>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          size="small"
          color="success"
          onClick={() => editOrder()}
          startIcon={<Edit />}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => props.callback("cancel")}
        >
          Cancel
        </Button>

      </DialogActions>
    </Dialog>
  );
}
