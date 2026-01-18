import * as React from "react";
import { useParams } from "react-router-dom";
import "./VetMedicalActPreview.css";

import { Paper, Typography, Box, Button, CssBaseline } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import BackButton from "../../components/BackButton/BackButton";
import VetDashboard from "./VetDashboard";

export default function VetMedicalActPreview() {
  const { actId } = useParams();
  const [act, setAct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3004/medicalActs/${actId}`
        );
        const data = res.ok ? await res.json() : null;
        setAct(data);
      } catch (e) {
        console.error(e);
        setAct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [actId]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="microchip" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="map-page">
          <Paper elevation={0} className="map-card">
        <Box className="map-actions">
          <Button
            variant="contained"
            className="map-print"
            onClick={() => window.print()}
            startIcon={<PrintIcon />}
          >
            Εκτύπωση
          </Button>
        </Box>

        {loading && <div className="map-empty">Φόρτωση…</div>}

        {!loading && !act && (
          <div className="map-empty">— Δεν βρέθηκε πράξη</div>
        )}

        {!loading && act && (
          <Paper elevation={0} className="map-panel">
            <Typography className="map-title">Ιατρική Πράξη</Typography>
            <div className="map-grid">
              <div><b>Ημ/νία:</b> {act.actDate || "—"}</div>
              <div><b>Τύπος:</b> {act.actType || "—"}</div>
              <div><b>Εμβόλιο:</b> {act.vaccine || "—"}</div>
              <div><b>Φαρμακευτική Αγωγή:</b> {act.medication || "—"}</div>
              <div><b>Συχνότητα:</b> {act.frequency || "—"}</div>
              <div><b>Δοσολογία:</b> {act.dosage || "—"}</div>
              <div><b>Περιγραφή Χειρουργείου:</b> {act.surgeryDesc || "—"}</div>
              <div><b>Οδηγίες:</b> {act.instructions || "—"}</div>
            </div>
          </Paper>
        )}
          </Paper>

          <div className="map-back">
            <BackButton />
          </div>
        </div>
      </Box>
    </Box>
  );
}
