import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./OwnerProfile.css";

import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

import BackButton from "../../components/BackButton/BackButton";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

export default function OwnerProfileView() {
  const navigate = useNavigate();
  const [owner, setOwner] = React.useState(null);

  React.useEffect(() => {
    const id = localStorage.getItem("userId");
    console.log("PROFILE userId:", id);

    if (!id) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3004/users/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => setOwner(data))
      .catch(() => alert("Σφάλμα φόρτωσης προφίλ"));
  }, [navigate]);

  if (!owner) {
    return <div style={{ paddingTop: 120, textAlign: "center" }}>Φόρτωση...</div>;
  }


  const pets = owner.pets || [];
  const fullName = `${owner.name || ""} ${owner.surname || ""}`.trim();


  return (
    <div className="profile-page">
    <Typography className="profile-title">Προβολή Προφίλ</Typography>
      <Paper elevation={0} className="profile-card">
        <Box className="profile-top">
          <Typography className="profile-section-title">Προσωπικά Στοιχεία</Typography>

          <Button
            variant="outlined"
            className="profile-edit-btn"
            onClick={() => navigate("/owner/profile/edit")}
          >
            Επεξεργασία
          </Button>
        </Box>

        <Divider className="profile-divider" />

        <Grid container spacing={2} className="profile-info-grid">
          <Grid item xs={12} md={8}>
            <div className="profile-info">
              <div className="profile-row"><span>Ονοματεπώνυμο:</span><b>{fullName}</b></div>
              <div className="profile-row"><span>E-mail:</span><b>{owner.email}</b></div>
              <div className="profile-row"><span>Τηλέφωνο:</span><b>{owner.phone}</b></div>
              <div className="profile-row"><span>ΑΦΜ:</span><b>{owner.afm}</b></div>
              <div className="profile-row"><span>Αριθμός Κατοικιδίων:</span><b>{owner.petsCount}</b></div>
            </div>
          </Grid>

          <Grid item xs={12} md={4} className="profile-photo-box">
            <div className="profile-photo-placeholder">
              <InsertPhotoIcon fontSize="large" />
            </div>
          </Grid>
        </Grid>

        <Typography className="profile-section-title pets-title">Κατοικίδια</Typography>

        <div className="pets-list">
          {pets.map((p) => (
            <Card key={p.id} className="pet-card" elevation={0}>
              <CardMedia
                component="img"
                image={p.photo && p.photo.trim() !== "" ? p.photo : "https://via.placeholder.com/220x140?text=Pet"}
                alt={p.name}
                className="pet-img"
              />
              <CardContent className="pet-content">
                <div className="pet-row"><span>Όνομα:</span><b>{p.name}</b></div>
                <div className="pet-row"><span>Microchip:</span><b>{p.microchip}</b></div>
                <div className="pet-row"><span>Είδος:</span><b>{p.breed}</b></div>
                <div className="pet-row"><span>Φύλο:</span><b>{p.gender}</b></div>
                <div className="pet-row"><span>Ηλικία:</span><b>{p.age}</b></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Paper>
        <div className="profile-back">
            <BackButton />
        </div>
    </div>
  );
}
