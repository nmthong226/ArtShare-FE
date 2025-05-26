import { Backdrop, CircularProgress, Typography } from "@mui/material"

const Loading = () => (
  <Backdrop
    open
    sx={{
      zIndex: (theme) => theme.zIndex.modal + 1,
      position: "fixed",
      inset: 0, // shorthand for top:0; right:0; bottom:0; left:0
      backgroundColor: "transparent",
    }}
  >
    <CircularProgress color="inherit" />
    <Typography variant="h6" sx={{ m: 2, color: "white" }}>
      Processing...
    </Typography>
  </Backdrop>
);

export default Loading