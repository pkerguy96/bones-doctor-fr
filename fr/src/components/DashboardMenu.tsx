import { AccountCircle } from "@mui/icons-material";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import ModalComponent from "./ModalComponent";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
const AdminProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const storedUserData = localStorage.getItem("user_login");
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
  const userProfilePicture = parsedUserData
    ? parsedUserData.profile || null
    : null;

  // Handle menu open
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };
  const HandleLogout = () => {
    setIsModalOpen(true);

    handleClose();
  };

  return (
    <Box className="">
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {userProfilePicture ? (
          <Avatar src={userProfilePicture} sx={{ width: 30, height: 30 }} />
        ) : (
          <AccountCircle />
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box className="w-[180px] flex flex-col">
          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleClose}
            className="text-inherit flex-1 flex items-center hover:text-blue-500"
          >
            <Box className="flex flex-wrap gap-2 items-center">
              <AssignmentIndOutlinedIcon
                className="text-lg text-inherit"
                fontSize="medium"
                fill="currentColor"
              />
              <span className="w-0 flex-1">Profil</span>
            </Box>
          </MenuItem>

          <MenuItem
            component={Link}
            to="/profile/password"
            onClick={handleClose}
            className="text-inherit flex-1 flex items-center hover:text-blue-500"
          >
            <Box className="flex flex-wrap gap-2 items-center">
              <LockOutlinedIcon
                className="text-lg text-inherit"
                fontSize="medium"
                fill="currentColor"
              />
              <span className="w-0 flex-1">Mot de passe</span>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={HandleLogout}
            className="text-inherit flex-1 flex items-center hover:text-blue-500"
          >
            <Box className="flex flex-wrap gap-2 items-center">
              <LogoutOutlinedIcon
                className="text-lg text-inherit"
                fontSize="medium"
                fill="currentColor"
              />
              Déconnecter
            </Box>
          </MenuItem>
        </Box>
      </Menu>
      {isModalOpen && (
        <ModalComponent
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default AdminProfile;
