import * as React from "react";
import "./FindVet.css";
import "../Vet/VetEventPreview.css";
import { useParams } from "react-router-dom";
import { Paper, Button, Box } from "@mui/material";
import LossRequestPreview from "../Vet/Request/LossRequestPreview";
import FindRequestPreview from "../Vet/Request/FindRequestPreview";
import BackButton from "../../components/BackButton/BackButton";

export default function OwnerLossPreview() {
  const { eventId } = useParams();
  const [eventData, setEventData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3004/lifeEvents/${eventId}`);
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
        {loading && <div className="vep-empty">Φόρτωση…</div>}
        {!loading && !eventData && (
          <div className="vep-empty">— Δεν βρέθηκε δήλωση</div>
        )}
        {!loading && eventData && eventData.type === "Απώλεια" && (
          <LossRequestPreview form={eventData.details || {}} />
        )}
        {!loading && eventData && eventData.type === "Εύρεση" && (
          <FindRequestPreview form={eventData.details || {}} />
        )}
      </Paper>

      <Box className="vep-back">
        <BackButton />
      </Box>
    </div>
  );
}
