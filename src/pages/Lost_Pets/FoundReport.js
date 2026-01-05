import * as React from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  Paper,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  Box,
} from "@mui/material";

import "./FoundReport.css";

const initial = {
  petName: "",
  species: "",
  breed: "",
  gender: "",
  color: "",
  age: "",
  photo: "",

  foundDate: "",
  foundTime: "",
  area: "",
  address: "",
  notes: "",

  reporterName: "",
  reporterSurname: "",
  email: "",
  phone: "",
};

export default function FoundReport() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "");
      setForm((p) => ({ ...p, photo: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = () => {
    if (step === 0) return form.species && form.gender;
    if (step === 1) return form.foundDate && form.area;
    if (step === 2) return form.reporterName && form.reporterSurname && form.phone;
    return true;
  };

  const onSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        createdAt: new Date().toISOString(),
        status: "submitted",
      };

      const res = await fetch("http://localhost:3004/foundReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("POST failed");
      setStep(3); // success
    } catch (e) {
      console.error(e);
      alert("Αποτυχία υποβολής.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="report-page">
      <Typography className="report-title">Δήλωση Εύρεσης</Typography>

      <Paper elevation={0} className="report-card">
        {step < 3 && (
          <>
            <Typography className="report-step">
              {step === 0 && "Στοιχεία Κατοικιδίου"}
              {step === 1 && "Στοιχεία Εύρεσης"}
              {step === 2 && "Στοιχεία Επικοινωνίας"}
            </Typography>

            <Divider className="report-divider" />

            {/* Κατοικίδιο */}
            {step === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Όνομα κατοικιδίου"
                    size="small"
                    fullWidth
                    value={form.petName}
                    onChange={change("petName")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Είδος*"
                    size="small"
                    fullWidth
                    value={form.species}
                    onChange={change("species")}
                    placeholder="Σκύλος/Γάτα..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ράτσα"
                    size="small"
                    fullWidth
                    value={form.breed}
                    onChange={change("breed")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Φύλο*"
                    size="small"
                    fullWidth
                    value={form.gender}
                    onChange={change("gender")}
                    placeholder="Αρσενικό/Θηλυκό"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Χρώμα"
                    size="small"
                    fullWidth
                    value={form.color}
                    onChange={change("color")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ηλικία"
                    size="small"
                    fullWidth
                    value={form.age}
                    onChange={change("age")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <div className="photo-upload-row">
                    <div className="photo-preview">
                      {form.photo && form.photo.trim() !== "" ? (
                        <img src={form.photo} alt="Pet" />
                      ) : (
                        <div className="photo-empty">Δεν υπάρχει φωτογραφία</div>
                      )}
                    </div>

                    <div className="photo-upload-input">
                      <input type="file" accept="image/*" onChange={onPhotoChange} />
                    </div>
                  </div>
                </Grid>
              </Grid>
            )}

            {/* Εύρεση */}
            {step === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Ημερομηνία εύρεσης*"
                    size="small"
                    fullWidth
                    value={form.foundDate}
                    onChange={change("foundDate")}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="time"
                    label="Ώρα"
                    size="small"
                    fullWidth
                    value={form.foundTime}
                    onChange={change("foundTime")}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Περιοχή*"
                    size="small"
                    fullWidth
                    value={form.area}
                    onChange={change("area")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Διεύθυνση"
                    size="small"
                    fullWidth
                    value={form.address}
                    onChange={change("address")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Σημειώσεις"
                    size="small"
                    fullWidth
                    multiline
                    minRows={3}
                    value={form.notes}
                    onChange={change("notes")}
                  />
                </Grid>
              </Grid>
            )}

            {/* Επικοινωνία */}
            {step === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Όνομα*"
                    size="small"
                    fullWidth
                    value={form.reporterName}
                    onChange={change("reporterName")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Επίθετο*"
                    size="small"
                    fullWidth
                    value={form.reporterSurname}
                    onChange={change("reporterSurname")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="E-mail"
                    size="small"
                    fullWidth
                    value={form.email}
                    onChange={change("email")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Τηλέφωνο*"
                    size="small"
                    fullWidth
                    value={form.phone}
                    onChange={change("phone")}
                  />
                </Grid>
              </Grid>
            )}

            <Box className="report-actions">
              <Button
                variant="outlined"
                className="btn-gray"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Ακύρωση
              </Button>

              <Box className="report-actions-right">
                <Button
                  variant="contained"
                  className="btn-blue"
                  onClick={prev}
                  disabled={saving || step === 0}
                >
                  Προηγούμενο
                </Button>

                {step < 2 ? (
                  <Button
                    variant="contained"
                    className="btn-green"
                    onClick={next}
                    disabled={saving || !validateStep()}
                  >
                    Επόμενο
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="btn-green"
                    onClick={onSubmit}
                    disabled={saving || !validateStep()}
                  >
                    Οριστική Υποβολή
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}

        {step === 3 && (
          <Box className="report-success">
            <CheckCircleIcon className="success-icon" />
            <Typography className="success-title">Επιτυχής Υποβολή</Typography>
            <Typography className="success-sub">
              Η δήλωση εύρεσης καταχωρήθηκε.
            </Typography>

            <button className="success-link" type="button" onClick={() => navigate("/")}>
              Επιστροφή στην αρχική
            </button>
          </Box>
        )}
      </Paper>
    </div>
  );
}
