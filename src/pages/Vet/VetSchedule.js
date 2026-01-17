import * as React from "react";
import "./VetSchedule.css";

import {
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const days = [
  { key: "monday", label: "Δευτέρα" },
  { key: "tuesday", label: "Τρίτη" },
  { key: "wednesday", label: "Τετάρτη" },
  { key: "thursday", label: "Πέμπτη" },
  { key: "friday", label: "Παρασκευή" },
  { key: "saturday", label: "Σάββατο" },
  { key: "sunday", label: "Κυριακή" },
];

const emptyWeekly = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export default function VetSchedule() {
  const vetId = (localStorage.getItem("userId") || "").trim();
  const [scheduleId, setScheduleId] = React.useState(null);
  const [customSlots, setCustomSlots] = React.useState([]);
  const [weekly, setWeekly] = React.useState(emptyWeekly);
  const [customDate, setCustomDate] = React.useState("");
  const [customRepeat, setCustomRepeat] = React.useState("none");
  const [customNote, setCustomNote] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const repeatLabel = (value) => {
    if (value === "yearly") return "Ετήσια";
    if (value === "monthly") return "Μηνιαία";
    if (value === "weekly") return "Εβδομαδιαία";
    return "Καμία";
  };

  React.useEffect(() => {
    if (!vetId) return;
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:3004/vetSchedules?vetId=${vetId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const existing = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (!existing) return;
        setScheduleId(existing.id);
        setCustomSlots(Array.isArray(existing.customSlots) ? existing.customSlots : []);
        const rawWeekly = { ...emptyWeekly, ...(existing.weekly || {}) };
        const normalized = Object.fromEntries(
          Object.entries(rawWeekly).map(([key, slots]) => [
            key,
            Array.isArray(slots)
              ? slots.map((s) => ({ id: s.id || Date.now() + Math.random(), ...s }))
              : [],
          ])
        );
        setWeekly(normalized);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [vetId]);

  const addCustomSlot = () => {
    if (!customDate) {
      alert("Συμπλήρωσε ημερομηνία.");
      return;
    }
    setCustomSlots((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: customDate,
        repeat: customRepeat,
        note: customNote,
      },
    ]);
    setCustomDate("");
    setCustomRepeat("none");
    setCustomNote("");
  };

  const removeCustomSlot = (id) => {
    setCustomSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const addWeeklySlot = (dayKey) => {
    setWeekly((prev) => ({
      ...prev,
      [dayKey]: [...prev[dayKey], { id: Date.now(), start: "", end: "" }],
    }));
  };

  const updateWeeklySlot = (dayKey, id, key, value) => {
    setWeekly((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].map((slot) =>
        slot.id === id ? { ...slot, [key]: value } : slot
      ),
    }));
  };

  const removeWeeklySlot = (dayKey, id) => {
    setWeekly((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].filter((slot) => slot.id !== id),
    }));
  };

  const save = async () => {
    if (!vetId) {
      alert("Δεν βρέθηκε συνδεδεμένος κτηνίατρος.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        vetId,
        customSlots,
        weekly,
        updatedAt: new Date().toISOString(),
      };
      let res;
      if (scheduleId) {
        res = await fetch(`http://localhost:3004/vetSchedules/${scheduleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:3004/vetSchedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
        });
      }
      if (!res.ok) throw new Error("save failed");
      const saved = await res.json();
      setScheduleId(saved.id || scheduleId);
      alert("Η αποθήκευση ολοκληρώθηκε.");
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vs-page">
      <Typography className="vs-title">Προγραμματισμός Διαθεσιμότητας</Typography>

      <Paper elevation={0} className="vs-card">
        <div className="vs-section">
          <Typography className="vs-section-title">Γιορτές και Αργίες</Typography>
          <Typography className="vs-section-note">
            Καθορίστε τις ημερομηνίες κατα τις οποίες δεν είστε διαθέσιμοι για ραντεβού (π.χ. ειδικές αργίες).
          </Typography>

          <div className="vs-custom-row">
            <TextField
              size="small"
              type="date"
              label="Ημερομηνία"
              InputLabelProps={{ shrink: true }}
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
            <TextField
              select
              size="small"
              label="Επανάληψη"
              value={customRepeat}
              onChange={(e) => setCustomRepeat(e.target.value)}
            >
              <MenuItem value="none">Καμία</MenuItem>
              <MenuItem value="yearly">Ετήσια</MenuItem>
              <MenuItem value="monthly">Μηνιαία</MenuItem>
              <MenuItem value="weekly">Εβδομαδιαία</MenuItem>
            </TextField>
            <TextField
              size="small"
              label="Περιγραφή (Προαιρετικό)"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />
            <Button
              variant="outlined"
              className="vs-btn"
              onClick={addCustomSlot}
            >
              Προσθήκη
            </Button>
          </div>

          <div className="vs-list">
            {customSlots.length === 0 && (
              <div className="vs-empty">— Δεν υπάρχουν εξαιρέσεις</div>
            )}
            {customSlots.map((slot) => (
              <div key={slot.id} className="vs-list-item">
                <span>{slot.date}</span>
                <span>{slot.note || "—"}</span>
                <span>{repeatLabel(slot.repeat)}</span>
                <IconButton
                  size="small"
                  className="vs-icon-btn"
                  onClick={() => removeCustomSlot(slot.id)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>

          <div className="vs-warning">
            <ReportProblemOutlinedIcon fontSize="small" />
            <span>
              Δεν θα είναι διαθέσιμα ραντεβού σε αυτές τις ημερομηνίες. Οι
              ιδιοκτήτες κατοικίδιων ζώων θα δουν αυτές τις ημερομηνίες ως μη
              διαθέσιμες κατά την κράτηση.
            </span>
          </div>
        </div>

        <div className="vs-section">
          <Typography className="vs-section-title">Εβδομαδιαίο Πρόγραμμα</Typography>
          <Typography className="vs-section-note">
            Ρύθμισε τις ώρες που δέχεσαι ραντεβού ανά ημέρα.
          </Typography>

          <div className="vs-week">
            {days.map((day) => (
              <Paper key={day.key} elevation={0} className="vs-day">
                <div className="vs-day-header">
                  <Typography className="vs-day-title">{day.label}</Typography>
                </div>

                {weekly[day.key].length === 0 && (
                  <div className="vs-day-empty">
                    <EventBusyIcon className="vs-day-icon" />
                    Δεν έχει οριστεί πρόγραμμα για αυτή τη μέρα
                  </div>
                )}

                {weekly[day.key].map((slot) => (
                  <div key={slot.id} className="vs-day-row">
                    <TextField
                      size="small"
                      type="time"
                      label="Από"
                      InputLabelProps={{ shrink: true }}
                      value={slot.start}
                      onChange={(e) =>
                        updateWeeklySlot(day.key, slot.id, "start", e.target.value)
                      }
                    />
                    <TextField
                      size="small"
                      type="time"
                      label="Έως"
                      InputLabelProps={{ shrink: true }}
                      value={slot.end}
                      onChange={(e) =>
                        updateWeeklySlot(day.key, slot.id, "end", e.target.value)
                      }
                    />
                    <IconButton
                      size="small"
                      className="vs-icon-btn"
                      onClick={() => removeWeeklySlot(day.key, slot.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}

                <Button
                  variant="outlined"
                  className="vs-add-day"
                  onClick={() => addWeeklySlot(day.key)}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Προσθήκη ωραρίου ημέρας
                </Button>
              </Paper>
            ))}
          </div>
        </div>

        <div className="vs-actions">
          <Button variant="outlined" className="vs-btn" onClick={() => window.history.back()}>
            Επιστροφή
          </Button>
          <Button
            variant="contained"
            className="vs-save"
            onClick={save}
            disabled={saving}
          >
            Αποθήκευση
          </Button>
        </div>
      </Paper>
    </div>
  );
}
