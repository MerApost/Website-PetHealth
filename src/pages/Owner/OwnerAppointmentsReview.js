import * as React from "react";
import "./FindVet.css";
import "./OwnerAppointmentsReview.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import StarIcon from "@mui/icons-material/Star";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BackButton from "../../components/BackButton/BackButton";

export default function OwnerAppointmentsReview() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";
  const drawerWidth = 270;
  const [appointment, setAppointment] = React.useState(null);
  const [vet, setVet] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [recommend, setRecommend] = React.useState("yes");
  const [owner, setOwner] = React.useState(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3004/appointments/${appointmentId}`);
        const data = res.ok ? await res.json() : null;
        setAppointment(data);
        if (data?.vetId) {
          const vetRes = await fetch(`http://localhost:3004/users/${data.vetId}`);
          const vetData = vetRes.ok ? await vetRes.json() : null;
          setVet(vetData);
        }
        if (userId) {
          const ownerRes = await fetch(`http://localhost:3004/users/${userId}`);
          const ownerData = ownerRes.ok ? await ownerRes.json() : null;
          setOwner(ownerData);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (appointmentId) load();
  }, [appointmentId]);

  const onSubmit = async () => {
    if (!score) {
      alert("Συμπλήρωσε βαθμολογία.");
      return;
    }
    if (!appointment?.id || !appointment?.vetId) return;
    try {
      setSaving(true);
      const payload = {
        appointmentId: appointment.id,
        vetId: appointment.vetId,
        ownerId: userId,
        ownerName: owner ? `${owner.name || ""} ${owner.surname || ""}`.trim() : "",
        ownerPhoto: owner?.photo || "",
        rating: score,
        comment: comment.trim(),
        recommend,
        service: appointment.service || "",
        date: appointment.date || "",
        time: appointment.time || "",
        createdAt: new Date().toISOString(),
      };
      const res = await fetch("http://localhost:3004/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      navigate(`/owner_main/${userId}`);
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης αξιολόγησης.");
    } finally {
      setSaving(false);
    }
  };

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
          <div className="oar-wrap">
            <Paper elevation={0} className="oar-card">
              <Typography className="oar-title">Γράψε μια κριτική</Typography>
              <Typography className="oar-subtitle">
                Μοιραστείτε την εμπειρία σας. Η αξιολόγηση βοηθά άλλους ιδιοκτήτες.
              </Typography>

              <div className="oar-rating">
                <Typography className="oar-label">Συνολική Βαθμολογία</Typography>
                <Rating
                  value={score}
                  onChange={(_e, v) => setScore(v || 0)}
                />
              </div>

              <div className="oar-field">
                <Typography className="oar-label">Γράψτε την κριτική σας</Typography>
                <TextField
                  multiline
                  minRows={4}
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Περιγράψτε την εμπειρία σας..."
                />
              </div>

              <div className="oar-field">
                <Typography className="oar-label">Θα προτείνατε τον/την κτηνίατρο;</Typography>
                <RadioGroup
                  row
                  value={recommend}
                  onChange={(e) => setRecommend(e.target.value)}
                  className="oar-radio"
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Ναι, τον/την συνιστώ" />
                  <FormControlLabel value="no" control={<Radio />} label="Όχι, δεν τον/την συνιστώ" />
                </RadioGroup>
              </div>

              <Button
                variant="contained"
                className="oar-submit"
                onClick={onSubmit}
                disabled={saving}
              >
                Υποβολή Αξιολόγησης
              </Button>
            </Paper>

            <Box
              sx={{
                flex: "0 0 34%",
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 2,
                border: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "240px",
                  width: "250px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={vet?.photo || "https://via.placeholder.com/240x240?text=Vet"}
                  alt="vet"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#f0f0f0",
                  }}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Αξιολογείς τον/την:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0 }}>
                  {vet ? `${vet.name || ""} ${vet.surname || ""}`.trim() : "—"}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                  {vet?.specialty || "Κτηνίατρος"}
                </Typography>
                <Divider sx={{ my: 1.0, backgroundColor: "#221f1f", width: "75%", mx: "auto" }} />
                <Box
                  sx={{
                    my: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "nowrap",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Rating
                    name="text-feedback"
                    value={Number(vet?.rating || 4)}
                    readOnly
                    precision={0.5}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <Box sx={{ ml: 1, fontSize: "1.0rem", whiteSpace: "nowrap" }}>
                    {Number(vet?.rating || 4).toFixed(1)}
                  </Box>
                </Box>
                <Divider sx={{ my: 1.5, backgroundColor: "black", width: "100%", height: "1px", opacity: 0.4 }} />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ημ/νία: {appointment?.date || "—"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ώρα: {appointment?.time || "—"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PlaceIcon sx={{ fontSize: 20, mr: 1.2, color: "#67A3B8" }} />
                  <Typography variant="body2">
                    {vet?.clinicAddress || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PhoneIcon sx={{ fontSize: 20, mr: 1.2, color: "#67A3B8" }} />
                  <Typography variant="body2">{vet?.phone || "—"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon sx={{ fontSize: 20, mr: 1.2, color: "#67A3B8" }} />
                  <Typography variant="body2">{vet?.email || "—"}</Typography>
                </Box>
              </Box>
            </Box>
          </div>
          <BackButton />
        </header>
      </Box>
    </Box>
  );
}
