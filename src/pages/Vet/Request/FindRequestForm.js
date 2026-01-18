import * as React from "react";
import "./LossRequest.css";
import Pet_Types from "../../Lost_Pets/Data/Pet_Types";
import { Pet_Breeds } from "../../Lost_Pets/Data/Pet_Breeds";

import { Paper, Typography, Box, TextField, MenuItem } from "@mui/material";

const extractMicrochip = (value) => {
  const s = String(value || "");
  if (!s.includes("-")) return "";
  return s.split("-").slice(1).join("-").trim();
};

export default function FindRequestForm({
  form,
  onChange,
  petWordCount,
  notesWordCount,
  errors = {},
}) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Εύρεσης</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Κατοικιδίου</Typography>
        <Box className="lr-grid">
          <TextField
            select
            size="small"
            label="Είδος: *"
            value={form.petType}
            onChange={(e) => onChange("petType", e.target.value)}
            error={Boolean(errors.petType)}
            helperText={errors.petType || ""}
          >
            {Pet_Types.map((p) => (
              <MenuItem key={p.label} value={p.label}>
                {p.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Ράτσα: *"
            value={form.petBreed}
            onChange={(e) => onChange("petBreed", e.target.value)}
            error={Boolean(errors.petBreed)}
            helperText={errors.petBreed || ""}
          >
            {Pet_Breeds.map((b) => (
              <MenuItem key={b.value || b.label} value={b.value}>
                {b.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Χρώμα: *"
            value={form.petColor}
            onChange={(e) => onChange("petColor", e.target.value)}
            error={Boolean(errors.petColor)}
            helperText={errors.petColor || ""}
          />
          <TextField
            size="small"
            label="Όνομα - Microchip: *"
            value={form.petNameMicrochip}
            onChange={(e) => {
              const value = e.target.value;
              onChange("petNameMicrochip", value);
              const micro = extractMicrochip(value);
              if (micro) onChange("petMicrochip", micro);
            }}
            error={Boolean(errors.petNameMicrochip || errors.petMicrochip)}
            helperText={errors.petNameMicrochip || errors.petMicrochip || ""}
          />
          <TextField
            size="small"
            type="url"
            label="Αρχείο με φωτογραφία του κατοικιδίου (URL): *"
            value={form.petPhoto}
            onChange={(e) => onChange("petPhoto", e.target.value)}
            placeholder="https://..."
            error={Boolean(errors.petPhoto)}
            helperText={errors.petPhoto || ""}
          />
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={4}
              fullWidth
              label="Περιγραφή Ζώου: *"
              value={form.petDescription}
              onChange={(e) => onChange("petDescription", e.target.value)}
              error={Boolean(errors.petDescription)}
              helperText={errors.petDescription || ""}
            />
            <div className="lr-counter">{petWordCount}/50 λέξεις</div>
          </Box>
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Τοποθεσία & Ημ/νία Εύρεσης</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Τοποθεσία Εύρεσης: *"
            value={form.foundArea}
            onChange={(e) => onChange("foundArea", e.target.value)}
            error={Boolean(errors.foundArea)}
            helperText={errors.foundArea || ""}
          />
          <TextField
            size="small"
            type="date"
            label="Ημερομηνία Εύρεσης: *"
            InputLabelProps={{ shrink: true }}
            value={form.foundDate}
            onChange={(e) => onChange("foundDate", e.target.value)}
            inputProps={{ max: new Date().toISOString().slice(0, 10) }}
            error={Boolean(errors.foundDate)}
            helperText={errors.foundDate || ""}
          />
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Επικοινωνίας</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα: *"
            value={form.contactFirstName}
            onChange={(e) => onChange("contactFirstName", e.target.value)}
            error={Boolean(errors.contactFirstName)}
            helperText={errors.contactFirstName || ""}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.contactPhone}
            onChange={(e) => onChange("contactPhone", e.target.value)}
            error={Boolean(errors.contactPhone)}
            helperText={errors.contactPhone || ""}
            inputProps={{ inputMode: "numeric", maxLength: 10 }}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.contactLastName}
            onChange={(e) => onChange("contactLastName", e.target.value)}
            error={Boolean(errors.contactLastName)}
            helperText={errors.contactLastName || ""}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.contactEmail}
            onChange={(e) => onChange("contactEmail", e.target.value)}
            error={Boolean(errors.contactEmail)}
            helperText={errors.contactEmail || ""}
          />
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={4}
              fullWidth
              label="Επιπλέον Πληροφορίες: *"
              value={form.contactNotes}
              onChange={(e) => onChange("contactNotes", e.target.value)}
              error={Boolean(errors.contactNotes)}
              helperText={errors.contactNotes || ""}
            />
            <div className="lr-counter">{notesWordCount}/50 λέξεις</div>
          </Box>
        </Box>
      </div>
    </Paper>
  );
}
