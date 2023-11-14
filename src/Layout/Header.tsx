import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { SportsHandball } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // Utils
  const navigate = useNavigate();

  // Methods
  const handleClickIcon = ():void => {
    navigate("/");
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
