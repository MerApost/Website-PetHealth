import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./VetPetRegister.css";

import {
  Paper,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  Box,
} from "@mui/material";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import BackButton from "../../components/BackButton/BackButton";

const initial = {
  microchip: "",
  name: "",
  species: "",
  breed: "",
  gender: "",
  birthDate: "",
  photo: "",
};

export default function VetPetRegister() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);

  const rawVetId = localStorage.getItem("userId");
  const vetId = (rawVetId || "").trim();

  React.useEffect(() => {
    if (!vetId) navigate("/login");
  }, [vetId, navigate]);

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const maxBirthDate = React.useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const hasAtLeastOne = () => {
    return Object.values(form).some((v) => String(v || "").trim() !== "");
  };

  const requiredOk = () => {
    return (
      form.microchip.trim() &&
      form.name.trim() &&
      form.species.trim() &&
      form.breed.trim() &&
      form.gender.trim() &&
      form.birthDate.trim()
    );
  };

  const isLikelyUrl = (v) => {
    const s = String(v || "").trim();
    return s.startsWith("http://") || s.startsWith("https://");
  };

  const save = async (status) => {
    if (!vetId) return navigate("/login");

    if (status === "draft" && !hasAtLeastOne()) {
      alert("Για προσωρινή αποθήκευση συμπλήρωσε τουλάχιστον 1 πεδίο.");
      return;
    }
    if (status === "final" && !requiredOk()) {
      alert("Για οριστική υποβολή πρέπει να συμπληρωθούν όλα τα υποχρεωτικά πεδία (*).");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        vetId,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:3004/petRegistrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("POST failed");

      navigate("/vet/pet-history");
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vetpet-page">
      <Typography className="vetpet-title">Καταγραφή Στοιχείων Κατοικιδίου</Typography>

      <Paper elevation={0} className="vetpet-card">
        <Typography className="vetpet-section">Στοιχεία Κατοικιδίου</Typography>
        <Divider className="vetpet-divider" />

        <Grid container spacing={2} className="vetpet-grid">
          <Grid item xs={12} md={4}>
            <div className="vetpet-photo">
              <div className="vetpet-photo-box">
                {form.photo && isLikelyUrl(form.photo) ? (
                  <img src={form.photo} alt="Pet" className="vetpet-photo-img" />
                ) : (
                  <InsertPhotoIcon fontSize="large" />
                )}
              </div>

              <div className="vetpet-photo-input">
                <TextField
                  label="Φωτογραφία (URL)"
                  size="small"
                  fullWidth
                  value={form.photo}
                  onChange={change("photo")}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Microchip *"
                  size="small"
                  fullWidth
                  value={form.microchip}
                  onChange={change("microchip")}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Όνομα *"
                  size="small"
                  fullWidth
                  value={form.name}
                  onChange={change("name")}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Είδος *"
                  size="small"
                  fullWidth
                  value={form.species}
                  onChange={change("species")}
                  placeholder="Σκύλος/Γάτα..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Ράτσα *"
                  size="small"
                  fullWidth
                  value={form.breed}
                  onChange={change("breed")}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Φύλο *"
                  size="small"
                  fullWidth
                  value={form.gender}
                  onChange={change("gender")}
                  placeholder="Αρσενικό/Θηλυκό"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  label="Ημ/νία Γέννησης *"
                  size="small"
                  fullWidth
                  value={form.birthDate}
                  onChange={change("birthDate")}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: maxBirthDate }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box className="vetpet-actions">
          <Button
            variant="contained"
            className="vetpet-btn-blue"
            disabled={saving}
            onClick={() => save("draft")}
          >
            Προσωρινή Αποθήκευση
          </Button>

          <Button
            variant="contained"
            className="vetpet-btn-green"
            disabled={saving}
            onClick={() => save("final")}
          >
            Οριστική Υποβολή
          </Button>
        </Box>
      </Paper>

      <div className="vetpet-back">
        <BackButton />
      </div>
    </div>
  );
}
