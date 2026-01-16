import * as React from "react";
import "./LossRequest.css";

import { Paper, Typography, Box, TextField } from "@mui/material";

export default function TransferRequestPreview({ form }) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Μεταβίβασης</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Τωρινού Ιδιοκτήτη</Typography>
        <Box className="lr-grid">
          <TextField size="small" label="Όνομα: *" value={form.currentFirstName} disabled />
          <TextField size="small" label="Διεύθυνση Κατοικίας: *" value={form.currentAddress} disabled />
          <TextField size="small" label="Επώνυμο: *" value={form.currentLastName} disabled />
          <TextField size="small" label="E-mail: *" value={form.currentEmail} disabled />
          <TextField size="small" label="Τηλέφωνο: *" value={form.currentPhone} disabled />
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Νέου Ιδιοκτήτη</Typography>
        <Box className="lr-grid">
          <TextField size="small" label="Όνομα: *" value={form.newFirstName} disabled />
          <TextField size="small" label="Διεύθυνση Κατοικίας: *" value={form.newAddress} disabled />
          <TextField size="small" label="Επώνυμο: *" value={form.newLastName} disabled />
          <TextField size="small" label="E-mail: *" value={form.newEmail} disabled />
          <TextField size="small" label="Τηλέφωνο: *" value={form.newPhone} disabled />
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
          <TextField size="small" label="Φύλο: *" value={form.petGender} disabled />
        </Box>
      </div>
    </Paper>
  );
}
