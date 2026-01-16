import * as React from "react";
import "./LossRequest.css";

import { Paper, Typography, Box, TextField } from "@mui/material";

export default function LossRequestPreview({ form }) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Απώλειας</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Ιδιοκτήτη</Typography>
        <Box className="lr-grid">
          <TextField size="small" label="Όνομα: *" value={form.ownerFirstName} disabled />
          <TextField size="small" label="Διεύθυνση Κατοικίας:" value={form.ownerAddress} disabled />
          <TextField size="small" label="Επώνυμο: *" value={form.ownerLastName} disabled />
          <TextField size="small" label="E-mail: *" value={form.ownerEmail} disabled />
          <TextField size="small" label="Τηλέφωνο: *" value={form.ownerPhone} disabled />
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Κατοικιδίου</Typography>
        <Box className="lr-grid">
          <TextField size="small" label="Όνομα Κατοικιδίου: *" value={form.petName} disabled />
          <TextField size="small" label="Ράτσα: *" value={form.petBreed} disabled />
          <TextField size="small" label="Είδος: *" value={form.petType} disabled />
          <TextField size="small" label="Ηλικία (έτη): *" value={form.petAge} disabled />
          <TextField size="small" label="Αριθμός Microchip: *" value={form.petMicrochip} disabled />
          <TextField size="small" label="Χρώμα:" value={form.petColor} disabled />
          <TextField
            size="small"
            label="Φωτογραφία κατοικιδίου (URL):"
            value={form.petPhoto}
            disabled
          />
          <TextField size="small" label="Φύλο: *" value={form.petGender} disabled />
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Επιπλέον Στοιχεία</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Ημερομηνία Απώλειας: *"
            value={form.lossDate}
            disabled
          />
          <TextField
            size="small"
            label="Περιοχή Απώλειας: *"
            value={form.lossArea}
            disabled
          />
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={4}
              fullWidth
              label="Περιγραφή Περιστατικού: *"
              value={form.lossDescription}
              disabled
            />
          </Box>
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Κτηνιάτρου</Typography>
        <Box className="lr-grid">
          <TextField size="small" label="Όνομα: *" value={form.vetFirstName} disabled />
          <TextField size="small" label="Τηλέφωνο: *" value={form.vetPhone} disabled />
          <TextField size="small" label="Επώνυμο: *" value={form.vetLastName} disabled />
        </Box>
      </div>
    </Paper>
  );
}
