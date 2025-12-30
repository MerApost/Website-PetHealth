import * as React from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./LogoutSuccess.css";

export default function LogoutSuccess() {
  const navigate = useNavigate();

  return (
    <div className="logout-page">
      <Paper elevation={0} className="logout-card">
        <CheckCircleIcon className="logout-icon" />

        <Typography variant="h5" className="logout-title">
          Επιτυχής Αποσύνδεση
        </Typography>

        <Typography variant="body2" className="logout-subtitle">
          Αποσυνδεθήκατε με επιτυχία από το λογαριασμό σας
        </Typography>

        <div className="logout-buttons">
          <Button
            type="button"
            variant="contained"
            className="logout-btn-primary"
            onClick={() => navigate("/login")}
          >
            Σύνδεση
          </Button>

          <Button
            type="button"
            variant="outlined"
            className="logout-btn-secondary"
            onClick={() => navigate("/registration")}
          >
            Δημιουργία Λογαριασμού
          </Button>
        </div>

        <Typography variant="body2" className="logout-help">
          Αν χρειάζεστε βοήθεια, επικοινωνήστε μαζί μας
        </Typography>
      </Paper>
    </div>
  );
}
