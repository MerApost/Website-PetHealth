import './Navigation_bar.css';
import logo from "../../pics/logo.png";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";
import PersonIcon from '@mui/icons-material/Person';

export default function Navigationbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation(); // Για να ελέγξουμε το current path
  
  // Owner menu
  const [ownerAnchor, setOwnerAnchor] = React.useState(null);
  const ownerOpen = Boolean(ownerAnchor);

  // Vet menu
  const [vetAnchor, setVetAnchor] = React.useState(null);
  const vetOpen = Boolean(vetAnchor);

  // Vet -> Καταγραφή submenu (nested)
  const [registerAnchor, setRegisterAnchor] = React.useState(null);
  const registerOpen = Boolean(registerAnchor);

  const closeAll = () => {
    setOwnerAnchor(null);
    setVetAnchor(null);
    setRegisterAnchor(null);
  };

  // Έλεγχος αν είμαστε στη σελίδα owner ή σε υποσελίδες του owner
  const isOwnerPage = location.pathname.startsWith('/owner');
  const isVetPage = location.pathname.startsWith('/vet');

  const role = localStorage.getItem("role");

  return (
    <AppBar position="fixed" sx={{ bgcolor: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

        {/* Links / Menus */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

          {/* Owner dropdown */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              component={RouterLink}
              to="/owner"
              sx={{ 
                color: "white",
                minWidth: "auto",
                padding: "6px 0 6px 16px",
                textTransform: "none",
                textDecoration: isOwnerPage ? "underline" : "none", // Υπογράμμιση αν είμαστε σε owner page
                textUnderlineOffset: "3px"
              }}
            >
              ΙΔΙΟΚΤΗΤΗΣ
            </Button>
            
            <IconButton
              onClick={(e) => setOwnerAnchor(e.currentTarget)}
              sx={{ 
                color: "white", 
                padding: "6px",
                marginLeft: "-8px"
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>

          <Menu
            anchorEl={ownerAnchor}
            open={ownerOpen}
            onClose={closeAll}
          >
            <MenuItem component={RouterLink} to="/owner/bibl_ygeias" onClick={closeAll}>
              Βιβλιάριο Υγείας
            </MenuItem>
            <MenuItem component={RouterLink} to="/owner/lost_stat" onClick={closeAll}>
              Δήλωση Απώλειας
            </MenuItem>
            <MenuItem component={RouterLink} to="/owner/found_stat" onClick={closeAll}>
              Δήλωση Εύρεσης
            </MenuItem>
            <MenuItem component={RouterLink} to="/owner/find_vet" onClick={closeAll}>
              Εύρεση Κτηνίατρου
            </MenuItem>
            <MenuItem component={RouterLink} to="/owner/appointment" onClick={closeAll}>
              Ραντεβού
            </MenuItem>
          </Menu>

          {/* Vet dropdown */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              component={RouterLink}
              to="/vet"
              sx={{ 
                color: "white",
                minWidth: "auto",
                padding: "6px 0 6px 16px",
                textTransform: "none",
                textDecoration: isVetPage ? "underline" : "none", // Υπογράμμιση αν είμαστε σε owner page
                textUnderlineOffset: "3px"
              }}
            >
              ΚΤΗΝΙΑΤΡΟΣ
            </Button>
            
            <IconButton
              onClick={(e) => setVetAnchor(e.currentTarget)}
              sx={{ 
                color: "white", 
                padding: "6px",
                marginLeft: "-8px"
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>

          <Menu anchorEl={vetAnchor} open={vetOpen} onClose={closeAll}>
            <MenuItem component={RouterLink} to="/vet/arrange_appointment" onClick={closeAll}>
              Διαχείριση Ραντεβού
            </MenuItem>

            <MenuItem component={RouterLink} to="/vet/availability" onClick={closeAll}>
              Διαθεσιμότητα
            </MenuItem>

            <Divider />

            {/* Nested: Καταγραφή */}
            <MenuItem
              onMouseEnter={(e) => setRegisterAnchor(e.currentTarget)}
              onClick={(e) => setRegisterAnchor(e.currentTarget)}
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              Καταγραφή <ChevronRightIcon fontSize="small" />
            </MenuItem>

            <Menu
              anchorEl={registerAnchor}
              open={registerOpen}
              onClose={() => setRegisterAnchor(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem component={RouterLink} to="/vet/pet-register" onClick={closeAll}>
                Ταυτότητα Κατοικιδίου
              </MenuItem>
              <MenuItem component={RouterLink} to="/vet/microchip" onClick={closeAll}>
                Ιατρικών Πράξεων
              </MenuItem>
              <MenuItem component={RouterLink} to="/vet/registration/incident" onClick={closeAll}>
                Συμβάντος
              </MenuItem>
            </Menu>
          </Menu>

          {/* Right buttons */}
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
              to={role === "vet" ? "/vet/profile" : "/owner/profile"}
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



// import './Navigation_bar.css';
// import logo from "../../pics/logo.png";
// import Dropdown from './Dropdown';
// import { Link } from 'react-router-dom';

// function Navigationbar() {
//   return (
//     <nav className='navigation_bar'>
//       <div className='logo-container'>
//         <img
//           src={logo}
//           alt='logo'
//           className='logo-image'
//         />
//       </div>

//       <div className='nav_bar_links'>
//         <a href='/main_page' className='nav_bar_link'>Αρχική</a>

//         <Dropdown
//           title="Ιδιοκτήτης"
//           items={[
//             { label: 'Βιβλιάριο Υγείας', href: '/owner/bibl_ygeias' },
//             { label: 'Δήλωση Απώλειας', href: '/owner/lost_stat' },
//             { label: 'Δήλωση Εύρεσης', href: '/owner/found_stat' },
//             { label: 'Εύρεση Κτηνίατρου', href: '/owner/find_vet' },
//             { label: 'Ραντεβού', href: '/owner/appointment' }
//           ]}
//         />

//         <Dropdown
//           title="Κτηνίατρος"
//           items={[
//             { label: 'Διαχείριση Ραντεβού', href: '/vet/arrange_appointment' },
//             { label: 'Διαθεσιμότητα', href: '/vet/availability' },
//             {
//               label: 'Καταγραφή',
//               children: [
//                 { label: 'Ταυτότητα Κατοικιδίου', href: '/vet/register/pet_id' },
//                 { label: 'Ιατρικών Πράξεων', href: '/vet/register/med_procedures' },
//                 { label: 'Συμβάντος', href: '/vet/register/incident' }
//               ]
//             }
//           ]}
//         />

//         <div className='button-container'>
//             {/* <button className='login-button'>Είσοδος</button>
//             <button className='signin-button'>Εγγραφή</button> */}
//             <Link to="/login" className="login-button">
//                 Είσοδος
//             </Link>

//           <Link to="/register" className="signin-button">
//             Εγγραφή
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navigationbar;