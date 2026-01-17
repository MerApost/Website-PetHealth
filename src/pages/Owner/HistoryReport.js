import './FindVet.css';
import './OwnerReports.css';
import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

import {Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 270;

export default function HistoryReport(){
    const location = useLocation();
    const hasScrolled = useRef(false);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("loss");

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
          const res = await fetch(`http://localhost:3004/lifeEvents?ownerId=${userId}`);
          const data = res.ok ? await res.json() : [];
          const filtered = Array.isArray(data)
            ? data.filter((e) => e.type === "Απώλεια" || e.type === "Εύρεση")
            : [];
          setEvents(filtered);
        } catch (e) {
          console.error(e);
          setEvents([]);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [userId]);

    const handleDelete = async (id) => {
      try {
        await fetch(`http://localhost:3004/lifeEvents/${id}`, { method: "DELETE" });
        setEvents((prev) => prev.filter((e) => e.id !== id));
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
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/appointments`)}>
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
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/history_report`)} sx={{backgroundColor: '#D7D3CB'}}>
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
                <Box className="or-content">
                    <Typography variant="h6" className="or-title">
                        Ιστορικό Δηλώσεων
                    </Typography>

                    {loading && <div>Φόρτωση…</div>}

                    {!loading && (
                      <div className="or-history-frame">
                        <Tabs
                          value={activeTab}
                          onChange={(_e, newVal) => setActiveTab(newVal)}
                          className="or-tabs"
                        >
                          <Tab label="Δηλώσεις Απώλειας" value="loss" />
                          <Tab label="Δηλώσεις Εύρεσης" value="found" />
                        </Tabs>
                        {events
                          .filter((e) =>
                            activeTab === "loss" ? e.type === "Απώλεια" : e.type === "Εύρεση"
                          )
                          .map((event) => {
                            const details = event.details || {};
                            const statusLabel =
                              event.status === "draft" ? "Εκκρεμής" : "Οριστικοποιημένη";
                            const statusClass =
                              event.status === "draft" ? "or-status-pill is-draft" : "or-status-pill is-final";
                            return (
                              <Paper key={event.id} elevation={0} className="or-card">
                                <div className="or-status-right">
                                  <div className={statusClass}>{statusLabel}</div>
                                </div>
                                <div className="or-photo">
                                  {details.petPhoto ? (
                                    <img src={details.petPhoto} alt={details.petName || "pet"} />
                                  ) : (
                                    "—"
                                  )}
                                </div>
                                <div className="or-info">
                                  <div><b>{details.petName || "Κατοικίδιο"}</b></div>
                                  <div>{details.petType || "—"}, {details.petBreed || "—"}</div>
                                  <div>Microchip: {details.petMicrochip || "—"}</div>
                                  <div>Ημ/νία: {event.date || details.lossDate || "—"}</div>
                                  <div className="or-actions-inline">
                                    {event.status === "draft" ? (
                                      <>
                                        <Button
                                          variant="outlined"
                                          className="or-btn-red"
                                          onClick={() => handleDelete(event.id)}
                                        >
                                          Διαγραφή
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          className="or-btn-blue"
                                      onClick={() =>
                                        navigate(
                                          event.type === "Εύρεση"
                                            ? `/owner_main/${userId}/found_report?editId=${event.id}`
                                            : `/owner_main/${userId}/lost_report?editId=${event.id}`
                                        )
                                      }
                                        >
                                          Επεξεργασία
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        className="or-btn"
                                        onClick={() =>
                                          navigate(
                                            `/owner_main/${userId}/history_report/${event.id}`
                                          )
                                        }
                                      >
                                        Προεπισκόπηση
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Paper>
                            );
                          })}
                        {events.filter((e) =>
                          activeTab === "loss" ? e.type === "Απώλεια" : e.type === "Εύρεση"
                        ).length === 0 && (
                          <div>— Δεν υπάρχουν καταχωρίσεις</div>
                        )}
                      </div>
                    )}
                </Box>
            </header>
            </Box>
        </Box>
    );
}
