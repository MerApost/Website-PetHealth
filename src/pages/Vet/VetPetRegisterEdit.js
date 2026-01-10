import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function VetPetRegisterEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = React.useState(null);
  const [saving, setSaving] = React.useState(false);

  const vetId = (localStorage.getItem("userId") || "").trim();

  const maxBirthDate = React.useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  React.useEffect(() => {
    if (!vetId) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3004/petRegistrations/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();

        if (String(data.vetId) !== String(vetId)) {
          alert("Δεν έχετε πρόσβαση σε αυτή την καταχώριση.");
          navigate("/vet/pet-history");
          return;
        }

        if (data.status !== "draft") {
          navigate(`/vet/pet-preview/${data.id}`);
          return;
        }

        setForm({
          microchip: data.microchip || "",
          name: data.name || "",
          species: data.species || "",
          breed: data.breed || "",
          gender: data.gender || "",
          birthDate: data.birthDate || "",
          photo: data.photo || "",
        });
      } catch (e) {
        console.error(e);
        alert("Σφάλμα φόρτωσης καταχώρισης.");
        navigate("/vet/pet-history");
      }
    };

    load();
  }, [id, vetId, navigate]);

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const hasAtLeastOne = () => Object.values(form || {}).some((v) => String(v || "").trim() !== "");
  const requiredOk = () =>
    form.microchip.trim() &&
    form.name.trim() &&
    form.species.trim() &&
    form.breed.trim() &&
    form.gender.trim() &&
    form.birthDate.trim();

  const save = async (status) => {
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
        status,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`http://localhost:3004/petRegistrations/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("PATCH failed");

      navigate("/vet/pet-history");
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteDraft = async () => {
    const ok = window.confirm("Θέλεις σίγουρα να διαγράψεις την προσωρινή καταχώριση;");
    if (!ok) return;

    try {
      setSaving(true);
      const res = await fetch(`http://localhost:3004/petRegistrations/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) throw new Error("DELETE failed");
      navigate("/vet/pet-history");
    } catch (e) {
      console.error(e);
      alert("Αποτυχία διαγραφής.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return <div style={{ paddingTop: 120, textAlign: "center" }}>Φόρτωση...</div>;
  }

  return (
    <div className="vetpet-page">
      <Typography className="vetpet-title">Καταγραφή Στοιχείων Κατοικιδίου</Typography>

      <Paper elevation={0} className="vetpet-card">
        <Box className="vetpet-topline">
          <div className="vetpet-badge badge-blue">Προσωρινά αποθηκευμένο</div>
        </Box>

        <Typography className="vetpet-section">Στοιχεία Κατοικιδίου</Typography>
        <Divider className="vetpet-divider" />

        <Grid container spacing={2} className="vetpet-grid">
          <Grid item xs={12} md={4}>
            <div className="vetpet-photo">
              <div className="vetpet-photo-box">
                {form.photo ? (
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
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Microchip *" size="small" fullWidth value={form.microchip} onChange={change("microchip")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Όνομα *" size="small" fullWidth value={form.name} onChange={change("name")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Είδος *" size="small" fullWidth value={form.species} onChange={change("species")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Ράτσα *" size="small" fullWidth value={form.breed} onChange={change("breed")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Φύλο *" size="small" fullWidth value={form.gender} onChange={change("gender")} />
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

          <Button variant="contained" className="vetpet-btn-blue" disabled={saving} onClick={() => save("draft")}>
            Προσωρινή Αποθήκευση
          </Button>

          <Button variant="contained" className="vetpet-btn-green" disabled={saving} onClick={() => save("final")}>
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
