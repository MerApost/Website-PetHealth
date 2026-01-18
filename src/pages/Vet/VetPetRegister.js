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
  CssBaseline,
  MenuItem,
} from "@mui/material";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import BackButton from "../../components/BackButton/BackButton";
import VetDashboard from "./VetDashboard";
import Pet_Types from "../Lost_Pets/Data/Pet_Types";
import { Pet_Breeds } from "../Lost_Pets/Data/Pet_Breeds";
import { GenderOptions } from "../Lost_Pets/Data/GenderOptions";

const initial = {
  microchip: "",
  name: "",
  species: "",
  breed: "",
  gender: "",
  birthDate: "",
  age: "",
  ownerAfm: "",
  photo: "",
};

export default function VetPetRegister() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [message, setMessage] = React.useState("");

  const rawVetId = localStorage.getItem("userId");
  const vetId = (rawVetId || "").trim();

  React.useEffect(() => {
    if (!vetId) navigate("/login");
  }, [vetId, navigate]);

  const sanitizeDigits = (value, maxLen) =>
    String(value || "")
      .replace(/\D/g, "")
      .slice(0, maxLen);

  const change = (k) => (e) => {
    const raw = e.target.value;
    const value =
      k === "ownerAfm" ? sanitizeDigits(raw, 20) : raw;
    setForm((p) => ({ ...p, [k]: value }));
    if (errors[k]) {
      setErrors((prev) => ({ ...prev, [k]: "" }));
    }
    setMessage("");
  };

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
      String(form.age).trim() &&
      form.ownerAfm.trim()
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
      const requiredKeys = [
        "microchip",
        "name",
        "species",
        "breed",
        "gender",
        "age",
        "ownerAfm",
      ];
      const nextErrors = {};
      requiredKeys.forEach((k) => {
        if (String(form[k] || "").trim() === "") {
          nextErrors[k] = "Υποχρεωτικό πεδίο.";
        }
      });
      setErrors(nextErrors);
      setMessage("Συμπλήρωσε όλα τα υποχρεωτικά πεδία.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      let ownerId = "";
      let petId = "";

      if (status === "final") {
        const usersRes = await fetch("http://localhost:3004/users");
        const users = usersRes.ok ? await usersRes.json() : [];
        const owner = Array.isArray(users)
          ? users.find((u) => String(u.afm || "").trim() === form.ownerAfm.trim() && u.role === "owner")
          : null;

        if (!owner) {
          setErrors((prev) => ({ ...prev, ownerAfm: "Δεν βρέθηκε ιδιοκτήτης με αυτό το ΑΦΜ." }));
          setMessage("Δεν βρέθηκε ιδιοκτήτης με αυτό το ΑΦΜ.");
          return;
        }

        const microchipTaken = Array.isArray(users)
          ? users.some((u) =>
              Array.isArray(u.pets) &&
              u.pets.some((p) => String(p.microchip || "").trim() === form.microchip.trim())
            )
          : false;

        if (microchipTaken) {
          setErrors((prev) => ({ ...prev, microchip: "Υπάρχει ήδη κατοικίδιο με αυτό το microchip." }));
          setMessage("Υπάρχει ήδη κατοικίδιο με αυτό το microchip.");
          return;
        }

        const nextId =
          Array.isArray(owner.pets) && owner.pets.length > 0
            ? Math.max(...owner.pets.map((p) => Number(p.id) || 0)) + 1
            : 1;

        const newPet = {
          id: nextId,
          microchip: form.microchip.trim(),
          name: form.name.trim(),
          type: form.species.trim(),
          breed: form.breed.trim(),
          gender: form.gender.trim(),
          birthDate: form.birthDate.trim(),
          age: form.age ? Number(form.age) : "",
          photo: form.photo.trim(),
        };

        const patchRes = await fetch(`http://localhost:3004/users/${owner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pets: Array.isArray(owner.pets) ? [...owner.pets, newPet] : [newPet],
          }),
        });
        if (!patchRes.ok) throw new Error("PATCH failed");

        ownerId = owner.id;
        petId = newPet.id;
      }

      const payload = {
        ...form,
        vetId,
        status,
        ownerId,
        petId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:3004/petRegistrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("POST failed");

      navigate(`/vet_main/${vetId}/pet-history`);
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="pet-register" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="vetpet-page">
          <Typography className="vetpet-title">Καταγραφή Στοιχείων Κατοικιδίου</Typography>

          <Paper elevation={0} className="vetpet-card">
        <Typography className="vetpet-section">Στοιχεία Κατοικιδίου</Typography>
        <Divider className="vetpet-divider" />

        <Grid container spacing={2} className="vetpet-grid">
          <Grid item xs={12} md={3}>
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

          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Microchip *"
                  size="small"
                  fullWidth
                  value={form.microchip}
                  onChange={change("microchip")}
                  error={Boolean(errors.microchip)}
                  helperText={errors.microchip || ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Όνομα *"
                  size="small"
                  fullWidth
                  value={form.name}
                  onChange={change("name")}
                  error={Boolean(errors.name)}
                  helperText={errors.name || ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  label="Ημ/νία Γέννησης"
                  size="small"
                  fullWidth
                  value={form.birthDate}
                  onChange={change("birthDate")}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: maxBirthDate }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Ηλικία (έτη) *"
                  size="small"
                  fullWidth
                  type="number"
                  value={form.age}
                  onChange={change("age")}
                  inputProps={{ min: 0, step: 1 }}
                  error={Boolean(errors.age)}
                  helperText={errors.age || ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="ΑΦΜ Ιδιοκτήτη *"
                  size="small"
                  fullWidth
                  value={form.ownerAfm}
                  onChange={change("ownerAfm")}
                  error={Boolean(errors.ownerAfm)}
                  helperText={errors.ownerAfm || ""}
                  inputProps={{ inputMode: "numeric" }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="vetpet-grid">
          <Grid item xs={12}>
            <TextField
              select
              label="Είδος *"
              size="small"
              fullWidth
              value={form.species}
              onChange={change("species")}
              className="vetpet-select"
              error={Boolean(errors.species)}
              helperText={errors.species || ""}
            >
              {Pet_Types.map((type) => (
                <MenuItem key={type.label} value={type.label}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Ράτσα *"
              size="small"
              fullWidth
              value={form.breed}
              onChange={change("breed")}
              className="vetpet-select"
              error={Boolean(errors.breed)}
              helperText={errors.breed || ""}
            >
              {Pet_Breeds.map((breed) => (
                <MenuItem key={breed.value || breed.label} value={breed.value || breed.label}>
                  {breed.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Φύλο *"
              size="small"
              fullWidth
              value={form.gender}
              onChange={change("gender")}
              className="vetpet-select"
              error={Boolean(errors.gender)}
              helperText={errors.gender || ""}
            >
              {GenderOptions.map((opt) => (
                <MenuItem key={opt.value || opt.label} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {message && <div className="vetpet-message">{message}</div>}

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
      </Box>
    </Box>
  );
}
