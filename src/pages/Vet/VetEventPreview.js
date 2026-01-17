import * as React from "react";
import { useParams } from "react-router-dom";
import "./VetEventPreview.css";

import { Paper, Typography, Box, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import LossRequestPreview from "./Request/LossRequestPreview";
import FindRequestPreview from "./Request/FindRequestPreview";
import AdoptionRequestPreview from "./Request/AdoptionRequestPreview";
import TransferRequestPreview from "./Request/TransferRequestPreview";
import FosterRequestPreview from "./Request/FosterRequestPreview";
import BackButton from "../../components/BackButton/BackButton";

export default function VetEventPreview() {
  const { eventId } = useParams();
  const [eventData, setEventData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3004/lifeEvents/${eventId}`
        );
        const data = res.ok ? await res.json() : null;
        setEventData(data);
      } catch (e) {
        console.error(e);
        setEventData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  return (
    <div className="vep-page">
      <Paper elevation={0} className="vep-card">
        <Box className="vep-actions">
          <Button
            variant="contained"
            className="vep-print"
            onClick={() => window.print()}
            startIcon={<PrintIcon />}
          >
            Εκτύπωση
          </Button>
        </Box>

        {loading && <div className="vep-empty">Φόρτωση…</div>}

        {!loading && !eventData && (
          <div className="vep-empty">— Δεν βρέθηκε αίτηση</div>
        )}

        {!loading && eventData && eventData.type === "Απώλεια" && (
          <LossRequestPreview form={eventData.details || {}} />
        )}

        {!loading && eventData && eventData.type === "Εύρεση" && (
          <FindRequestPreview form={eventData.details || {}} />
        )}

        {!loading && eventData && eventData.type === "Υιοθεσία" && (
          <AdoptionRequestPreview form={eventData.details || {}} />
        )}

        {!loading && eventData && eventData.type === "Μεταβίβαση" && (
          <TransferRequestPreview form={eventData.details || {}} />
        )}

        {!loading && eventData && eventData.type === "Αναδοχή" && (
          <FosterRequestPreview form={eventData.details || {}} />
        )}

        {!loading && eventData &&
          eventData.type !== "Απώλεια" &&
          eventData.type !== "Εύρεση" &&
          eventData.type !== "Υιοθεσία" &&
          eventData.type !== "Μεταβίβαση" &&
          eventData.type !== "Αναδοχή" && (
          <Paper elevation={0} className="vep-panel">
            <Typography className="vep-title">
              Δήλωση {eventData.type || "Συμβάντος"}
            </Typography>
            <div className="vep-line">
              <b>Ημ/νία:</b> {eventData.date || "—"}
            </div>
          </Paper>
        )}
      </Paper>

      <div className="vep-back">
        <BackButton />
      </div>
    </div>
  );
}
