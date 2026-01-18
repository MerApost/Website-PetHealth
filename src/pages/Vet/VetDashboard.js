import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate, useParams } from "react-router-dom";

const drawerWidth = 270;

export default function VetDashboard({ active }) {
  const navigate = useNavigate();
  const { vetId: vetIdParam } = useParams();
  const vetId = (vetIdParam || localStorage.getItem("userId") || "").trim();

  const go = (path) => {
    if (!vetId) {
      navigate("/login");
      return;
    }
    navigate(`/vet_main/${vetId}${path}`);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: "64px",
          height: "calc(100% - 64px)",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => go("/microchip")}
            sx={{ backgroundColor: active === "microchip" ? "#D7D3CB" : "transparent" }}
          >
            <ListItemIcon>
              <DescriptionIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Καταγραφή Ιατρικών Πράξεων - Συμβάντων" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => go("/arrange_appointment")}
            sx={{ backgroundColor: active === "appointments" ? "#D7D3CB" : "transparent" }}
          >
            <ListItemIcon>
              <SearchIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Διαχείριση Ραντεβού" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => go("/schedule")}
            sx={{ backgroundColor: active === "schedule" ? "#D7D3CB" : "transparent" }}
          >
            <ListItemIcon>
              <CalendarMonthIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Ορισμός Διαθεσιμότητας" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => go("/pet-register")}
            sx={{ backgroundColor: active === "pet-register" ? "#D7D3CB" : "transparent" }}
          >
            <ListItemIcon>
              <PetsIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Καταγραφή Ταυτότητας Κατοικιδίου" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => go("/pet-history")}
            sx={{ backgroundColor: active === "pet-history" ? "#D7D3CB" : "transparent" }}
          >
            <ListItemIcon>
              <HistoryIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Ιστορικό Καταχωρίσεων" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon>
              <HistoryIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Προβολή Αξιολογήσεων" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
