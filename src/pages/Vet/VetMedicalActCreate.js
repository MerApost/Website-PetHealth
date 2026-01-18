import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./VetMedicalActCreate.css";

import {
  Paper,
  Typography,
  Grid,
  TextField,  
  Button,
  Box,
  MenuItem,
  CssBaseline,
} from "@mui/material";

import BackButton from "../../components/BackButton/BackButton";
import VetDashboard from "./VetDashboard";

const initial = {
  actType: "",
  vaccine: "",
  surgeryDesc: "",
  medication: "",
  frequency: "",
  dosage: 1,
  actDate: "",
  instructions: "",
};

const countWords = (text) => {
  const s = String(text || "").trim();
  if (!s) return 0;
  return s.split(/\s+/).filter(Boolean).length;
};

export default function VetMedicalActCreate() {
  const navigate = useNavigate();
  const { ownerId, petId } = useParams();
  const [searchParams] = useSearchParams();

  const [form, setForm] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const vetId = (localStorage.getItem("userId") || "").trim();
  const editId = searchParams.get("editId");

  React.useEffect(() => {
    if (!vetId) navigate("/login");
  }, [vetId, navigate]);

  React.useEffect(() => {
    if (!editId) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3004/medicalActs/${editId}`
        );
        if (!res.ok) throw new Error("load failed");
        const data = await res.json();
        setForm({
          actType: data.actType || "",
          vaccine: data.vaccine || "",
          surgeryDesc: data.surgeryDesc || "",
          medication: data.medication || "",
          frequency: data.frequency || "",
          dosage: Number(data.dosage) || 1,
          actDate: data.actDate || "",
          instructions: data.instructions || "",
        });
      } catch (e) {
        console.error(e);
        alert("Αποτυχία φόρτωσης πράξης.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [editId]);

  //YYYY-MM-DD για να μπει ως max στο input type="date"
  //ο χρήστης δεν θα μπορεί να βάλει μελλοντική ημερομηνία
  const maxBirthDate = React.useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const change = (k) => (e) => {
    const value = e.target.value;
    setForm((p) => ({ ...p, [k]: value }));
    if (errors[k]) {
      setErrors((prev) => ({ ...prev, [k]: "" }));
    }
  };

  const hasAtLeastOne = () =>
    Object.values(form).some((v) => String(v || "").trim() !== "");

  const requiredOk = () => form.actType.trim() && form.actDate.trim(); //για οριστική υποβολή

  const save = async (status) => {
    if (!vetId) return navigate("/login");

    if (status === "draft" && !hasAtLeastOne()) {
      alert("Για προσωρινή αποθήκευση συμπλήρωσε τουλάχιστον 1 πεδίο.");
      return;
    }
    if (status === "final" && !requiredOk()) {
      const nextErrors = {};
      if (!form.actType.trim()) nextErrors.actType = "Υποχρεωτικό πεδίο.";
      if (!form.actDate.trim()) nextErrors.actDate = "Υποχρεωτικό πεδίο.";
      setErrors(nextErrors);
      alert("Για οριστική υποβολή πρέπει να συμπληρωθούν τα υποχρεωτικά πεδία (*).");
      return;
    }

    if (countWords(form.surgeryDesc) > 50) {
      alert("Η 'Περιγραφή Χειρουργείου' πρέπει να είναι έως 50 λέξεις.");
      return;
    }
    if (countWords(form.instructions) > 50) {
      alert("Οι 'Οδηγίες' πρέπει να είναι έως 50 λέξεις.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        petId,
        ownerId,
        vetId,
        status, // draft/final
        ...form,
        updatedAt: new Date().toISOString(),
      };

      let res;
      if (editId && editId !== "undefined" && editId !== "null") {
        res = await fetch(`http://localhost:3004/medicalActs/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 404) {
          res = await fetch("http://localhost:3004/medicalActs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              createdAt: new Date().toISOString(),
            }),
          });
        }
      } else {
        res = await fetch("http://localhost:3004/medicalActs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            createdAt: new Date().toISOString(),
          }),
        });
      }

      if (!res.ok) throw new Error("POST failed");

      navigate(`/vet_main/${vetId}/health-book/${ownerId}/${petId}`);
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  const removeDraft = async () => {
    if (!editId) return;
    const ok = window.confirm("Θέλεις σίγουρα να διαγράψεις την πράξη;");
    if (!ok) return;

    try {
      setSaving(true);
      const res = await fetch(
        `http://localhost:3004/medicalActs/${editId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("DELETE failed");
      navigate(`/vet_main/${vetId}/health-book/${ownerId}/${petId}`);
    } catch (e) {
      console.error(e);
      alert("Αποτυχία διαγραφής.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="microchip" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="ma-page">
          <Typography className="ma-title">Καταγραφή Ιατρικών Πράξεων</Typography>

          <Paper elevation={0} className="ma-card">
        <Grid container spacing={2} className="ma-grid">
          <Grid item xs={12} md={4} className="ma-labels">
            <div className="ma-label bold">Ιατρική Πράξη: *</div>
            <div className="ma-label muted">Εμβόλιο:</div>
            <div className="ma-label muted">Περιγραφή Χειρουργείου:</div>

            <div className="ma-spacer" />

            <div className="ma-label bold">Φαρμακευτική Αγωγή:</div>
            <div className="ma-label bold">Συχνότητα:</div>
            <div className="ma-label bold">Δοσολογία:</div>
            <div className="ma-label bold">Ημ/νία: *</div>
            <div className="ma-label muted">Οδηγίες:</div>
          </Grid>

          <Grid item xs={12} md={8} className="ma-inputs">
            <TextField
              select
              size="small"
              fullWidth
              value={form.actType}
              onChange={change("actType")}
              className="ma-input"
              disabled={loading}
              error={Boolean(errors.actType)}
              helperText={errors.actType || ""}
            >
              <MenuItem value=""></MenuItem>
              <MenuItem value="Εμβολιασμός">Εμβολιασμός</MenuItem>
              <MenuItem value="Αποπαρασίτωση">Αποπαρασίτωση</MenuItem>
              <MenuItem value="Χειρουργείο">Χειρουργείο</MenuItem>
              <MenuItem value="Εξέταση">Εξέταση</MenuItem>
              <MenuItem value="Άλλο">Άλλο</MenuItem>
            </TextField>

            <TextField
              size="small"
              fullWidth
              value={form.vaccine}
              onChange={change("vaccine")}
              className="ma-input"
              disabled={loading}
            />

            <Box className="ma-textareaWrap">
              <TextField
                multiline
                minRows={2}
                fullWidth
                value={form.surgeryDesc}
                onChange={change("surgeryDesc")}
                className="ma-textarea"
                disabled={loading}
              />
              <div className="ma-counter">{countWords(form.surgeryDesc)}/50 λέξεις</div>
            </Box>

            <div className="ma-gap" />

            <TextField
              size="small"
              fullWidth
              value={form.medication}
              onChange={change("medication")}
              className="ma-input"
              disabled={loading}
            />
            <TextField
              size="small"
              fullWidth
              value={form.frequency}
              onChange={change("frequency")}
              className="ma-input"
              disabled={loading}
            />
            <TextField
              type="number"
              size="small"
              fullWidth
              value={form.dosage}
              onChange={change("dosage")}
              className="ma-input"
              inputProps={{ min: 1, step: 1 }}
              disabled={loading}
            />

            <TextField
              type="date"
              size="small"
              fullWidth
              value={form.actDate}
              onChange={change("actDate")}
              className="ma-input ma-date"
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: maxBirthDate }}
              disabled={loading}
              error={Boolean(errors.actDate)}
              helperText={errors.actDate || ""}
            />

            <Box className="ma-textareaWrap">
              <TextField
                multiline
                minRows={2}
                fullWidth
                value={form.instructions}
                onChange={change("instructions")}
                className="ma-textarea"
                disabled={loading}
              />
              <div className="ma-counter">{countWords(form.instructions)}/50 λέξεις</div>
            </Box>
          </Grid>
        </Grid>

        <Box className="ma-actions">
          {editId && (
            <Button
              variant="contained"
              className="ma-btn-red"
              disabled={saving}
              onClick={removeDraft}
            >
              Διαγραφή
            </Button>
          )}

          <Button
            variant="contained"
            className="ma-btn-blue"
            disabled={saving}
            onClick={() => save("draft")}
          >
            Προσωρινή Αποθήκευση
          </Button>

          <Button
            variant="contained"
            className="ma-btn-green"
            disabled={saving}
            onClick={() => save("final")}
          >
            Οριστική Υποβολή
          </Button>
        </Box>
          </Paper>

          <div className="ma-back">
            <BackButton />
          </div>
        </div>
      </Box>
    </Box>
  );
}
