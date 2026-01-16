import * as React from "react";
import "./LossRequest.css";

import { Paper, Typography, Box, TextField } from "@mui/material";

export default function FindRequestPreview({ form }) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Εύρεσης</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Κατοικιδίου</Typography>
        <Box className="lr-grid">
          <TextField size="small" label="Είδος: *" value={form.petType} disabled />
          <TextField size="small" label="Ράτσα: *" value={form.petBreed} disabled />
          <TextField size="small" label="Χρώμα: *" value={form.petColor} disabled />
          <TextField
            size="small"
            label="Όνομα - Microchip: *"
            value={form.petNameMicrochip}
            disabled
          />
          <TextField
            size="small"
            label="Αρχείο με φωτογραφία του κατοικιδίου (URL): *"
            value={form.petPhoto}
            disabled
          />
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={4}
              fullWidth
              label="Περιγραφή Ζώου: *"
              value={form.petDescription}
              disabled
            />
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
            disabled
          />
          <TextField
            size="small"
            label="Ημερομηνία Εύρεσης: *"
            value={form.foundDate}
            disabled
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
            disabled
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.contactPhone}
            disabled
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.contactLastName}
            disabled
          />
          <TextField
            size="small"
            label="E-mail: *"
            value={form.contactEmail}
            disabled
          />
          <Box className="lr-textarea">
            <TextField
              multiline
              minRows={4}
              fullWidth
              label="Επιπλέον Πληροφορίες: *"
              value={form.contactNotes}
              disabled
            />
          </Box>
        </Box>
      </div>
    </Paper>
  );
}
