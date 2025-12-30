import * as React from "react";
import "./Login.css";

import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";



export default function Logi({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [role, setRole] = React.useState("owner");
  const [afm, setAfm] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // ΠΡΟΣΩΡΙΝΟ: μέχρι να βάλουμε JSON Server 
    setIsLoggedIn(true);
    console.log({ role, afm, password });

    if (role === "owner") navigate("/owner");
    else navigate("/vet");
  };

  return (
    <div className="auth-page">
      <Paper elevation={0} className="auth-card">
        <Typography variant="h6" className="auth-title">
          Καλώς ήρθατε
        </Typography>

        <Typography variant="body2" className="auth-subtitle">
          Συνδεθείτε στο λογαριασμό σας
        </Typography>

        <ToggleButtonGroup
        exclusive
        value={role}
        onChange={(_e, val) => val && setRole(val)}
        className="auth-toggle"
        >
        <ToggleButton value="owner" className="auth-toggle-btn">
            Ιδιοκτήτης
        </ToggleButton>
        <ToggleButton value="vet" className="auth-toggle-btn">
            Κτηνίατρος
        </ToggleButton>
        </ToggleButtonGroup>

        <Box component="form" onSubmit={onSubmit} className="auth-form">
          <TextField
            label="ΑΦΜ:"
            required
            value={afm}
            onChange={(e) => setAfm(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Κωδικός Πρόσβασης:"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
          />

          <Button type="submit" variant="contained" className="auth-submit">
            Σύνδεση
          </Button>

          <div className="auth-register">
            <span className="auth-register-text">Δεν έχετε λογαριασμό;</span>
            <Button
                type="button"
                variant="text"
                className="auth-link-btn"
                onClick={() => {navigate("/registration");}}>
            Εγγραφή
            </Button>

            </div>

          <div className="auth-links">
            <Link
              component="button"
              variant="body2"
              className="auth-link"
              onClick={() => navigate("/forgot-password")}
            >
              Ξέχασες τον κωδικό σου;
            </Link>
            </div>

            
        </Box>
      </Paper>
    </div>
  );
}
