import React, { useState, useContext } from "react";
import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

const Topbar = ({ toggleSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccountClick = () => {
    navigate('/manageprofile');
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('login');
    navigate('/');
    handleMenuClose();
  };

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      p={2}
      sx={{
        // position: "sticky",  // Make the Topbar sticky
        // top: 0,              // Stick to the top of the viewport
        // zIndex: 1100,        // Ensure it appears above other content
        // // backgroundColor: colors.primary[400],  // Ensure it has a background color
        // boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",  // Add slight shadow to the top bar
      }}
    >
      {/* Sidebar Toggle Icon (if used) */}
      <Box display="flex" alignItems="center">
        {/* Uncomment this if you use a sidebar toggle */}
        {/* 
        <IconButton onClick={toggleSidebar}>
          <MenuOutlinedIcon />
        </IconButton> 
        */}
      </Box>

      {/* Right Side Icons */}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="flex-end" 
        sx={{ flexGrow: 1 }}  // This ensures the icons on the right are spaced properly
      >
        <IconButton onClick={colorMode.toggleColorMode} sx={{ ml: isMobile ? 2 : 0 }}>
          {theme.palette.mode === "primary" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMyAccountClick}>My Account</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
