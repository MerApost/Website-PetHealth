import './Navigation_bar.css';
import logo from "../../pics/logo.png";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";


import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PersonIcon from '@mui/icons-material/Person';

export default function Navigationbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation(); // Για να ελέγξουμε το current path
  
  // Έλεγχος αν είμαστε στη σελίδα owner ή σε υποσελίδες του owner
  const isOwnerPage = location.pathname.startsWith('/owner');
  const isVetPage = location.pathname.startsWith('/vet') || location.pathname.startsWith('/vet_main');

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const isVetAuthed = isLoggedIn && role === "vet" && userId;
  const isOwnerAuthed = isLoggedIn && role === "owner" && userId;
  const vetBase = isVetAuthed ? `/vet_main/${userId}` : "/vet";
  const ownerBase = isOwnerAuthed ? `/owner_main/${userId}` : "/owner";
  const findVetBase = isOwnerAuthed ? `/owner_main/${userId}/find_vet` : "/find_vet";

  return (
    <AppBar position="fixed" sx={{ bgcolor: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {/* Left: Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
          <IconButton
            component={RouterLink}
            to="/main_page"
            sx={{ 
              padding: 0,           // Αφαίρεση default padding του IconButton
              '&:hover': {
                backgroundColor: 'transparent' // Αφαίρεση hover background
              }
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{ height: 50, width: 70, objectFit: "cover" }}
            />
          </IconButton>
        </Box>

        {/* Center: Main navigation links */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Button
            component={RouterLink}
            to="/main_page"
            sx={{
              color: "white",
              textDecoration: location.pathname === "/main_page" ? "underline" : "none",
              textUnderlineOffset: "3px"
            }}
          >
            ΑΡΧΙΚΗ
          </Button>
          <Button
            component={RouterLink}
            to={ownerBase}
            sx={{
              color: "white",
              minWidth: "auto",
              padding: "6px 0 6px 16px",
              textTransform: "none",
              textDecoration: isOwnerPage ? "underline" : "none",
              textUnderlineOffset: "3px"
            }}
          >
            ΙΔΙΟΚΤΗΤΗΣ
          </Button>
          <Button
            component={RouterLink}
            to={vetBase}
            sx={{
              color: "white",
              minWidth: "auto",
              padding: "6px 0 6px 16px",
              textTransform: "none",
              textDecoration: isVetPage ? "underline" : "none",
              textUnderlineOffset: "3px"
            }}
          >
            ΚΤΗΝΙΑΤΡΟΣ
          </Button>
          <Button
            component={RouterLink}
            to="/lost_pets"
            sx={{
              color: "white",
              minWidth: "auto",
              padding: "6px 0 6px 16px",
              textTransform: "none",
              textDecoration: location.pathname.startsWith("/lost_pets") ? "underline" : "none",
              textUnderlineOffset: "3px",
            }}
          >
            ΑΠΟΛΕΣΘΕΝΤΑ
          </Button>
          <Button
            component={RouterLink}
            to={findVetBase}
            sx={{
              color: "white",
              minWidth: "auto",
              padding: "6px 0 6px 16px",
              textTransform: "none",
              textDecoration: location.pathname.includes("/find_vet") ? "underline" : "none",
              textUnderlineOffset: "3px",
            }}
          >
            ΒΡΕΣ ΚΤΗΝΙΑΤΡΟ
          </Button>
        </Box>

        {/* Right: auth/profile buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
          <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
             {!isLoggedIn ? (
            <>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{
                bgcolor: "#8E5539",
                "&:hover": { bgcolor: "#7a4a32" },
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Είσοδος
            </Button>

            <Button
              component={RouterLink}
              to="/registration"
              variant="contained"
              sx={{
                bgcolor: "#E6E6E6",
                color: "black",
                "&:hover": { bgcolor: "#dcdcdc" },
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Εγγραφή
            </Button>
          </>
        ) : (
          <>
            <Button
              component={RouterLink}
              to={role === "vet" ? `${vetBase}/profile` : "/owner/profile"}
              startIcon={<PersonIcon />}
              sx={{ color: "white", textTransform: "none" }}
            >
              Προφίλ
            </Button>

            <Button
              component={RouterLink}
              to="/logout-success"
              color="error"
              variant="contained"
              onClick={() => {
                localStorage.removeItem("loggedIn");
                localStorage.removeItem("role");
                setIsLoggedIn(false);
                navigate("/logout-success");
              }}
              sx={{ textTransform: "none" }}
            >
              Αποσύνδεση
            </Button>
          </>
        )}
      </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
