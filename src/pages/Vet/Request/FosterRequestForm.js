import * as React from "react";
import "./LossRequest.css";
import Pet_Types from "../../Lost_Pets/Data/Pet_Types";
import { Pet_Breeds } from "../../Lost_Pets/Data/Pet_Breeds";
import { GenderOptions } from "../../Lost_Pets/Data/GenderOptions";

import { Paper, Typography, Box, TextField, MenuItem } from "@mui/material";

export default function FosterRequestForm({
  form,
  onChange,
  homeWordCount,
  lifestyleWordCount,
  experienceWordCount,
  errors = {},
}) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Αναδοχής</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Ανάδοχου</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα: *"
            value={form.fosterFirstName}
            onChange={(e) => onChange("fosterFirstName", e.target.value)}
            error={Boolean(errors.fosterFirstName)}
            helperText={errors.fosterFirstName || ""}
          />
          <TextField
            size="small"
            label="Διεύθυνση Κατοικίας: *"
            value={form.fosterAddress}
            onChange={(e) => onChange("fosterAddress", e.target.value)}
            error={Boolean(errors.fosterAddress)}
            helperText={errors.fosterAddress || ""}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.fosterLastName}
            onChange={(e) => onChange("fosterLastName", e.target.value)}
            error={Boolean(errors.fosterLastName)}
            helperText={errors.fosterLastName || ""}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.fosterEmail}
            onChange={(e) => onChange("fosterEmail", e.target.value)}
            error={Boolean(errors.fosterEmail)}
            helperText={errors.fosterEmail || ""}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.fosterPhone}
            onChange={(e) => onChange("fosterPhone", e.target.value)}
            error={Boolean(errors.fosterPhone)}
            helperText={errors.fosterPhone || ""}
            inputProps={{ inputMode: "numeric", maxLength: 10 }}
          />
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Επιπλέον Πληροφορίες</Typography>
        <Box className="lr-grid">
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={3}
              fullWidth
              label="Πληροφορίες σχετικά με το τύπο κατοικίας: *"
              value={form.homeInfo}
              onChange={(e) => onChange("homeInfo", e.target.value)}
              error={Boolean(errors.homeInfo)}
              helperText={errors.homeInfo || ""}
            />
            <div className="lr-counter">{homeWordCount}/50 λέξεις</div>
          </Box>
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={3}
              fullWidth
              label="Πληροφορίες σχετικά με τον τρόπο ζωής: *"
              value={form.lifestyleInfo}
              onChange={(e) => onChange("lifestyleInfo", e.target.value)}
              error={Boolean(errors.lifestyleInfo)}
              helperText={errors.lifestyleInfo || ""}
            />
            <div className="lr-counter">{lifestyleWordCount}/50 λέξεις</div>
          </Box>
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={3}
              fullWidth
              label="Πληροφορίες σχετικά με την εμπειρία με τα κατοικίδια ζώα: *"
              value={form.experienceInfo}
              onChange={(e) => onChange("experienceInfo", e.target.value)}
              error={Boolean(errors.experienceInfo)}
              helperText={errors.experienceInfo || ""}
            />
            <div className="lr-counter">{experienceWordCount}/50 λέξεις</div>
          </Box>
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
    </Paper>
  );
}
