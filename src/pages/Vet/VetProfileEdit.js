import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./VetProfile.css";

import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import BackButton from "../../components/BackButton/BackButton";

export default function VetProfileEdit() {
  const navigate = useNavigate();

  const [form, setForm] = React.useState(null);
  const [services, setServices] = React.useState([]);

  const [newService, setNewService] = React.useState({
    name: "",
    duration: "",
    price: "",
  });

  React.useEffect(() => {
    const rawId = localStorage.getItem("userId");
    const id = encodeURIComponent((rawId || "").trim());

    if (!id) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3004/users/${id}`)
      .then((r) => r.json())
      .then((u) => {
        if (u.role !== "vet") {
          alert("Δεν είστε κτηνίατρος.");
          navigate("/");
          return;
        }

        setForm({
          name: u.name || "",
          surname: u.surname || "",
          email: u.email || "",
          phone: u.phone || "",
          afm: u.afm || "",
          gender: u.gender || "",
          experience: u.experience || "",
          studiesLevel: u.studiesLevel || "",
          clinicAddress: u.clinicAddress || "",
          specialty: u.specialty || "",
          licenseNumber: u.licenseNumber || "",
          profession: u.profession || "",
          about: u.about || "",
          photo: u.photo || "",
        });

        setServices(u.services || []);
      })
      .catch(() => alert("Σφάλμα φόρτωσης προφίλ κτηνίατρου"));
  }, [navigate]);

  const change = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onVetPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "");
      setForm((p) => ({ ...p, photo: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const changeService = (key) => (e) => setNewService((p) => ({ ...p, [key]: e.target.value }));

  const onAddService = () => {
    const name = (newService.name || "").trim();
    const duration = (newService.duration || "").trim();
    const price = (newService.price || "").trim();

    if (!name || !duration || !price) {
      alert("Συμπλήρωσε όλα τα πεδία της υπηρεσίας");
      return;
    }

    setServices((prev) => [...prev, { id: Date.now(), name, duration, price }]);
    setNewService({ name: "", duration: "", price: "" });
  };

  const onDeleteService = (id) => setServices((prev) => prev.filter((s) => s.id !== id));

  const onSave = async (e) => {
    e.preventDefault();
    const rawId = localStorage.getItem("userId");
    const id = encodeURIComponent((rawId || "").trim());

    const payload = { ...form, services };

    await fetch(`http://localhost:3004/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate("/vet/profile");
  };

  if (!form) {
    return <div className="loading">Φόρτωση...</div>;
  }

  return (
    <div className="profile-page">
      <Typography className="profile-title">Επεξεργασία Προφίλ</Typography>

      <Paper elevation={0} className="profile-card">
        <Box className="profile-top edit-top">
          <Box className="edit-actions">
            <Button
              variant="contained"
              color="error"
              className="danger-btn"
              onClick={() => navigate("/delete-account")}
            >
              Διαγραφή Λογαριασμού
            </Button>

            <Box className="edit-actions-right">
              <Button variant="outlined" className="cancel-btn" onClick={() => navigate("/vet/profile")}>
                Ακύρωση
              </Button>

              <Button variant="contained" className="save-btn" onClick={onSave}>
                Αποθήκευση Αλλαγών
              </Button>
            </Box>
          </Box>

          <Typography className="profile-section-title">Προσωπικά Στοιχεία</Typography>
        </Box>

        <Divider className="profile-divider" />

        <Grid container spacing={2} className="profile-info-grid">
          <Grid item xs={12} md={8}>
            <div className="profile-info">
              <TextField label="Όνομα:" size="small" fullWidth value={form.name} onChange={change("name")} />
              <TextField label="Επίθετο:" size="small" fullWidth value={form.surname} onChange={change("surname")} />
              <TextField label="E-mail:" size="small" fullWidth value={form.email} onChange={change("email")} />
              <TextField label="Τηλέφωνο:" size="small" fullWidth value={form.phone} onChange={change("phone")} />
              <TextField label="ΑΦΜ:" size="small" fullWidth value={form.afm} onChange={change("afm")} />
              <TextField label="Φύλο:" size="small" fullWidth value={form.gender} onChange={change("gender")} />
              <TextField label="Εμπειρία (χρόνια):" size="small" fullWidth value={form.experience} onChange={change("experience")} />
              <TextField label="Επίπεδο Σπουδών:" size="small" fullWidth value={form.studiesLevel} onChange={change("studiesLevel")} />
              <TextField label="Διεύθυνση Κλινικής:" size="small" fullWidth value={form.clinicAddress} onChange={change("clinicAddress")} />
              <TextField label="Ειδικότητα:" size="small" fullWidth value={form.specialty} onChange={change("specialty")} />
              <TextField label="Αρ. Άδειας:" size="small" fullWidth value={form.licenseNumber} onChange={change("licenseNumber")} />
              <TextField label="Επάγγελμα:" size="small" fullWidth value={form.profession} onChange={change("profession")} />
            </div>
          </Grid>

          <Grid item xs={12} md={4} className="profile-photo-box">
            <div className="profile-photo-placeholder">
              {form.photo && form.photo.trim() !== "" ? (
                <img className="profile-photo-img" src={form.photo} alt="Vet" />
              ) : (
                <InsertPhotoIcon fontSize="large" />
              )}
            </div>

            <div className="file-input-wrap">
              <input type="file" accept="image/*" onChange={onVetPhotoChange} />
            </div>
          </Grid>
        </Grid>

        <Typography className="centered-section-title">Σχετικά με εμένα</Typography>
        <div className="section-box">
          <TextField
            label="Περιγραφή"
            multiline
            minRows={4}
            fullWidth
            value={form.about}
            onChange={change("about")}
          />
        </div>

        <Typography className="centered-section-title">Προσθήκη Υπηρεσίας</Typography>

        <div className="service-add-grid">
          <TextField label="Υπηρεσία" size="small" value={newService.name} onChange={changeService("name")} />
          <TextField label="Διάρκεια" size="small" value={newService.duration} onChange={changeService("duration")} />
          <TextField label="Τιμή" size="small" value={newService.price} onChange={changeService("price")} />

          <Button variant="contained" size="small" className="save-btn" onClick={onAddService}>
            Προσθήκη
          </Button>
        </div>

        <Typography className="centered-section-title">Διαθέσιμες Υπηρεσίες</Typography>

        <div className="services-box">
          <div className="services-header services-header-edit">
            <span>Υπηρεσία</span>
            <span>Διάρκεια</span>
            <span>Τιμή</span>
            <span></span>
          </div>

          {services.map((s, idx) => (
            <div key={s.id || idx} className="services-row services-row-edit">
              <span>{s.name}</span>
              <span>{s.duration}</span>
              <span>{s.price}</span>

              <IconButton onClick={() => onDeleteService(s.id)} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          ))}

          {services.length === 0 && <div className="services-empty">—</div>}
        </div>
      </Paper>

      <div className="profile-back">
        <BackButton />
      </div>
    </div>
  );
}
