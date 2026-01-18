import './FindVet.css';
import './FindVetArrangeMeeting.css';
import * as React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepButton,
  StepConnector,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';

const drawerWidth = 270;

const steps = [
  "Επέλεξε ημέρα και ώρα",
  "Επέλεξε υπηρεσία/λόγο επίσκεψης",
  "Συμπλήρωσε τα στοιχεία χρήστη",
  "Υποβολή Ραντεβού",
  "Επιβεβαίωση Ραντεβού",
];

const StepLine = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "rgba(0,0,0,0.4)",
    borderTopWidth: 1,
  },
}));

const StepCircle = styled("div")(({ ownerState }) => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "1px solid rgba(0,0,0,0.35)",
  background: ownerState.active
    ? "#b99a8f"
    : ownerState.completed
    ? "#ddd1cb"
    : "#c9b1a6",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 12,
}));

export default function FindVetArrangeMeeting() {
  const location = useLocation();
  const hasScrolled = useRef(false);
  const { id: userId, vetid } = useParams();
  const navigate = useNavigate();

  const [vetData, setVetData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [submittedFinal, setSubmittedFinal] = React.useState(false);
  const [schedule, setSchedule] = React.useState({ weekly: {}, customSlots: [] });
  const [timeOptions, setTimeOptions] = React.useState([]);
  const [vetAppointments, setVetAppointments] = React.useState([]);

  const [ownerInfo, setOwnerInfo] = React.useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
  });
  const [pets, setPets] = React.useState([]);
  const [form, setForm] = React.useState({
    date: "",
    time: "",
    service: "",
    petId: "",
    notes: "",
    urgent: "",
  });

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
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
    window.scrollTo(0, 0);
  }, [activeStep]);

  React.useEffect(() => {
    const fetchVetData = async () => {
      if (!vetid) {
        setError('Δεν βρέθηκε ID κτηνίατρου στο URL');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3004/users/${vetid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.role !== 'vet') {
          throw new Error('Ο χρήστης δεν είναι κτηνίατρος');
        }
        
        const formattedVetData = {
          id: data.id,
          name: `${data.name} ${data.surname}`,
          services: Array.isArray(data.services) ? data.services : [],
          clinicAddress: data.clinicAddress || "",
        };
        
        setVetData(formattedVetData);
      } catch (err) {
        console.error('Error fetching vet data:', err);
        setError(`Σφάλμα φόρτωσης δεδομένων: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVetData();
  }, [vetid]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get("step");
    const stored = sessionStorage.getItem("arrangeMeetingForm");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.form) setForm((prev) => ({ ...prev, ...parsed.form }));
        if (parsed?.ownerInfo) setOwnerInfo((prev) => ({ ...prev, ...parsed.ownerInfo }));
      } catch (e) {
        console.error(e);
      } finally {
        sessionStorage.removeItem("arrangeMeetingForm");
      }
    }
    if (step === "3") {
      setActiveStep(2);
    }
  }, [location.search]);

  React.useEffect(() => {
    const loadSchedule = async () => {
      if (!vetid) return;
      try {
        const res = await fetch(`http://localhost:3004/vetSchedules?vetId=${vetid}`);
        if (!res.ok) return;
        const data = await res.json();
        const existing = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (!existing) return;
        setSchedule({
          weekly: existing.weekly || {},
          customSlots: Array.isArray(existing.customSlots) ? existing.customSlots : [],
        });
      } catch (e) {
        console.error(e);
      }
    };
    loadSchedule();
  }, [vetid]);

  React.useEffect(() => {
    const loadOwner = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:3004/users/${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        setOwnerInfo({
          name: data?.name || "",
          surname: data?.surname || "",
          phone: data?.phone || "",
          email: data?.email || "",
        });
        const ownerPets = Array.isArray(data?.pets) ? data.pets : [];
        setPets(ownerPets);
        if (!form.petId && ownerPets.length > 0) {
          setForm((prev) => ({ ...prev, petId: String(ownerPets[0].id) }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadOwner();
  }, [userId, form.petId]);

  const getDayKey = (dateString) => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const day = d.getDay();
    return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][day];
  };

  const matchesRepeat = (slot, date) => {
    if (!slot || !slot.date || !date) return false;
    const s = new Date(slot.date);
    const d = new Date(date);
    if (Number.isNaN(s.getTime()) || Number.isNaN(d.getTime())) return false;
    if (slot.repeat === "yearly") {
      return s.getDate() === d.getDate() && s.getMonth() === d.getMonth();
    }
    if (slot.repeat === "monthly") {
      return s.getDate() === d.getDate();
    }
    if (slot.repeat === "weekly") {
      return s.getDay() === d.getDay();
    }
    return s.toDateString() === d.toDateString();
  };

  const buildTimeOptions = (dateString) => {
    if (!dateString) return [];
    const isBlocked = schedule.customSlots.some((slot) =>
      matchesRepeat(slot, dateString)
    );
    if (isBlocked) return [];
    const dayKey = getDayKey(dateString);
    const slots = schedule.weekly?.[dayKey] || [];
    const times = [];

    const addMinutes = (time, mins) => {
      const [h, m] = time.split(":").map((v) => parseInt(v, 10));
      const dt = new Date(2000, 0, 1, h, m + mins);
      return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
    };

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map((v) => parseInt(v, 10));
      return h * 60 + m;
    };

    slots.forEach((slot) => {
      if (!slot.start || !slot.end) return;
      let current = slot.start;
      const endMinutes = toMinutes(slot.end);
      while (toMinutes(current) < endMinutes) {
        times.push(current);
        current = addMinutes(current, 30);
      }
    });

    const unique = Array.from(new Set(times));
    return unique.filter((time) => !isTimeBlocked(time));
  };

  const parseDurationMinutes = (value) => {
    if (!value) return 30;
    const s = String(value).toLowerCase();
    const nums = s.match(/\d+(\.\d+)?/g);
    if (!nums) return 30;
    const values = nums.map((n) => parseFloat(n)).filter((n) => !Number.isNaN(n));
    const maxVal = values.length ? Math.max(...values) : 30;
    if (s.includes("ωρ")) return Math.round(maxVal * 60);
    return Math.round(maxVal);
  };

  const getServiceDuration = (serviceName) => {
    if (!serviceName) return 30;
    const found = vetData?.services?.find((s) => s.name === serviceName);
    return parseDurationMinutes(found?.duration);
  };

  const toMinutes = (time) => {
    const [h, m] = String(time || "").split(":").map((v) => parseInt(v, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return 0;
    return h * 60 + m;
  };

  const isActiveAppointment = (appt) =>
    appt && !["rejected", "cancelled", "completed"].includes(appt.status);

  const isTimeBlocked = (candidateTime) => {
    if (!candidateTime) return false;
    const candidateMinutes = toMinutes(candidateTime);
    return vetAppointments.some((a) => {
      if (!isActiveAppointment(a)) return false;
      const start = toMinutes(a.time);
      const duration = getServiceDuration(a.service);
      return candidateMinutes >= start && candidateMinutes < start + duration;
    });
  };

  React.useEffect(() => {
    if (!form.date) {
      setTimeOptions([]);
      return;
    }
    const options = buildTimeOptions(form.date);
    setTimeOptions(options);
    if (!options.includes(form.time)) {
      setForm((prev) => ({ ...prev, time: "" }));
    }
  }, [form.date, schedule, vetAppointments, vetData]);

  React.useEffect(() => {
    const loadAppointments = async () => {
      if (!vetid || !form.date) {
        setVetAppointments([]);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:3004/appointments?vetId=${vetid}&date=${form.date}`
        );
        const data = res.ok ? await res.json() : [];
        setVetAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setVetAppointments([]);
      }
    };
    loadAppointments();
  }, [vetid, form.date]);

  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  //για να συνεχίσει μετά την σύνδεση/εγγραφη απο εκει που ειχε μεινει στο βημα 3 με τα στοιχεια συμπληρωμενα
  const goToAuth = (target) => {
    sessionStorage.setItem(
      "arrangeMeetingForm",
      JSON.stringify({ form, ownerInfo })
    );
    sessionStorage.setItem(
      "postAuthRedirect",
      `${location.pathname}?step=3`
    );
    navigate(target);
  };

  const validateStep1 = () => {
    if (!form.date || !form.time) {
      alert("Συμπλήρωσε ημερομηνία και ώρα.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.service) {
      alert("Επίλεξε υπηρεσία.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!isLoggedIn) {
      alert("Συνδέσου ή κάνε εγγραφή για να συνεχίσεις.");
      return false;
    }
    if (!form.petId) {
      alert("Επίλεξε κατοικίδιο.");
      return false;
    }
    if (!form.urgent) {
      alert("Διάλεξε αν είναι επείγον.");
      return false;
    }
    return true;
  };

  const save = async (status) => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;
    try {
      setSaving(true);
      const duration = getServiceDuration(form.service);
      const startMinutes = toMinutes(form.time);
      const endMinutes = startMinutes + duration;
      const conflict = vetAppointments.some((a) => {
        if (!isActiveAppointment(a)) return false;
        const apptStart = toMinutes(a.time);
        const apptEnd = apptStart + getServiceDuration(a.service);
        return startMinutes < apptEnd && endMinutes > apptStart;
      });
      if (conflict) {
        alert("Υπάρχει ήδη ραντεβού σε αυτή τη χρονική περίοδο.");
        return;
      }
      const payload = {
        ownerId: userId,
        vetId: vetid,
        petId: form.petId,
        date: form.date,
        time: form.time,
        service: form.service,
        notes: form.notes,
        urgent: form.urgent,
        ownerInfo,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:3004/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      if (status === "final") {
        setSubmittedFinal(true);
        setActiveStep(4);
      } else {
        navigate(`/owner_main/${userId}/appointments`);
      }
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {isLoggedIn && (
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
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                  <ListItemIcon>
                    <PetsIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Τα Κατοικίδιά μου" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
                  sx={{ backgroundColor: '#D7D3CB' }}
                >
                  <ListItemIcon>
                    <SearchIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Εύρεση Κτηνίατρου" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        )}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {isLoggedIn && (
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
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                  <ListItemIcon>
                    <PetsIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Τα Κατοικίδιά μου" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
                  sx={{ backgroundColor: '#D7D3CB' }}
                >
                  <ListItemIcon>
                    <SearchIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Εύρεση Κτηνίατρου" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        )}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Alert severity="error" sx={{ mb: 2, width: '80%' }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
            sx={{ mt: 2 }}
          >
            Επιστροφή στη λίστα κτηνιάτρων
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      {isLoggedIn && (
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
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                <ListItemIcon>
                  <PetsIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Τα Κατοικίδιά μου" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
                sx={{ backgroundColor: '#D7D3CB' }}
              >
                <ListItemIcon>
                  <SearchIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Εύρεση Κτηνίατρου" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${userId}/appointments`)}
              >
                <ListItemIcon>
                  <CalendarMonthIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${userId}/lost_report`)}
              >
                <ListItemIcon>
                  <DescriptionIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Δήλωση Απώλειας" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${userId}/found_report`)}
              >
                <ListItemIcon>
                  <DescriptionIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Δήλωση Εύρεσης" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${userId}/history_report`)}
              >
                <ListItemIcon>
                  <HistoryIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Ιστορικό Δηλώσεων" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <header className="FindVet-main-header">
          <div className="fam-page">
            <Typography className="fam-title">Προγραμματισμός Ραντεβού</Typography>

            <Paper elevation={0} className="fam-card">
              <Stepper
                nonLinear
                activeStep={activeStep}
                className="fam-stepper"
                alternativeLabel
                connector={<StepLine />}
              >
                {steps.map((label, index) => (
                  <Step key={label} completed={index < activeStep}>
                    <StepButton
                      onClick={() => setActiveStep(index)}
                      icon={
                        <StepCircle ownerState={{ active: index === activeStep, completed: index < activeStep }}>
                          {index + 1}
                        </StepCircle>
                      }
                    >
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Paper elevation={0} className="fam-panel">
                  <Typography className="fam-panel-title">Επέλεξε ημέρα και ώρα</Typography>
                  <div className="fam-grid">
                    <TextField
                      size="small"
                      type="date"
                      label="Ημερομηνία"
                      InputLabelProps={{ shrink: true }}
                      value={form.date}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateForm("date", value);
                      }}
                    />
                    <TextField
                      select
                      size="small"
                      label="Ώρα"
                      value={form.time}
                      onChange={(e) => updateForm("time", e.target.value)}
                    >
                      {timeOptions.length === 0 && (
                        <MenuItem value="">— Χωρίς διαθεσιμότητα</MenuItem>
                      )}
                      {timeOptions.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      size="small"
                      label="Κτηνίατρος"
                      value={vetData?.name || ""}
                      disabled
                    />
                    <TextField
                      size="small"
                      label="Κλινική"
                      value={vetData?.clinicAddress || "—"}
                      disabled
                    />
                  </div>
                </Paper>
              )}

              {activeStep === 1 && (
                <Paper elevation={0} className="fam-panel">
                  <Typography className="fam-panel-title">Επιλέξτε υπηρεσία/λόγο επίσκεψης</Typography>
                  <div className="fam-services">
                    {vetData?.services?.length ? (
                      vetData.services.map((s) => (
                        <label key={s.id || s.name} className={`fam-service ${form.service === s.name ? "is-active" : ""}`}>
                          <input
                            type="radio"
                            name="service"
                            value={s.name}
                            checked={form.service === s.name}
                            onChange={() => updateForm("service", s.name)}
                          />
                          <span className="fam-service-title">{s.name}</span>
                          <span className="fam-service-sub">Διάρκεια: {s.duration || "—"}</span>
                        </label>
                      ))
                    ) : (
                      <label className={`fam-service ${form.service === "Γενική Εξέταση" ? "is-active" : ""}`}>
                        <input
                          type="radio"
                          name="service"
                          value="Γενική Εξέταση"
                          checked={form.service === "Γενική Εξέταση"}
                          onChange={() => updateForm("service", "Γενική Εξέταση")}
                        />
                        <span className="fam-service-title">Γενική Εξέταση</span>
                        <span className="fam-service-sub">Διάρκεια: 30 λεπτά</span>
                      </label>
                    )}
                  </div>
                </Paper>
              )}

              {activeStep === 2 && (
                <Paper elevation={0} className="fam-panel">
                  <Typography className="fam-panel-title">Συμπλήρωσε τα στοιχεία χρήστη</Typography>
                  {!isLoggedIn ? (
                    <div className="fam-auth">
                      <div className="fam-auth-title">Συνέχεια με:</div>
                      <div className="fam-auth-actions">
                        <Button
                          variant="outlined"
                          className="fam-btn"
                          onClick={() => goToAuth("/login")}
                        >
                          Σύνδεση
                        </Button>
                        <Button
                          variant="outlined"
                          className="fam-btn"
                          onClick={() => goToAuth("/registration")}
                        >
                          Εγγραφή
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="fam-grid">
                      <TextField
                        size="small"
                        label="Όνομα"
                        value={ownerInfo.name}
                        disabled
                      />
                      <TextField
                        size="small"
                        label="Επώνυμο"
                        value={ownerInfo.surname}
                        disabled
                      />
                      <TextField
                        size="small"
                        label="Τηλέφωνο"
                        value={ownerInfo.phone}
                        disabled
                      />
                      <TextField
                        size="small"
                        type="email"
                        label="E-mail"
                        value={ownerInfo.email}
                        disabled
                      />
                      <TextField
                        select
                        size="small"
                        label="Επιλογή Κατοικιδίου"
                        value={form.petId}
                        onChange={(e) => updateForm("petId", e.target.value)}
                      >
                        {pets.map((pet) => (
                          <MenuItem key={pet.id} value={String(pet.id)}>
                            {pet.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        size="small"
                        label="Επείγον"
                        value={form.urgent}
                        onChange={(e) => updateForm("urgent", e.target.value)}
                      >
                        <MenuItem value="Ναι">Ναι</MenuItem>
                        <MenuItem value="Όχι">Όχι</MenuItem>
                      </TextField>
                      <TextField
                        size="small"
                        label="Σημειώσεις (Προαιρετικό)"
                        value={form.notes}
                        onChange={(e) => updateForm("notes", e.target.value)}
                      />
                    </div>
                  )}
                </Paper>
              )}

              {activeStep === 3 && (
                <Paper elevation={0} className="fam-panel">
                  <Typography className="fam-panel-title">Ραντεβού</Typography>
                  <div className="fam-summary">
                    <div><b>Όνομα</b><span>:</span><span>{ownerInfo.name || "—"}</span></div>
                    <div><b>Επώνυμο</b><span>:</span><span>{ownerInfo.surname || "—"}</span></div>
                    <div><b>Τηλέφωνο</b><span>:</span><span>{ownerInfo.phone || "—"}</span></div>
                    <div><b>E-mail</b><span>:</span><span>{ownerInfo.email || "—"}</span></div>
                    <div>
                      <b>Κατοικίδιο</b>
                      <span>:</span>
                      <span>{pets.find((p) => String(p.id) === String(form.petId))?.name || "—"}</span>
                    </div>
                    <div><b>Ημέρα</b><span>:</span><span>{form.date || "—"}</span></div>
                    <div><b>Ώρα</b><span>:</span><span>{form.time || "—"}</span></div>
                    <div><b>Υπηρεσία</b><span>:</span><span>{form.service || "—"}</span></div>
                    <div><b>Επείγον</b><span>:</span><span>{form.urgent || "—"}</span></div>
                  </div>
                  <div className="fam-submit">
                    <Button
                      variant="contained"
                      className="fam-btn-green-strong"
                      disabled={saving}
                      onClick={() => save("final")}
                    >
                      Υποβολή Ραντεβού
                    </Button>
                  </div>
                </Paper>
              )}

              {activeStep === 4 && (
                <Paper elevation={0} className="fam-panel">
                  <div className="fam-confirm">
                    <div className="fam-confirm-title">Επιβεβαίωση Ραντεβού</div>
                    <div className="fam-confirm-text">
                      Το αίτημα σας για ραντεβού θα αποσταλεί στον κτηνίατρο για επιβεβαίωση.
                    </div>
                    <div className="fam-confirm-note">
                      Θα λάβετε ειδοποίηση όταν ο/η Δρ. {vetData?.name || "—"} επιβεβαιώσει ή
                      απορρίψει το ραντεβού σας.
                    </div>
                    <Button
                      variant="contained"
                      className="fam-btn-blue"
                      onClick={() => navigate(`/owner_main/${userId}`)}
                    >
                      Αποστολή email
                    </Button>
                  </div>
                </Paper>
              )}

              {!submittedFinal && (
                <div className="fam-actions">
                  <Button
                    variant="outlined"
                    className="fam-btn"
                    onClick={() => {
                      if (activeStep === 0) {
                        navigate(`/owner_main/${userId}/find_vet`);
                      } else {
                        setActiveStep((s) => Math.max(s - 1, 0));
                      }
                    }}
                  >
                    <span className="fam-arrow">‹</span> Επιστροφή
                  </Button>
                  {activeStep < 3 && (
                    <Button
                      variant="outlined"
                      className="fam-btn"
                      onClick={() => {
                        if (activeStep === 0 && !validateStep1()) return;
                        if (activeStep === 1 && !validateStep2()) return;
                        if (activeStep === 2 && !validateStep3()) return;
                        setActiveStep((s) => Math.min(s + 1, steps.length - 1));
                      }}
                    >
                      Επόμενο Βήμα <span className="fam-arrow">›</span>
                    </Button>
                  )}
                </div>
              )}
            </Paper>
          </div>
        </header>
      </Box>
    </Box>
  );
}
