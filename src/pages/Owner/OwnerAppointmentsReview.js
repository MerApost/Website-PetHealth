import * as React from "react";
import "./FindVet.css";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import BackButton from "../../components/BackButton/BackButton";

export default function OwnerAppointmentsReview() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";
  const drawerWidth = 270;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
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
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
              <ListItemIcon>
                <PetsIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Τα Κατοικίδιά μου" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/find_vet`)}>
              <ListItemIcon>
                <SearchIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Εύρεση Κτηνίατρου" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/appointments`)}>
              <ListItemIcon>
                <CalendarMonthIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/lost_report`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Δήλωση Απώλειας" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/found_report`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Δήλωση Εύρεσης" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/history_report`)}>
              <ListItemIcon>
                <HistoryIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Ιστορικό Δηλώσεων" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <header className="FindVet-main-header">
          <Paper elevation={0} style={{ padding: "18px 20px", borderRadius: 10 }}>
            <Typography variant="h6" style={{ marginBottom: 6 }}>
              Αξιολόγηση Ραντεβού
            </Typography>
            <Typography variant="body2">
              Η σελίδα αξιολόγησης (ID: {appointmentId}) θα προστεθεί αργότερα.
            </Typography>
          </Paper>
          <Box style={{ height: 30 }} />
          <BackButton />
        </header>
      </Box>
    </Box>
  );
}
