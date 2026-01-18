import "./FindVet.css";
import "./OwnerAppointmentDetails.css";
import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import PetsIcon from "@mui/icons-material/Pets";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionIcon from "@mui/icons-material/Description";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";

const drawerWidth = 270;

export default function OwnerAppointmentDetails() {
  const { id: userId, appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasScrolled = React.useRef(false);
  const [appointment, setAppointment] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [pet, setPet] = React.useState(null);
  const [vet, setVet] = React.useState(null);

  React.useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    hasScrolled.current = true;
    const timer1 = setTimeout(() => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }, 10);
    const timer2 = setTimeout(() => {
      if (window.scrollY !== 0) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 50);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      hasScrolled.current = false;
    };
  }, [location.pathname]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const apptRes = await fetch(
          `http://localhost:3004/appointments/${appointmentId}`
        );
        if (!apptRes.ok) return;
        const apptData = await apptRes.json();
        setAppointment(apptData);

        if (apptData?.ownerId) {
          const ownerRes = await fetch(
            `http://localhost:3004/users/${apptData.ownerId}`
          );
          if (ownerRes.ok) {
            const ownerData = await ownerRes.json();
            setOwner(ownerData);
            const foundPet = ownerData?.pets?.find(
              (p) => String(p.id) === String(apptData.petId)
            );
            setPet(foundPet || null);
          }
        }

        if (apptData?.vetId) {
          const vetRes = await fetch(
            `http://localhost:3004/users/${apptData.vetId}`
          );
          if (vetRes.ok) {
            const vetData = await vetRes.json();
            setVet(vetData);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [appointmentId]);

  const statusMeta = (status) => {
    if (status === "confirmed") return { label: "Επιβεβαιωμένο", cls: "oad-status confirmed", icon: <EventAvailableIcon /> };
    if (status === "completed") return { label: "Πραγματοποιήθηκε", cls: "oad-status done", icon: <TaskAltIcon /> };
    if (status === "rejected" || status === "cancelled") return { label: "Ακυρωμένο", cls: "oad-status cancelled", icon: <EventBusyIcon /> };
    return { label: "Εκκρεμές", cls: "oad-status pending", icon: <PendingActionsIcon /> };
  };

  const onReject = async () => {
    if (!appointment?.id) return;
    try {
      const res = await fetch(`http://localhost:3004/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("update failed");
      setAppointment((prev) => (prev ? { ...prev, status: "rejected" } : prev));
    } catch (e) {
      console.error(e);
    }
  };

  const meta = statusMeta(appointment?.status);

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
            <ListItemButton
              onClick={() => navigate(`/owner_main/${userId}/appointments`)}
              sx={{ backgroundColor: "#D7D3CB" }}
            >
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
          <div className="oad-wrap">
            <Paper elevation={0} className="oad-card">
              <Typography className="oad-title">Πληροφορίες Ραντεβού</Typography>
              <Typography className="oad-subtitle">
                Προβολή στοιχείων ραντεβού
              </Typography>

              <div className="oad-date-row">
                <div className="oad-pill">
                  <CalendarMonthIcon className="oad-pill-icon" />
                  {appointment?.date || "—"}
                </div>
                <div className="oad-pill">
                  <AccessTimeIcon className="oad-pill-icon" />
                  {appointment?.time || "—"}
                </div>
              </div>

              <div className={meta.cls}>
                <span className="oad-status-icon">{meta.icon}</span>
                {meta.label}
              </div>

              <Paper elevation={0} className="oad-panel">
                <Typography className="oad-section-title">
                  Στοιχεία Κατοικιδίου
                </Typography>
                <div className="oad-pet">
                  <div className="oad-photo">
                    {pet?.photo ? (
                      <img src={pet.photo} alt={pet.name || "pet"} />
                    ) : (
                      <div className="oad-photo-placeholder">—</div>
                    )}
                  </div>
                  <div className="oad-grid">
                    <div>
                      <b>Όνομα:</b> {pet?.name || "—"}
                    </div>
                    <div>
                      <b>Microchip:</b> {pet?.microchip || "—"}
                    </div>
                    <div>
                      <b>Είδος:</b> {pet?.type || "—"}
                    </div>
                    <div>
                      <b>Φύλο:</b> {pet?.gender || "—"}
                    </div>
                    <div>
                      <b>Ράτσα:</b> {pet?.breed || "—"}
                    </div>
                    <div>
                      <b>Ηλικία:</b> {pet?.age ? `${pet.age} ετών` : "—"}
                    </div>
                  </div>
                </div>

                <Typography className="oad-section-title">
                  Υπηρεσίες Ραντεβού
                </Typography>
                <div className="oad-service">
                  <span>{appointment?.service || "—"}</span>
                </div>

                <Typography className="oad-section-title">
                  Σημειώσεις Ραντεβού
                </Typography>
                <div className="oad-notes">{appointment?.notes || "—"}</div>

                <Typography className="oad-section-title">Υπενθυμίσεις</Typography>
                <ol className="oad-list">
                  <li>Να είναι νηστικός για 2 ώρες πριν το ραντεβού.</li>
                  <li>Να προσκομίσει δείγμα ούρων, αν αυτό είναι δυνατόν.</li>
                </ol>

                <Typography className="oad-section-title">Κτηνίατρος</Typography>
                <div className="oad-vet">
                  <div className="oad-vet-photo">
                    {vet?.photo ? (
                      <img src={vet.photo} alt="vet" />
                    ) : (
                      <div className="oad-photo-placeholder">—</div>
                    )}
                  </div>
                  <div className="oad-vet-info">
                    <div className="oad-vet-name">
                      {vet ? `${vet.name || ""} ${vet.surname || ""}`.trim() : "—"}
                    </div>
                    <div className="oad-vet-line">
                      <PhoneIcon className="oad-vet-icon" />
                      {vet?.phone || "—"}
                    </div>
                    <div className="oad-vet-line">
                      <EmailIcon className="oad-vet-icon" />
                      {vet?.email || "—"}
                    </div>
                    <div className="oad-vet-line">
                      <PlaceIcon className="oad-vet-icon" />
                      {vet?.clinicAddress || "—"}
                    </div>
                  </div>
                </div>
              </Paper>

              <div className="oad-actions">
                <Button
                  variant="outlined"
                  className="oad-btn reject"
                  onClick={onReject}
                >
                  Απόρριψη
                </Button>
                <Button
                  variant="outlined"
                  className="oad-btn reschedule"
                  onClick={() =>
                    navigate(`/owner_main/${userId}/find_vet/${appointment?.vetId}/arrange_meeting`)
                  }
                  disabled={!appointment?.vetId}
                >
                  Αναπρογραμματισμός
                </Button>
                <Button
                  variant="outlined"
                  className="oad-btn back"
                  onClick={() => navigate(`/owner_main/${userId}/appointments`)}
                >
                  Επιστροφή
                </Button>
              </div>
            </Paper>
          </div>
        </header>
      </Box>
    </Box>
  );
}
