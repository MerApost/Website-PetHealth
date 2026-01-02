import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./VetProfile.css";

import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
} from "@mui/material";

import BackButton from "../../components/BackButton/BackButton";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

export default function VetProfileView() {
  const navigate = useNavigate();
  const [vet, setVet] = React.useState(null);

  React.useEffect(() => {
    const rawId = localStorage.getItem("userId");
    const id = encodeURIComponent((rawId || "").trim());

    if (!id) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3004/users/${id}`)
      .then((r) => r.json())
      .then((u) => {
        if (u.role !== "vet") {
          alert("Δεν είστε κτηνίατρος.");
          navigate("/");
          return;
        }
        setVet(u);
      })
      .catch(() => alert("Σφάλμα φόρτωσης προφίλ κτηνίατρου"));
  }, [navigate]);

  if (!vet) {
    return <div className="loading">Φόρτωση...</div>;
  }

  const fullName = `${vet.name || ""} ${vet.surname || ""}`.trim();

  return (
    <div className="profile-page">
      <Typography className="profile-title">Προβολή Προφίλ</Typography>

      <Paper elevation={0} className="profile-card">
        <Box className="profile-top">
          <Typography className="profile-section-title">Προσωπικά Στοιχεία</Typography>

          <Button
            variant="outlined"
            size="small"
            className="profile-edit-btn"
            onClick={() => navigate("/vet/profile/edit")}
          >
            Επεξεργασία
          </Button>
        </Box>

        <Divider className="profile-divider" />

        <Grid container spacing={2} className="profile-info-grid">
          <Grid item xs={12} md={8}>
            <div className="profile-info">
              <div className="profile-row"><span>Ονοματεπώνυμο:</span><b>{fullName}</b></div>
              <div className="profile-row"><span>Ε-mail:</span><b>{vet.email}</b></div>
              <div className="profile-row"><span>Τηλέφωνο:</span><b>{vet.phone}</b></div>
              <div className="profile-row"><span>ΑΦΜ:</span><b>{vet.afm}</b></div>
              <div className="profile-row"><span>Φύλο:</span><b>{vet.gender}</b></div>
              <div className="profile-row"><span>Εμπειρία:</span><b>{vet.experience} χρόνια</b></div>
              <div className="profile-row"><span>Επίπεδο Σπουδών:</span><b>{vet.studiesLevel}</b></div>
              <div className="profile-row"><span>Διεύθυνση Κλινικής:</span><b>{vet.clinicAddress}</b></div>
              <div className="profile-row"><span>Ειδικότητα:</span><b>{vet.specialty}</b></div>
              <div className="profile-row"><span>Αρ. Άδειας:</span><b>{vet.licenseNumber}</b></div>
              <div className="profile-row"><span>Επάγγελμα:</span><b>{vet.profession}</b></div>
            </div>
          </Grid>

          <Grid item xs={12} md={4} className="profile-photo-box">
            <div className="profile-photo-placeholder">
              {vet.photo && vet.photo.trim() !== "" ? (
                <img className="profile-photo-img" src={vet.photo} alt="Vet" />
              ) : (
                <InsertPhotoIcon fontSize="large" />
              )}
            </div>
          </Grid>
        </Grid>

        <Typography className="centered-section-title">Σχετικά με εμένα</Typography>
        <div className="section-box">
          <Typography className="about-text">{vet.about || "—"}</Typography>
        </div>

        <Typography className="centered-section-title">Διαθέσιμες Υπηρεσίες</Typography>

        <div className="services-box">
          <div className="services-header services-header-view">
            <span>Υπηρεσία</span>
            <span>Διάρκεια</span>
            <span>Τιμή</span>
          </div>

          {(vet.services || []).map((s, idx) => (
            <div key={s.id || idx} className="services-row services-row-view">
              <span>{s.name}</span>
              <span>{s.duration}</span>
              <span>{s.price}</span>
            </div>
          ))}

          {(vet.services || []).length === 0 && (
            <div className="services-empty">—</div>
          )}
        </div>
      </Paper>

      <div className="profile-back">
        <BackButton />
      </div>
    </div>
  );
}
