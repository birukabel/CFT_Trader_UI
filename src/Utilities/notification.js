import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export  function CustomizedSnackbars({notification,handleNotificationClose}) {
  return ( 
    
      <Snackbar open={notification.openNotif} autoHideDuration={6000} onClose={handleNotificationClose}
       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
  );
}