import * as React from "react";
import "./LossRequest.css";
import Pet_Types from "../../Lost_Pets/Data/Pet_Types";
import { Pet_Breeds } from "../../Lost_Pets/Data/Pet_Breeds";
import { GenderOptions } from "../../Lost_Pets/Data/GenderOptions";

import { Paper, Typography, Box, TextField, MenuItem } from "@mui/material";

export default function TransferRequestForm({ form, onChange, errors = {} }) {
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
            error={Boolean(errors.currentFirstName)}
            helperText={errors.currentFirstName || ""}
          />
          <TextField
            size="small"
            label="Διεύθυνση Κατοικίας: *"
            value={form.currentAddress}
            onChange={(e) => onChange("currentAddress", e.target.value)}
            error={Boolean(errors.currentAddress)}
            helperText={errors.currentAddress || ""}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.currentLastName}
            onChange={(e) => onChange("currentLastName", e.target.value)}
            error={Boolean(errors.currentLastName)}
            helperText={errors.currentLastName || ""}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.currentEmail}
            onChange={(e) => onChange("currentEmail", e.target.value)}
            error={Boolean(errors.currentEmail)}
            helperText={errors.currentEmail || ""}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.currentPhone}
            onChange={(e) => onChange("currentPhone", e.target.value)}
            error={Boolean(errors.currentPhone)}
            helperText={errors.currentPhone || ""}
            inputProps={{ inputMode: "numeric", maxLength: 10 }}
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
            error={Boolean(errors.newFirstName)}
            helperText={errors.newFirstName || ""}
          />
          <TextField
            size="small"
            label="Διεύθυνση Κατοικίας: *"
            value={form.newAddress}
            onChange={(e) => onChange("newAddress", e.target.value)}
            error={Boolean(errors.newAddress)}
            helperText={errors.newAddress || ""}
          />
          <TextField
            size="small"
            label="Επώνυμο: *"
            value={form.newLastName}
            onChange={(e) => onChange("newLastName", e.target.value)}
            error={Boolean(errors.newLastName)}
            helperText={errors.newLastName || ""}
          />
          <TextField
            size="small"
            type="email"
            label="E-mail: *"
            value={form.newEmail}
            onChange={(e) => onChange("newEmail", e.target.value)}
            error={Boolean(errors.newEmail)}
            helperText={errors.newEmail || ""}
          />
          <TextField
            size="small"
            label="Τηλέφωνο: *"
            value={form.newPhone}
            onChange={(e) => onChange("newPhone", e.target.value)}
            error={Boolean(errors.newPhone)}
            helperText={errors.newPhone || ""}
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
