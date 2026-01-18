import './FindVet.css';
import './Appointments.css';
import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

import {Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';

const drawerWidth = 270;

export default function Appointments(){
    const location = useLocation();
    const hasScrolled = useRef(false);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ownerPets, setOwnerPets] = useState([]);
    const [vets, setVets] = useState([]);

    // ΧΡΗΣΗ useLayoutEffect - τρέχει ΠΡΙΝ από το render
    useLayoutEffect(() => {
    // Αμέσως scroll στην αρχή
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });

    // Κρατάμε ότι έχουμε κάνει scroll
    hasScrolled.current = true;

    // Extra insurance - μετά από μικρή καθυστέρηση
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
        // Reset για επόμενη επίσκεψη
        hasScrolled.current = false;
    };
    }, [location.pathname]);

    useEffect(() => {
      const load = async () => {
        try {
          setLoading(true);
          const [apptRes, usersRes] = await Promise.all([
            fetch(`http://localhost:3004/appointments?ownerId=${userId}`),
            fetch(`http://localhost:3004/users`)
          ]);
          const apptData = apptRes.ok ? await apptRes.json() : [];
          const usersData = usersRes.ok ? await usersRes.json() : [];
          const owner = usersData.find((u) => String(u.id) === String(userId));
          setOwnerPets(Array.isArray(owner?.pets) ? owner.pets : []);
          setVets(usersData.filter((u) => u.role === "vet"));
          setAppointments(Array.isArray(apptData) ? apptData : []);
        } catch (e) {
          console.error(e);
          setAppointments([]);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [userId]);

    const statusMeta = (status) => {
      if (status === "confirmed") return { label: "Επιβεβαιωμένο", cls: "appt-status confirmed", icon: <EventAvailableIcon /> };
      if (status === "completed") return { label: "Πραγματοποιήθηκε", cls: "appt-status done", icon: <TaskAltIcon /> };
      if (status === "rejected" || status === "cancelled") return { label: "Ακυρωμένο", cls: "appt-status cancelled", icon: <EventBusyIcon /> };
      return { label: "Εκκρεμές", cls: "appt-status pending", icon: <PendingActionsIcon /> };
    };

    const getVetName = (vetId) =>
      vets.find((v) => String(v.id) === String(vetId))?.name +
      " " +
      (vets.find((v) => String(v.id) === String(vetId))?.surname || "") || "—";

    const getVetAddress = (vetId) =>
      vets.find((v) => String(v.id) === String(vetId))?.clinicAddress || "—";

    const getPetName = (petId) =>
      ownerPets.find((p) => String(p.id) === String(petId))?.name || "—";

    const onReject = async (id) => {
      try {
        const res = await fetch(`http://localhost:3004/appointments/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "rejected", updatedAt: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error("update failed");
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
        );
      } catch (e) {
        console.error(e);
      }
    };

    return(
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            {/* Sidebar Menu */}
            <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                top: '64px',
                height: 'calc(100% - 64px)',
                },
            }}
            variant="permanent"
            anchor="left"
            >
            
            {/* Κύριο μενού */}
            <List>
                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                    <ListItemIcon>
                    <PetsIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Τα Κατοικίδιά μου" />
                </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/find_vet`)}>
                    <ListItemIcon>
                    <SearchIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Εύρεση Κτηνίατρου" />
                </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/appointments`)} sx={{backgroundColor: '#D7D3CB'}}>
                    <ListItemIcon>
                    <CalendarMonthIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
                </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/lost_report`)}>
                    <ListItemIcon>
                    <DescriptionIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Δήλωση Απώλειας" />
                </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/found_report`)}>
                    <ListItemIcon>
                    <DescriptionIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Δήλωση Εύρεσης" />
                </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/history_report`)}>
                    <ListItemIcon>
                    <HistoryIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Ιστορικό Δηλώσεων" />
                </ListItemButton>
                </ListItem>
            </List>
            </Drawer>
            
            {/* Κύριο περιεχόμενο */}
            <Box
            component="main"
            sx={{ 
                flexGrow: 1, 
                bgcolor: 'background.default',
                minHeight: '100vh'
            }}
            >
            <header className="FindVet-main-header">
                <Box className="appt-wrap">
                  <Typography variant="h6" className="appt-title">
                    Ιστορικό / Διαχείριση των Ραντεβού μου
                  </Typography>

                  <Paper elevation={0} className="appt-frame">
                    {loading && <div className="appt-empty">Φόρτωση…</div>}
                    {!loading && appointments.length === 0 && (
                      <div className="appt-empty">— Δεν υπάρχουν ραντεβού</div>
                    )}
                    {!loading &&
                      appointments.map((a) => {
                        const meta = statusMeta(a.status);
                        return (
                          <div
                            key={a.id}
                            className="appt-card"
                            onClick={() =>
                              navigate(`/owner_main/${userId}/appointments/${a.id}`)
                            }
                          >
                            <div className="appt-icon">{meta.icon}</div>
                            <div className="appt-info">
                              <div className="appt-name">
                                <span>{a.service || "Ραντεβού"}</span>
                                <span className="appt-sep">·</span>
                                <span>{getPetName(a.petId)}</span>
                              </div>
                              <div className="appt-sub-row">
                                <span className="appt-sub">{getVetName(a.vetId)}</span>
                                <span className="appt-meta-item">
                                  <AccessTimeIcon className="appt-meta-icon" />
                                  {a.date || "—"} στις {a.time || "—"}
                                </span>
                                <span className="appt-meta-item">
                                  <PlaceIcon className="appt-meta-icon" />
                                  {getVetAddress(a.vetId)}
                                </span>
                              </div>
                            </div>
                            <div className="appt-actions">
                              <div className={meta.cls}>{meta.label}</div>
                              {(a.status === "confirmed" || a.status === "final" || a.status === "draft" || !a.status) && (
                                <Button
                                  variant="outlined"
                                  className="appt-btn reject"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReject(a.id);
                                  }}
                                >
                                  Απόρριψη
                                </Button>
                              )}
                              {(a.status === "rejected" || a.status === "cancelled") && (
                                <Button
                                  variant="outlined"
                                  className="appt-btn reschedule"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                      `/owner_main/${userId}/find_vet/${a.vetId}/arrange_meeting`
                                    );
                                  }}
                                >
                                  Αναπρογραμματισμός
                                </Button>
                              )}
                              {a.status === "completed" && (
                                <Button
                                  variant="outlined"
                                  className="appt-btn review"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                      `/owner_main/${userId}/appointments/review/${a.id}`
                                    );
                                  }}
                                >
                                  Αξιολόγηση
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </Paper>
                </Box>
            </header>
            </Box>
        </Box>
    );
}
