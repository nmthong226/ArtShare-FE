import { Backdrop, CircularProgress, Typography } from "@mui/material";

const Loading = () => (
  <Backdrop
    open
    sx={{
      color: "#fff",
      zIndex: (theme) => theme.zIndex.modal + 1,
      position: "fixed",
      inset: 0,
      flexDirection: "column",
      backdropFilter: "blur(3px)",
    }}
  >
    <CircularProgress color="inherit" />
    <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
      Processing...
    </Typography>
  </Backdrop>
);

export default Loading;
