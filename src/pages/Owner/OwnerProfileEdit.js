import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./OwnerProfile.css";

import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import BackButton from "../../components/BackButton/BackButton";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

export default function OwnerProfileEdit() {
    const navigate = useNavigate();
    
    const [form, setForm] = React.useState(null);
    const [pets, setPets] = React.useState([]);
    
    React.useEffect(() => {
        const id = localStorage.getItem("userId");
        if (!id) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:3004/users/${id}`)
            .then((r) => r.json())
            .then((u) => {
            setForm({
                name: u.name || "",
                surname: u.surname || "",
                email: u.email || "",
                phone: u.phone || "",
                afm: u.afm || "",
                petsCount: String(u.petsCount ?? ""),
            });
            setPets(u.pets || []);
        })
        .catch(() => alert("Σφάλμα φόρτωσης προφίλ"));
    }, [navigate]);

    const change = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const onDeletePet = (id) => setPets((prev) => prev.filter((p) => p.id !== id));

    const onPetPhotoChange = (petId) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "");
      setPets((prev) =>
        prev.map((p) => (p.id === petId ? { ...p, photo: base64 } : p))
      );
    };
    reader.readAsDataURL(file);
    };

    const onSave = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem("userId");

        const payload = {
            ...form,
            petsCount: Number(form.petsCount || 0),
            pets: pets,
        };

        await fetch(`http://localhost:3004/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        navigate("/owner/profile");
    };
    if (!form) {
    return <div style={{ paddingTop: 120, textAlign: "center" }}>Φόρτωση...</div>;
}



  return (
    <div className="profile-page">
    <Typography className="profile-title">Προβολή Προφίλ</Typography>
      <Paper elevation={0} className="profile-card">

        <Box className="profile-top edit-top">
          <Typography className="profile-section-title">Προσωπικά Στοιχεία</Typography>

          <Box className="edit-actions">
            <Button
              variant="contained"
              color="error"
              className="danger-btn"
              onClick={() => alert("Αργότερα θα το συνδέσουμε με JSON Server")}
            >
              Διαγραφή Λογαριασμού
            </Button>

            <Button variant="contained" className="save-btn" onClick={onSave}>
              Αποθήκευση Αλλαγών
            </Button>

            <Button variant="outlined" className="cancel-btn" onClick={() => navigate("/owner/profile")}>
              Ακύρωση
            </Button>
          </Box>
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
              <TextField
                label="Αριθμός Κατοικιδίων:"
                size="small"
                fullWidth
                value={form.petsCount}
                onChange={change("petsCount")}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={4} className="profile-photo-box">
            <div className="profile-photo-placeholder">
              <InsertPhotoIcon fontSize="large" />
            </div>
          </Grid>
        </Grid>

        <Typography className="profile-section-title pets-title">Κατοικίδια</Typography>

        <div className="pets-list">
          {pets.map((p) => (
            <Card key={p.id} className="pet-card" elevation={0}>
              <CardMedia
                component="img"
                image={p.photo && p.photo.trim() !== "" ? p.photo : "https://via.placeholder.com/220x140?text=Pet"}
                alt={p.name}
                className="pet-img"
              />

              <CardContent className="pet-content">
                <IconButton className="pet-delete" onClick={() => onDeletePet(p.id)}>
                  <DeleteIcon />
                </IconButton>

                <div style={{ marginBottom: 10 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPetPhotoChange(p.id)}
                  />
                </div>

                <div className="pet-row"><span>Όνομα:</span><b>{p.name}</b></div>
                <div className="pet-row"><span>Microchip:</span><b>{p.microchip}</b></div>
                <div className="pet-row"><span>Είδος:</span><b>{p.breed}</b></div>
                <div className="pet-row"><span>Φύλο:</span><b>{p.gender}</b></div>
                <div className="pet-row"><span>Ηλικία:</span><b>{p.age}</b></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
      </Paper>
      <div className="profile-back">
          <BackButton />
        </div>
    </div>
  );
}
