import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./VetPetRegister.css";

import { Paper, Typography, Box, CssBaseline } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import BackButton from "../../components/BackButton/BackButton";
import VetDashboard from "./VetDashboard";

export default function VetPetRegisterPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = React.useState(null);

  const vetId = (localStorage.getItem("userId") || "").trim();

  React.useEffect(() => {
    if (!vetId) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3004/petRegistrations/${id}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();

        if (String(data.vetId) !== String(vetId)) {
          alert("Δεν έχετε πρόσβαση σε αυτή την καταχώριση.");
          navigate(`/vet_main/${vetId}/pet-history`);
          return;
        }

        setItem(data);
      } catch (e) {
        console.error(e);
        alert("Σφάλμα φόρτωσης.");
        navigate(`/vet_main/${vetId}/pet-history`);
      }
    };

    load();
  }, [id, vetId, navigate]);

  if (!item) {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <VetDashboard active="pet-history" />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
          <div style={{ paddingTop: 120, textAlign: "center" }}>Φόρτωση...</div>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="pet-history" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="vetpet-page">
          <Typography className="vetpet-title">Προεπισκόπηση Καταχώρισης</Typography>

          <Paper elevation={0} className="vetpet-card vetpet-card-narrow">
            <Typography className="vetpet-section-center">Στοιχεία Κατοικιδίου</Typography>

            <div className="vetpet-preview">
              <div className="vetpet-preview-photo">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="vetpet-preview-img" />
                ) : (
                  <div className="vetpet-preview-placeholder">
                    <InsertPhotoIcon />
                  </div>
                )}
              </div>

              <div className="vetpet-preview-info">
                <div className="vetpet-prev-row"><span>Microchip:</span><b>{item.microchip || "—"}</b></div>
                <div className="vetpet-prev-row"><span>Όνομα:</span><b>{item.name || "—"}</b></div>
                <div className="vetpet-prev-row"><span>Είδος:</span><b>{item.species || "—"}</b></div>
                <div className="vetpet-prev-row"><span>Ράτσα:</span><b>{item.breed || "—"}</b></div>
                <div className="vetpet-prev-row"><span>Φύλο:</span><b>{item.gender || "—"}</b></div>
                <div className="vetpet-prev-row"><span>Ημ/νία Γέννησης:</span><b>{item.birthDate || "—"}</b></div>
              </div>
            </div>

          </Paper>

          <div className="vetpet-back">
            <BackButton />
          </div>
        </div>
      </Box>
    </Box>
  );
}
