import * as React from "react";
import "./LossRequest.css";
import Pet_Types from "../../Lost_Pets/Data/Pet_Types";
import { Pet_Breeds } from "../../Lost_Pets/Data/Pet_Breeds";
import { GenderOptions } from "../../Lost_Pets/Data/GenderOptions";

import { Paper, Typography, Box, TextField, MenuItem } from "@mui/material";

export default function TransferRequestForm({ form, onChange }) {
  return (
    <Paper elevation={0} className="lr-card">
      <Typography className="lr-title">Δήλωση Μεταβίβασης</Typography>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Τωρινού Ιδιοκτήτη</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα: *"
            value={form.currentFirstName}
            onChange={(e) => onChange("currentFirstName", e.target.value)}
          />
          <TextField
            size="small"
            label="Διεύθυνση Κατοικίας: *"
            value={form.currentAddress}
            onChange={(e) => onChange("currentAddress", e.target.value)}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.currentLastName}
            onChange={(e) => onChange("currentLastName", e.target.value)}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.currentEmail}
            onChange={(e) => onChange("currentEmail", e.target.value)}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.currentPhone}
            onChange={(e) => onChange("currentPhone", e.target.value)}
          />
        </Box>
      </div>

      <div className="lr-section">
        <Typography className="lr-section-title">Στοιχεία Νέου Ιδιοκτήτη</Typography>
        <Box className="lr-grid">
          <TextField
            size="small"
            label="Όνομα: *"
            value={form.newFirstName}
            onChange={(e) => onChange("newFirstName", e.target.value)}
          />
          <TextField
            size="small"
            label="Διεύθυνση Κατοικίας: *"
            value={form.newAddress}
            onChange={(e) => onChange("newAddress", e.target.value)}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.newLastName}
            onChange={(e) => onChange("newLastName", e.target.value)}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.newEmail}
            onChange={(e) => onChange("newEmail", e.target.value)}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.newPhone}
            onChange={(e) => onChange("newPhone", e.target.value)}
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
