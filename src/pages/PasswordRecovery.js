import * as React from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import "./PasswordRecovery.css";

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");

  const onSubmit = (e) => {

    // ΠΡΟΣΩΡΙΝΟ – αργότερα JSON Server
    console.log("Recovery email:", email);

    alert("Αν το email υπάρχει, θα σταλούν οδηγίες.");
  };

  return (
    <div className="pw-recovery-page">
      <Paper elevation={0} className="pw-recovery-card">

        <Typography variant="h6" className="pw-recovery-title">
          Ανάκτηση Κωδικού
        </Typography>

        <Typography variant="body2" className="pw-recovery-subtitle">
           Εισάγετε το email σας και θα σας στείλουμε οδηγίες για να ορίσετε νέο κωδικό
        </Typography>

        <form onSubmit={onSubmit} className="pw-recovery-form">
          <TextField
            label="Email:"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            className="pw-recovery-btn"
          >
            Αποστολή οδηγιών
          </Button>

        </form>

        <div className="pw-recovery-links">
          <Link component="button" onClick={() => navigate("/login")}>
            Θυμηθήκατε τον κωδικό σας; Σύνδεση
          </Link>
          <Link component="button" onClick={() => navigate("/registration")}>
            Δεν έχετε λογαριασμό; Εγγραφή
          </Link>
        </div>

      </Paper>
    </div>
  );
}
