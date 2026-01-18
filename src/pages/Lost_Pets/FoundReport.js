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
  const [errors, setErrors] = React.useState({});

  const sanitizePhone = (value) =>
    String(value || "")
      .replace(/\D/g, "")
      .slice(0, 10);

  const change = (k) => (e) => {
    const raw = e.target.value;
    const value = k === "phone" ? sanitizePhone(raw) : raw;
    setForm((p) => ({ ...p, [k]: value }));
    if (errors[k]) {
      setErrors((prev) => ({ ...prev, [k]: "" }));
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));


  const getStepErrors = (targetStep = step) => {
    const nextErrors = {};
    if (targetStep === 0) {
      if (!form.species) nextErrors.species = "Υποχρεωτικό πεδίο.";
      if (!form.gender) nextErrors.gender = "Υποχρεωτικό πεδίο.";
    }
    if (targetStep === 1) {
      if (!form.foundDate) nextErrors.foundDate = "Υποχρεωτικό πεδίο.";
      if (!form.area) nextErrors.area = "Υποχρεωτικό πεδίο.";
    }
    if (targetStep === 2) {
      if (!form.reporterName) nextErrors.reporterName = "Υποχρεωτικό πεδίο.";
      if (!form.reporterSurname) nextErrors.reporterSurname = "Υποχρεωτικό πεδίο.";
      if (!form.phone) nextErrors.phone = "Υποχρεωτικό πεδίο.";
    }

    const email = String(form.email || "").trim();
    if (email && !email.includes("@")) {
      nextErrors.email = "Βάλε σωστό e-mail (με @).";
    }

    const phone = String(form.phone || "").trim();
    if (phone && phone.length > 10) {
      nextErrors.phone = "Έως 10 ψηφία.";
    }

    return nextErrors;
  };

  const validateStep = () => {
    const nextErrors = getStepErrors();
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isStepValid = () => Object.keys(getStepErrors()).length === 0;

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
                    error={Boolean(errors.species)}
                    helperText={errors.species || ""}
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
                    error={Boolean(errors.gender)}
                    helperText={errors.gender || ""}
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
                    error={Boolean(errors.foundDate)}
                    helperText={errors.foundDate || ""}
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
                    error={Boolean(errors.area)}
                    helperText={errors.area || ""}
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
                    error={Boolean(errors.reporterName)}
                    helperText={errors.reporterName || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Επίθετο*"
                    size="small"
                    fullWidth
                    value={form.reporterSurname}
                    onChange={change("reporterSurname")}
                    error={Boolean(errors.reporterSurname)}
                    helperText={errors.reporterSurname || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="E-mail"
                    size="small"
                    fullWidth
                    value={form.email}
                    onChange={change("email")}
                    error={Boolean(errors.email)}
                    helperText={errors.email || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Τηλέφωνο*"
                    size="small"
                    fullWidth
                    value={form.phone}
                    onChange={change("phone")}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone || ""}
                    inputProps={{ inputMode: "numeric", maxLength: 10 }}
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
                    onClick={() => {
                      if (validateStep()) next();
                    }}
                    disabled={saving || !isStepValid()}
                  >
                    Επόμενο
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="btn-green"
                    onClick={() => {
                      if (validateStep()) onSubmit();
                    }}
                    disabled={saving || !isStepValid()}
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
