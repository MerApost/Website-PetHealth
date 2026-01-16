import * as React from "react";
import "./LossRequest.css";
import Pet_Types from "../../Lost_Pets/Data/Pet_Types";
import { Pet_Breeds } from "../../Lost_Pets/Data/Pet_Breeds";
import { GenderOptions } from "../../Lost_Pets/Data/GenderOptions";

import { Paper, Typography, Box, TextField, MenuItem } from "@mui/material";

export default function AdoptionRequestForm({
  form,
  onChange,
  homeWordCount,
  lifestyleWordCount,
  experienceWordCount,
}) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Υιοθεσίας</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Υποψήφιου Υιοθετητή</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα: *"
            value={form.adopterFirstName}
            onChange={(e) => onChange("adopterFirstName", e.target.value)}
          />
          <TextField
            size="small"
            label="Διεύθυνση Κατοικίας: *"
            value={form.adopterAddress}
            onChange={(e) => onChange("adopterAddress", e.target.value)}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.adopterLastName}
            onChange={(e) => onChange("adopterLastName", e.target.value)}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.adopterEmail}
            onChange={(e) => onChange("adopterEmail", e.target.value)}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.adopterPhone}
            onChange={(e) => onChange("adopterPhone", e.target.value)}
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
              label="Πληροφορίες σχετικά με το σπίτι κατοικίας: *"
              value={form.homeInfo}
              onChange={(e) => onChange("homeInfo", e.target.value)}
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
          />
          <TextField
            select
            size="small"
            label="Ράτσα: *"
            value={form.petBreed}
            onChange={(e) => onChange("petBreed", e.target.value)}
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
          />
          <TextField
            size="small"
            label="Αριθμός Microchip: *"
            value={form.petMicrochip}
            onChange={(e) => onChange("petMicrochip", e.target.value)}
          />
          <TextField
            select
            size="small"
            label="Φύλο: *"
            value={form.petGender}
            onChange={(e) => onChange("petGender", e.target.value)}
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
