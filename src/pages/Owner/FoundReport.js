import './FindVet.css';
import './OwnerReports.css';
import '../Vet/Request/LossRequest.css';
import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

import {Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import Pet_Types from '../Lost_Pets/Data/Pet_Types';
import { Pet_Breeds } from '../Lost_Pets/Data/Pet_Breeds';

const drawerWidth = 270;

export default function FoundReport(){
    const location = useLocation();
    const hasScrolled = useRef(false);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("editId");

    const [pets, setPets] = useState([]);
    const [saving, setSaving] = useState(false);
    const [submittedFinal, setSubmittedFinal] = useState(false);
    const [createdAt, setCreatedAt] = useState("");
    const [form, setForm] = useState({
      contactFirstName: "",
      contactLastName: "",
      contactPhone: "",
      contactEmail: "",
      contactNotes: "",
      petNameMicrochip: "",
      petMicrochip: "",
      petType: "",
      petBreed: "",
      petColor: "",
      petPhoto: "",
      petDescription: "",
      foundDate: "",
      foundArea: "",
    });

    const updateForm = (key, value) =>
      setForm((prev) => ({ ...prev, [key]: value }));

    const countWords = (text) => {
      const s = String(text || "").trim();
      if (!s) return 0;
      return s.split(/\s+/).filter(Boolean).length;
    };

    const extractMicrochip = (value) => {
      const s = String(value || "");
      if (!s.includes("-")) return "";
      return s.split("-").slice(1).join("-").trim();
    };

    const updatePetLostFlag = async (nextLost, ownerId, petId) => {
      if (!ownerId) return;
      const res = await fetch(`http://localhost:3004/users/${ownerId}`);
      if (!res.ok) return;
      const owner = await res.json();
      if (!Array.isArray(owner?.pets)) return;
      const updatedPets = owner.pets.map((p) => {
        if (String(p.id) !== String(petId)) {
          return p;
        }
        return { ...p, isLost: nextLost };
      });
      await fetch(`http://localhost:3004/users/${ownerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pets: updatedPets }),
      });
    };

    const findLostPetByMicrochip = async (microchip) => {
      if (!microchip) return null;
      const res = await fetch(
        `http://localhost:3004/lostPets?microchip=${microchip}`
      );
      const data = res.ok ? await res.json() : [];
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    };

    const removeLostPet = async (microchip) => {
      if (!microchip) return;
      const res = await fetch(
        `http://localhost:3004/lostPets?microchip=${microchip}`
      );
      const data = res.ok ? await res.json() : [];
      if (!Array.isArray(data)) return;
      await Promise.all(
        data.map((item) =>
          fetch(`http://localhost:3004/lostPets/${item.id}`, {
            method: "DELETE",
          })
        )
      );
    };

    const validateForm = () => {
      const requiredKeys = [
        "petType",
        "petNameMicrochip",
        "petMicrochip",
        "foundArea",
        "foundDate",
        "contactFirstName",
        "contactLastName",
        "contactPhone",
        "contactEmail",
        "contactNotes",
      ];

      const hasEmpty = requiredKeys.some(
        (k) => String(form[k] || "").trim() === ""
      );
      if (hasEmpty) {
        alert("Συμπλήρωσε όλα τα υποχρεωτικά πεδία.");
        return false;
      }
      if (countWords(form.petDescription) > 50) {
        alert("Η περιγραφή ζώου πρέπει να είναι έως 50 λέξεις.");
        return false;
      }
      if (countWords(form.contactNotes) > 50) {
        alert("Οι επιπλέον πληροφορίες πρέπει να είναι έως 50 λέξεις.");
        return false;
      }
      return true;
    };

    useEffect(() => {
      const loadOwner = async () => {
        try {
          const res = await fetch(`http://localhost:3004/users/${userId}`);
          if (!res.ok) return;
          const data = await res.json();
          setPets(Array.isArray(data?.pets) ? data.pets : []);
        } catch (e) {
          console.error(e);
        }
      };
      loadOwner();
    }, [userId]);

    useEffect(() => {
      const loadEdit = async () => {
        if (!editId) return;
        try {
          const res = await fetch(`http://localhost:3004/lifeEvents/${editId}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data?.type !== "Εύρεση") return;
          setCreatedAt(data.createdAt || "");
          setForm((prev) => ({ ...prev, ...(data.details || {}) }));
        } catch (e) {
          console.error(e);
        }
      };
      loadEdit();
    }, [editId]);

    const save = async (status) => {
      if (!validateForm()) return;
      const microchip = String(form.petMicrochip || "").trim();
      if (!microchip) {
        alert("Συμπλήρωσε το microchip του κατοικιδίου.");
        return;
      }
      const lostEntry = await findLostPetByMicrochip(microchip);
      if (!lostEntry) {
        alert("Το microchip δεν υπάρχει στη λίστα απολεσθέντων κατοικιδίων.");
        return;
      }
      setSaving(true);
      try {
        const payload = {
          ownerId: userId,
          petId: "",
          type: "Εύρεση",
          date: form.foundDate,
          details: form,
          status,
          createdAt: createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        let res;
        if (editId) {
          res = await fetch(`http://localhost:3004/lifeEvents/${editId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          res = await fetch("http://localhost:3004/lifeEvents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
        if (!res.ok) throw new Error("save failed");

        if (status === "final") {
          await updatePetLostFlag(false, lostEntry.ownerId, lostEntry.petId);
          await removeLostPet(microchip);
          setSubmittedFinal(true);
        } else {
          navigate(`/owner_main/${userId}/history_report`);
        }
      } catch (e) {
        console.error(e);
        alert("Αποτυχία αποθήκευσης.");
      } finally {
        setSaving(false);
      }
    };

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
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/found_report`)} sx={{backgroundColor: '#D7D3CB'}}>
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
                <Box className="or-content">
                    <Typography variant="h6" className="or-title">
                        Δήλωση Εύρεσης
                    </Typography>

                    {submittedFinal ? (
                      <Paper elevation={0} className="or-success">
                        <div className="or-success-icon">✓</div>
                        <div className="or-success-text">Επιτυχής Υποβολή Δήλωσης</div>
                        <RouterLink
                          to={`/owner_main/${userId}`}
                          className="or-success-link"
                        >
                          Επιστροφή στην Αρχική
                        </RouterLink>
                      </Paper>
                    ) : (
                      <Paper elevation={0} className="lr-card or-form">
                        <div className="lr-section">
                          <Typography className="lr-section-title">Στοιχεία Κατοικιδίου</Typography>
                          <Box className="lr-grid">
                            <TextField
                              select
                              size="small"
                              label="Είδος: *"
                              value={form.petType}
                              onChange={(e) => updateForm("petType", e.target.value)}
                            >
                              {Pet_Types.map((p) => (
                                <MenuItem key={p.label} value={p.label}>
                                  {p.label}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              select
                              size="small"
                              label="Ράτσα:"
                              value={form.petBreed}
                              onChange={(e) => updateForm("petBreed", e.target.value)}
                            >
                              {Pet_Breeds.map((b) => (
                                <MenuItem key={b.value || b.label} value={b.value}>
                                  {b.label}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              size="small"
                              label="Χρώμα:"
                              value={form.petColor}
                              onChange={(e) => updateForm("petColor", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label="Όνομα - Microchip: *"
                              value={form.petNameMicrochip}
                              onChange={(e) => {
                                const value = e.target.value;
                                updateForm("petNameMicrochip", value);
                                const micro = extractMicrochip(value);
                                if (micro) {
                                  updateForm("petMicrochip", micro);
                                } else if (value.trim()) {
                                  updateForm("petMicrochip", value.trim());
                                }
                              }}
                            />
                            <TextField
                              size="small"
                              type="url"
                              label="Αρχείο με φωτογραφία του κατοικιδίου (URL):"
                              value={form.petPhoto}
                              onChange={(e) => updateForm("petPhoto", e.target.value)}
                            />
                            <Box className="lr-textarea">
                              <TextField
                                multiline
                                minRows={4}
                                fullWidth
                                label="Περιγραφή Ζώου:"
                                value={form.petDescription}
                                onChange={(e) => updateForm("petDescription", e.target.value)}
                              />
                              <div className="lr-counter">{countWords(form.petDescription)}/50 λέξεις</div>
                            </Box>
                          </Box>
                        </div>

                        <div className="lr-section">
                          <Typography className="lr-section-title">Τοποθεσία & Ημ/νία Εύρεσης</Typography>
                          <Box className="lr-grid">
                            <TextField
                              size="small"
                              label="Τοποθεσία Εύρεσης: *"
                              value={form.foundArea}
                              onChange={(e) => updateForm("foundArea", e.target.value)}
                            />
                            <TextField
                              size="small"
                              type="date"
                              label="Ημερομηνία Εύρεσης: *"
                              InputLabelProps={{ shrink: true }}
                              value={form.foundDate}
                              onChange={(e) => updateForm("foundDate", e.target.value)}
                              inputProps={{ max: new Date().toISOString().slice(0, 10) }}
                            />
                          </Box>
                        </div>

                        <div className="lr-section">
                          <Typography className="lr-section-title">Στοιχεία Επικοινωνίας</Typography>
                          <Box className="lr-grid">
                            <TextField
                              size="small"
                              label="Όνομα: *"
                              value={form.contactFirstName}
                              onChange={(e) => updateForm("contactFirstName", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label="Τηλέφωνο: *"
                              value={form.contactPhone}
                              onChange={(e) => updateForm("contactPhone", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label="Επώνυμο: *"
                              value={form.contactLastName}
                              onChange={(e) => updateForm("contactLastName", e.target.value)}
                            />
                            <TextField
                              size="small"
                              type="email"
                              label="E-mail: *"
                              value={form.contactEmail}
                              onChange={(e) => updateForm("contactEmail", e.target.value)}
                            />
                            <Box className="lr-textarea">
                              <TextField
                                multiline
                                minRows={4}
                                fullWidth
                                label="Επιπλέον Πληροφορίες: *"
                                value={form.contactNotes}
                                onChange={(e) => updateForm("contactNotes", e.target.value)}
                              />
                              <div className="lr-counter">{countWords(form.contactNotes)}/50 λέξεις</div>
                            </Box>
                          </Box>
                        </div>

                        <div className="or-actions">
                          <Button
                            variant="outlined"
                            className="or-btn"
                            onClick={() => navigate(`/owner_main/${userId}`)}
                          >
                            Επιστροφή
                          </Button>
                          <Button
                            variant="outlined"
                            className="or-btn-blue"
                            onClick={() => save("draft")}
                            disabled={saving}
                          >
                            Προσωρινή αποθήκευση
                          </Button>
                          <Button
                            variant="contained"
                            className="or-btn-green"
                            onClick={() => save("final")}
                            disabled={saving}
                          >
                            Οριστική Υποβολή
                          </Button>
                        </div>
                      </Paper>
                    )}
                </Box>
            </header>
            </Box>
        </Box>
    );
}
