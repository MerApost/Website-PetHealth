import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Paper } from "@mui/material";
import "./DeleteAccount.css";

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const [deleting, setDeleting] = React.useState(false);

  const onDeleteAccount = async () => {
    const rawId = localStorage.getItem("userId");
    const id = (rawId || "".trim());
    if (!id) {
      navigate("/main_page");
      return;
    }

    try {
      setDeleting(true);
      const res = await fetch(`http://localhost:3004/users/${id}`, { method: "DELETE" });

      if (!res.ok && res.status !== 204) {
        const txt = await res.text();
        throw new Error(txt || "Delete failed");
      }

      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      navigate("/main_page");
    } catch (e) {
      console.error(e);
      alert("Αποτυχία διαγραφής λογαριασμού.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="delete-page">
      <Paper elevation={0} className="delete-card">
        <Box className="delete-icon">!</Box>

        <Typography className="delete-title">Διαγραφή Λογαριασμού</Typography>
        <Typography className="delete-subtitle">
          Είστε σίγουροι πως θέλετε να διαγράψετε το λογαριασμό σας;
        </Typography>
        <Typography className="delete-hint">
          Μετά τη διαγραφή μπορεί να γίνει επαναφορά του λογαριασμού σας για τις επόμενες 14 ημέρες.
        </Typography>

        <Box className="delete-actions">
          <Button
            variant="outlined"
            className="delete-cancel"
            onClick={() => navigate(-1)}
            disabled={deleting}
          >
            Ακύρωση
          </Button>

          <Button
            variant="contained"
            color="error"
            className="delete-confirm"
            onClick={onDeleteAccount}
            disabled={deleting}
          >
            Οριστική Διαγραφή
          </Button>
        </Box>

        <Typography className="delete-footer">
          Αν χρειάζεστε βοήθεια, επικοινωνήστε μαζί μας
        </Typography>
      </Paper>
    </div>
  );
}
