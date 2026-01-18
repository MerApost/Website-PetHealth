import * as React from "react";
import "./LossRequest.css";
import Pet_Types from "../../Lost_Pets/Data/Pet_Types";
import { Pet_Breeds } from "../../Lost_Pets/Data/Pet_Breeds";
import { GenderOptions } from "../../Lost_Pets/Data/GenderOptions";

import { Paper, Typography, Box, TextField, MenuItem } from "@mui/material";

export default function LossRequestForm({ form, onChange, wordCount, disableVet, errors = {} }) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Απώλειας</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Ιδιοκτήτη</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα: *"
            value={form.ownerFirstName}
            onChange={(e) => onChange("ownerFirstName", e.target.value)}
            error={Boolean(errors.ownerFirstName)}
            helperText={errors.ownerFirstName || ""}
          />
          <TextField
            size="small"
            label="Διεύθυνση Κατοικίας:"
            value={form.ownerAddress}
            onChange={(e) => onChange("ownerAddress", e.target.value)}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.ownerLastName}
            onChange={(e) => onChange("ownerLastName", e.target.value)}
            error={Boolean(errors.ownerLastName)}
            helperText={errors.ownerLastName || ""}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.ownerEmail}
            onChange={(e) => onChange("ownerEmail", e.target.value)}
            error={Boolean(errors.ownerEmail)}
            helperText={errors.ownerEmail || ""}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.ownerPhone}
            onChange={(e) => onChange("ownerPhone", e.target.value)}
            error={Boolean(errors.ownerPhone)}
            helperText={errors.ownerPhone || ""}
            inputProps={{ inputMode: "numeric", maxLength: 10 }}
          />
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Κατοικιδίου</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα Κατοικιδίου: *"
            value={form.petName}
            onChange={(e) => onChange("petName", e.target.value)}
            error={Boolean(errors.petName)}
            helperText={errors.petName || ""}
          />
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
            size="small"
            label="Ηλικία (έτη): *"
            value={form.petAge}
            onChange={(e) => onChange("petAge", e.target.value)}
            error={Boolean(errors.petAge)}
            helperText={errors.petAge || ""}
          />
          <TextField
            size="small"
            label="Αριθμός Microchip: *"
            value={form.petMicrochip}
            onChange={(e) => onChange("petMicrochip", e.target.value)}
            error={Boolean(errors.petMicrochip)}
            helperText={errors.petMicrochip || ""}
          />
          <TextField
            size="small"
            label="Χρώμα:"
            value={form.petColor}
            onChange={(e) => onChange("petColor", e.target.value)}
          />
          <TextField
            size="small"
            type="url"
            label="Φωτογραφία κατοικιδίου (URL):"
            value={form.petPhoto}
            onChange={(e) => onChange("petPhoto", e.target.value)}
            placeholder="https://..."
          />
          <TextField
            select
            size="small"
            label="Φύλο: *"
            value={form.petGender}
            onChange={(e) => onChange("petGender", e.target.value)}
            error={Boolean(errors.petGender)}
            helperText={errors.petGender || ""}
          >
            {GenderOptions.map((g) => (
              <MenuItem key={g.value || g.label} value={g.value}>
                {g.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Επιπλέον Στοιχεία</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            type="date"
            label="Ημερομηνία Απώλειας: *"
            InputLabelProps={{ shrink: true }}
            value={form.lossDate}
            onChange={(e) => onChange("lossDate", e.target.value)}
            inputProps={{ max: new Date().toISOString().slice(0, 10) }}
            error={Boolean(errors.lossDate)}
            helperText={errors.lossDate || ""}
          />
          <TextField
            size="small"
            label="Περιοχή Απώλειας: *"
            value={form.lossArea}
            onChange={(e) => onChange("lossArea", e.target.value)}
            error={Boolean(errors.lossArea)}
            helperText={errors.lossArea || ""}
          />
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={4}
              fullWidth
              label="Περιγραφή Περιστατικού: *"
              value={form.lossDescription}
              onChange={(e) => onChange("lossDescription", e.target.value)}
              error={Boolean(errors.lossDescription)}
              helperText={errors.lossDescription || ""}
            />
            <div className="lr-counter">{wordCount}/50 λέξεις</div>
          </Box>
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Κτηνιάτρου</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα: *"
            value={form.vetFirstName}
            onChange={(e) => onChange("vetFirstName", e.target.value)}
            disabled={disableVet}
            error={Boolean(errors.vetFirstName)}
            helperText={errors.vetFirstName || ""}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.vetPhone}
            onChange={(e) => onChange("vetPhone", e.target.value)}
            disabled={disableVet}
            error={Boolean(errors.vetPhone)}
            helperText={errors.vetPhone || ""}
            inputProps={{ inputMode: "numeric", maxLength: 10 }}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.vetLastName}
            onChange={(e) => onChange("vetLastName", e.target.value)}
            disabled={disableVet}
            error={Boolean(errors.vetLastName)}
            helperText={errors.vetLastName || ""}
          />
        </Box>
      </div>
    </Paper>
  );
}
