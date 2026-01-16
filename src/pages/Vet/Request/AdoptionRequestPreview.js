import * as React from "react";
import "./LossRequest.css";

import { Paper, Typography, Box, TextField } from "@mui/material";

export default function AdoptionRequestPreview({ form }) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Υιοθεσίας</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Υποψήφιου Υιοθετητή</Typography>
        <Box className="lr-grid">
          <TextField size="small" label="Όνομα: *" value={form.adopterFirstName} disabled />
          <TextField size="small" label="Διεύθυνση Κατοικίας: *" value={form.adopterAddress} disabled />
          <TextField size="small" label="Επώνυμο: *" value={form.adopterLastName} disabled />
          <TextField size="small" label="E-mail: *" value={form.adopterEmail} disabled />
          <TextField size="small" label="Τηλέφωνο: *" value={form.adopterPhone} disabled />
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
              disabled
            />
          </Box>
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={3}
              fullWidth
              label="Πληροφορίες σχετικά με τον τρόπο ζωής: *"
              value={form.lifestyleInfo}
              disabled
            />
          </Box>
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={3}
              fullWidth
              label="Πληροφορίες σχετικά με την εμπειρία με τα κατοικίδια ζώα: *"
              value={form.experienceInfo}
              disabled
            />
          </Box>
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
