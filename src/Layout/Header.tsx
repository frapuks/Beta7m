import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { SportsHandball } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // Utils
  const navigate = useNavigate();

  // Variables
  const accessToken = localStorage.getItem("accessToken");

  // Methods
  const handleClickIcon = (): void => {
    navigate("/");
  };
  const handleClickLogin = (): void => {
    navigate("/login");
  };
  const handleClickDashboard = (): void => {
    navigate("/dashboard");
  };

  return (
    <AppBar component="header" position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={handleClickIcon}>
          <SportsHandball />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Beta7m
        </Typography>
        {accessToken ? (
          <Button color="inherit" onClick={handleClickDashboard}>
            Dashboard
          </Button>
        ) : (
          <Button color="inherit" onClick={handleClickLogin}>
            Se connecter
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
