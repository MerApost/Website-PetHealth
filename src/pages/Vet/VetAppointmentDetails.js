import * as React from "react";
import "./VetAppointmentDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function VetAppointmentDetails() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [pet, setPet] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:3004/appointments/${appointmentId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setAppointment(data);
        if (data?.ownerId) {
          const ownerRes = await fetch(
            `http://localhost:3004/users/${data.ownerId}`
          );
          if (ownerRes.ok) {
            const ownerData = await ownerRes.json();
            setOwner(ownerData);
            const foundPet = ownerData?.pets?.find(
              (p) => String(p.id) === String(data.petId)
            );
            setPet(foundPet || null);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [appointmentId]);

  if (!appointment) {
    return (
      <div className="vad-page">
        <Paper elevation={0} className="vad-card">
          <Typography>Φόρτωση…</Typography>
        </Paper>
      </div>
    );
  }

  return (
    <div className="vad-page">
      <Paper elevation={0} className="vad-card">
        <Typography className="vad-title">Πληροφορίες Ραντεβού</Typography>
        <Typography className="vad-subtitle">
          Προβολή στοιχείων ραντεβού
        </Typography>

        <div className="vad-date-row">
          <div className="vad-pill">
            <CalendarMonthIcon className="vad-pill-icon" />
            {appointment.date || "—"}
          </div>
          <div className="vad-pill">
            <AccessTimeIcon className="vad-pill-icon" />
            {appointment.time || "—"}
          </div>
        </div>

        <Paper elevation={0} className="vad-panel">
          <Typography className="vad-section-title">Στοιχεία Κατοικιδίου</Typography>
          <div className="vad-pet">
            <div className="vad-photo">
              {pet?.photo ? (
                <img src={pet.photo} alt={pet.name || "pet"} />
              ) : (
                <div className="vad-photo-placeholder">—</div>
              )}
            </div>
            <div className="vad-grid">
              <div><b>Όνομα:</b> {pet?.name || "—"}</div>
              <div><b>Microchip:</b> {pet?.microchip || "—"}</div>
              <div><b>Είδος:</b> {pet?.type || "—"}</div>
              <div><b>Φύλο:</b> {pet?.gender || "—"}</div>
              <div><b>Ράτσα:</b> {pet?.breed || "—"}</div>
              <div><b>Ηλικία:</b> {pet?.age ? `${pet.age} ετών` : "—"}</div>
            </div>
          </div>

          <Typography className="vad-section-title">Υπηρεσίες Ραντεβού</Typography>
          <div className="vad-service">
            <span>{appointment.service || "—"}</span>
          </div>

          <Typography className="vad-section-title">Σημειώσεις Ραντεβού</Typography>
          <div className="vad-notes">
            {appointment.notes || "—"}
          </div>

          <Typography className="vad-section-title">Υπενθυμίσεις</Typography>
          <ol className="vad-list">
            <li>Να είναι νηστικός για 2 ώρες πριν το ραντεβού.</li>
            <li>Να προσκομίσει δείγμα ούρων, αν αυτό είναι δυνατόν.</li>
          </ol>

          <Typography className="vad-section-title">Ιδιοκτήτης</Typography>
          <div className="vad-owner">
            <div className="vad-owner-photo">
              {owner?.photo ? (
                <img src={owner.photo} alt="owner" />
              ) : (
                <div className="vad-photo-placeholder">—</div>
              )}
            </div>
            <div className="vad-owner-info">
              <div className="vad-owner-name">
                {owner ? `${owner.name || ""} ${owner.surname || ""}`.trim() : "—"}
              </div>
              <div className="vad-owner-line">
                <PhoneIcon className="vad-owner-icon" />
                {owner?.phone || "—"}
              </div>
              <div className="vad-owner-line">
                <EmailIcon className="vad-owner-icon" />
                {owner?.email || "—"}
              </div>
            </div>
          </div>
        </Paper>

        <div className="vad-actions">
          <Button
            variant="outlined"
            className="vad-btn reject"
            onClick={() => navigate(-1)}
          >
            Απόρριψη
          </Button>
          <Button
            variant="outlined"
            className="vad-btn back"
            onClick={() => navigate(-1)}
          >
            Επιστροφή
          </Button>
        </div>
      </Paper>
    </div>
  );
}
