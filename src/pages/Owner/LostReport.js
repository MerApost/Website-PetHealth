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
import { GenderOptions } from '../Lost_Pets/Data/GenderOptions';

const drawerWidth = 270;

export default function LostReport(){
    const location = useLocation();
    const hasScrolled = useRef(false);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("editId");

    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState("");
    const [saving, setSaving] = useState(false);
    const [submittedFinal, setSubmittedFinal] = useState(false);
    const [createdAt, setCreatedAt] = useState("");
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
      ownerFirstName: "",
      ownerLastName: "",
      ownerPhone: "",
      ownerAddress: "",
      ownerEmail: "",
      petName: "",
      petType: "",
      petMicrochip: "",
      petPhoto: "",
      petBreed: "",
      petAge: "",
      petColor: "",
      petGender: "",
      lossDate: "",
      lossArea: "",
      lossDescription: "",
    });

    const updateForm = (key, value) =>
      setForm((prev) => ({ ...prev, [key]: value }));

    const sanitizePhone = (value) =>
      String(value || "")
        .replace(/\D/g, "")
        .slice(0, 10);

    const handleChange = (key, value) => {
      const nextValue = key === "ownerPhone" ? sanitizePhone(value) : value;
      updateForm(key, nextValue);
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    };

    const countWords = (text) => {
      const s = String(text || "").trim();
      if (!s) return 0;
      return s.split(/\s+/).filter(Boolean).length;
    };

    const toLostPetsDate = (value) => {
      if (!value) return "";
      const s = String(value);
      if (s.includes("-")) {
        const [y, m, d] = s.split("-");
        if (y && m && d) return `${d}/${m}/${y}`;
      }
      return s;
    };

    const updatePetLostFlag = async (nextLost, microchipValue) => {
      const res = await fetch(`http://localhost:3004/users/${userId}`);
      if (!res.ok) return;
      const owner = await res.json();
      if (!Array.isArray(owner?.pets)) return;
      const microchip = String(microchipValue || "").trim();
      const updatedPets = owner.pets.map((p) => {
        const matchId = String(p.id) === String(selectedPetId);
        const matchChip = microchip && String(p.microchip || "").trim() === microchip;
        if (!matchId && !matchChip) {
          return p;
        }
        return { ...p, isLost: nextLost };
      });
      await fetch(`http://localhost:3004/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pets: updatedPets }),
      });
    };

    const upsertLostPet = async () => {
      const microchip = String(form.petMicrochip || "").trim();
      const res = await fetch(
        `http://localhost:3004/lostPets?microchip=${microchip}`
      );
      const data = res.ok ? await res.json() : [];
      const existing = Array.isArray(data) && data.length > 0 ? data[0] : null;
      const payload = {
        ownerId: userId,
        petId: Number.isNaN(Number(selectedPetId)) ? selectedPetId : Number(selectedPetId),
        microchip,
        lostDate: toLostPetsDate(form.lossDate),
        location: form.lossArea,
        additionalInfo: form.lossDescription,
        status: "lost",
      };

      if (existing?.id) {
        await fetch(`http://localhost:3004/lostPets/${existing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return;
      }

      await fetch("http://localhost:3004/lostPets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    };

    const validateForm = () => {
      const requiredKeys = [
        "ownerFirstName",
        "ownerLastName",
        "ownerPhone",
        "ownerEmail",
        "petName",
        "petType",
        "petMicrochip",
        "petBreed",
        "petAge",
        "petGender",
        "lossDate",
        "lossArea",
        "lossDescription",
      ];

      const nextErrors = {};
      requiredKeys.forEach((k) => {
        if (String(form[k] || "").trim() === "") {
          nextErrors[k] = "Υποχρεωτικό πεδίο.";
        }
      });

      const email = String(form.ownerEmail || "").trim();
      if (email && !email.includes("@")) {
        nextErrors.ownerEmail = "Βάλε σωστό e-mail (με @).";
      }

      const phone = String(form.ownerPhone || "").trim();
      if (phone && phone.length > 10) {
        nextErrors.ownerPhone = "Έως 10 ψηφία.";
      }

      const today = new Date().toISOString().slice(0, 10);
      if (form.lossDate && form.lossDate > today) {
        nextErrors.lossDate = "Δεν επιτρέπεται μελλοντική ημερομηνία.";
      }

      if (countWords(form.lossDescription) > 50) {
        nextErrors.lossDescription = "Έως 50 λέξεις.";
      }

      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    };

    const loadOwner = async () => {
      try {
        const res = await fetch(`http://localhost:3004/users/${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        const ownerPets = Array.isArray(data?.pets) ? data.pets : [];
        setPets(ownerPets);
        setForm((prev) => ({
          ...prev,
          ownerFirstName: data?.name || prev.ownerFirstName,
          ownerLastName: data?.surname || prev.ownerLastName,
          ownerPhone: data?.phone || prev.ownerPhone,
          ownerAddress: data?.address || prev.ownerAddress,
          ownerEmail: data?.email || prev.ownerEmail,
        }));
        if (!selectedPetId && ownerPets.length > 0) {
          const first = ownerPets[0];
          setSelectedPetId(String(first.id));
          setForm((prev) => ({
            ...prev,
            petName: first.name || prev.petName,
            petType: first.type || prev.petType,
            petMicrochip: first.microchip || prev.petMicrochip,
            petBreed: first.breed || prev.petBreed,
            petAge: first.age || prev.petAge,
            petColor: first.color || prev.petColor,
            petGender: first.gender || prev.petGender,
            petPhoto: first.photo || prev.petPhoto,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    const loadEdit = async () => {
      if (!editId) return;
      try {
        const res = await fetch(`http://localhost:3004/lifeEvents/${editId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.type !== "Απώλεια") return;
        setCreatedAt(data.createdAt || "");
        setForm((prev) => ({ ...prev, ...(data.details || {}) }));
        if (data.petId) setSelectedPetId(String(data.petId));
      } catch (e) {
        console.error(e);
      }
    };

    useEffect(() => {
      loadOwner();
    }, [userId]);

    useEffect(() => {
      loadEdit();
    }, [editId]);

    const handlePetSelect = (value) => {
      setSelectedPetId(value);
      const pet = pets.find((p) => String(p.id) === String(value));
      if (!pet) return;
      setForm((prev) => ({
        ...prev,
        petName: pet.name || prev.petName,
        petType: pet.type || prev.petType,
        petMicrochip: pet.microchip || prev.petMicrochip,
        petBreed: pet.breed || prev.petBreed,
        petAge: pet.age || prev.petAge,
        petColor: pet.color || prev.petColor,
        petGender: pet.gender || prev.petGender,
        petPhoto: pet.photo || prev.petPhoto,
      }));
      setErrors((prev) => ({
        ...prev,
        petName: "",
        petType: "",
        petMicrochip: "",
        petBreed: "",
        petAge: "",
        petGender: "",
      }));
    };

    const save = async (status) => {
      if (!validateForm()) return;
      setSaving(true);
      try {
        const payload = {
          ownerId: userId,
          petId: selectedPetId || "",
          type: "Απώλεια",
          date: form.lossDate,
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
          await updatePetLostFlag(true, form.petMicrochip);
          await upsertLostPet();
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
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/lost_report`)} sx={{backgroundColor: '#D7D3CB'}}>
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
                <Box className="or-content">
                    <Typography variant="h6" className="or-title">
                        Δήλωση Απώλειας
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
                          <Typography className="lr-section-title">Στοιχεία Ιδιοκτήτη</Typography>
                          <Box className="lr-grid">
                            <TextField
                              size="small"
                              label="Όνομα: *"
                              value={form.ownerFirstName}
                              onChange={(e) => handleChange("ownerFirstName", e.target.value)}
                              error={Boolean(errors.ownerFirstName)}
                              helperText={errors.ownerFirstName || ""}
                            />
                            <TextField
                              size="small"
                              label="Διεύθυνση Κατοικίας:"
                              value={form.ownerAddress}
                              onChange={(e) => handleChange("ownerAddress", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label="Επώνυμο: *"
                              value={form.ownerLastName}
                              onChange={(e) => handleChange("ownerLastName", e.target.value)}
                              error={Boolean(errors.ownerLastName)}
                              helperText={errors.ownerLastName || ""}
                            />
                            <TextField
                              size="small"
                              type="email"
                              label="E-mail: *"
                              value={form.ownerEmail}
                              onChange={(e) => handleChange("ownerEmail", e.target.value)}
                              error={Boolean(errors.ownerEmail)}
                              helperText={errors.ownerEmail || ""}
                            />
                            <TextField
                              size="small"
                              label="Τηλέφωνο: *"
                              value={form.ownerPhone}
                              onChange={(e) => handleChange("ownerPhone", e.target.value)}
                              error={Boolean(errors.ownerPhone)}
                              helperText={errors.ownerPhone || ""}
                              inputProps={{ inputMode: "numeric", maxLength: 10 }}
                            />
                          </Box>
                        </div>

                        <div className="lr-section">
                          <Typography className="lr-section-title">Στοιχεία Κατοικιδίου</Typography>
                          <Box className="lr-grid">
                            <TextField
                              select
                              size="small"
                              label="Όνομα Κατοικιδίου: *"
                              value={selectedPetId}
                              onChange={(e) => handlePetSelect(e.target.value)}
                              error={Boolean(errors.petName)}
                              helperText={errors.petName || ""}
                            >
                              {pets.length === 0 && (
                                <MenuItem value="">—</MenuItem>
                              )}
                              {pets.map((pet) => (
                                <MenuItem key={pet.id} value={String(pet.id)}>
                                  {pet.name}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              select
                              size="small"
                              label="Ράτσα: *"
                              value={form.petBreed}
                              onChange={(e) => handleChange("petBreed", e.target.value)}
                              error={Boolean(errors.petBreed)}
                              helperText={errors.petBreed || ""}
                            >
                              {Pet_Breeds.map((b) => (
                                <MenuItem key={b.value || b.label} value={b.value}>
                                  {b.label}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              select
                              size="small"
                              label="Είδος: *"
                              value={form.petType}
                              onChange={(e) => handleChange("petType", e.target.value)}
                              error={Boolean(errors.petType)}
                              helperText={errors.petType || ""}
                            >
                              {Pet_Types.map((p) => (
                                <MenuItem key={p.label} value={p.label}>
                                  {p.label}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              size="small"
                              label="Ηλικία (έτη): *"
                              value={form.petAge}
                              onChange={(e) => handleChange("petAge", e.target.value)}
                              error={Boolean(errors.petAge)}
                              helperText={errors.petAge || ""}
                            />
                            <TextField
                              size="small"
                              label="Αριθμός Microchip: *"
                              value={form.petMicrochip}
                              onChange={(e) => handleChange("petMicrochip", e.target.value)}
                              error={Boolean(errors.petMicrochip)}
                              helperText={errors.petMicrochip || ""}
                            />
                            <TextField
                              size="small"
                              label="Χρώμα:"
                              value={form.petColor}
                              onChange={(e) => handleChange("petColor", e.target.value)}
                            />
                            <TextField
                              size="small"
                              type="url"
                              label="Φωτογραφία κατοικιδίου (URL):"
                              value={form.petPhoto}
                              onChange={(e) => handleChange("petPhoto", e.target.value)}
                            />
                            <TextField
                              select
                              size="small"
                              label="Φύλο: *"
                              value={form.petGender}
                              onChange={(e) => handleChange("petGender", e.target.value)}
                              error={Boolean(errors.petGender)}
                              helperText={errors.petGender || ""}
                            >
                              {GenderOptions.map((g) => (
                                <MenuItem key={g.value || g.label} value={g.value}>
                                  {g.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Box>
                        </div>

                        <div className="lr-section">
                          <Typography className="lr-section-title">Επιπλέον Στοιχεία</Typography>
                          <Box className="lr-grid">
                            <TextField
                              size="small"
                              type="date"
                              label="Ημερομηνία Απώλειας: *"
                              InputLabelProps={{ shrink: true }}
                              value={form.lossDate}
                              onChange={(e) => handleChange("lossDate", e.target.value)}
                              inputProps={{ max: new Date().toISOString().slice(0, 10) }}
                              error={Boolean(errors.lossDate)}
                              helperText={errors.lossDate || ""}
                            />
                            <TextField
                              size="small"
                              label="Περιοχή Απώλειας: *"
                              value={form.lossArea}
                              onChange={(e) => handleChange("lossArea", e.target.value)}
                              error={Boolean(errors.lossArea)}
                              helperText={errors.lossArea || ""}
                            />
                            <Box className="lr-textarea">
                              <TextField
                                multiline
                                minRows={4}
                                fullWidth
                                label="Περιγραφή Περιστατικού: *"
                                value={form.lossDescription}
                                onChange={(e) => handleChange("lossDescription", e.target.value)}
                                error={Boolean(errors.lossDescription)}
                                helperText={errors.lossDescription || ""}
                              />
                              <div className="lr-counter">{countWords(form.lossDescription)}/50 λέξεις</div>
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
