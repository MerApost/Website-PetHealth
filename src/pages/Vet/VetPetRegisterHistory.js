import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./VetPetRegister.css";

import { Paper, Typography, Button, Box, CssBaseline } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import BackButton from "../../components/BackButton/BackButton";
import VetDashboard from "./VetDashboard";

export default function VetPetRegisterHistory() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const vetId = (localStorage.getItem("userId") || "").trim();

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3004/petRegistrations?vetId=${vetId}&_sort=createdAt&_order=desc`
      );
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Σφάλμα φόρτωσης ιστορικού.");
    } finally {
      setLoading(false);
    }
  }, [vetId]);

  React.useEffect(() => {
    if (!vetId) {
      navigate("/login");
      return;
    }
    load();
  }, [vetId, navigate, load]);

  const deleteDraft = async (itemId) => {
    const ok = window.confirm("Θέλεις σίγουρα να διαγράψεις αυτή την προσωρινή καταχώριση;");
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:3004/petRegistrations/${itemId}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) throw new Error("DELETE failed");
      load();
    } catch (e) {
      console.error(e);
      alert("Αποτυχία διαγραφής.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="pet-history" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="vetpet-page">
          <Typography className="vetpet-title">Ιστορικό Καταχωρίσεων</Typography>

          <Paper elevation={0} className="vetpet-card vetpet-card-narrow">
        <Typography className="vetpet-section-left">Καταχωρίσεις Κατοικιδίων</Typography>

        {loading && <div style={{ padding: 18, textAlign: "center" }}>Φόρτωση...</div>}

        {!loading && items.length === 0 && (
          <div style={{ padding: 18, textAlign: "center", opacity: 0.8 }}>—</div>
        )}

        {!loading &&
          items.map((p) => (
            <div key={p.id} className="vetpet-history-row vetpet-history-left">
              <div className="vetpet-history-photo">
                {p.photo ? (
                  <img src={p.photo} alt={p.name} className="vetpet-history-img" />
                ) : (
                  <div className="vetpet-history-placeholder">
                    <InsertPhotoIcon />
                  </div>
                )}
              </div>

              <div className="vetpet-history-info">
                <div className="vetpet-history-line">
                  <b>Microchip:</b> {p.microchip || "—"}
                </div>
                <div className="vetpet-history-line">
                  <b>Όνομα:</b> {p.name || "—"}
                </div>
                <div className="vetpet-history-line">
                  <b>Είδος:</b> {p.species || "—"}
                </div>
                <div className="vetpet-history-line">
                  <b>Ημ/νία Γέννησης:</b> {p.birthDate || "—"}
                </div>
              </div>

              <div className="vetpet-history-right">
                <div className={`vetpet-badge ${p.status === "final" ? "badge-green" : "badge-blue"}`}>
                  {p.status === "final" ? "Οριστικοποιημένο" : "Προσωρινά αποθηκευμένο"}
                </div>

                {p.status === "final" ? (
                  <Button
                    variant="contained"
                    size="small"
                    className="vetpet-small-blue"
                    onClick={() => navigate(`/vet_main/${vetId}/pet-preview/${p.id}`)}
                  >
                    Προεπισκόπηση
                  </Button>
                ) : (
                  <div className="vetpet-history-actions">

                    <Button
                      variant="outlined"
                      size="small"
                      className="vetpet-small-red "
                      onClick={() => deleteDraft(p.id)}
                    >
                      Διαγραφή
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      className="vetpet-small-gray"
                      onClick={() => navigate(`/vet_main/${vetId}/pet-edit/${p.id}`)}
                    >
                      Επεξεργασία
                    </Button>

                  </div>
                )}
              </div>
            </div>
          ))}
          </Paper>

          <div className="vetpet-back">
            <BackButton />
          </div>
        </div>
      </Box>
    </Box>
  );
}
