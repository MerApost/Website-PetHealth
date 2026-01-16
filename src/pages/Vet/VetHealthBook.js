import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./VetHealthBook.css";

import {
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import BackButton from "../../components/BackButton/BackButton";

export default function VetHealthBook() {
  const navigate = useNavigate();
  const { ownerId, petId } = useParams();

  const [acts, setActs] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [pet, setPet] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [birthDate, setBirthDate] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [loadingEvents, setLoadingEvents] = React.useState(true);

  const vetId = (localStorage.getItem("userId") || "").trim();

  const removeAct = async (actId) => {
    const ok = window.confirm("Θέλεις σίγουρα να διαγράψεις την πράξη;");
    if (!ok) return;
    try {
      const res = await fetch(
        `http://localhost:3004/medicalActs/${actId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("DELETE failed");
      setActs((prev) => prev.filter((a) => a.id !== actId));
    } catch (e) {
      console.error(e);
      alert("Αποτυχία διαγραφής.");
    }
  };

  const removeEvent = async (eventId) => {
    const ok = window.confirm("Θέλεις σίγουρα να διαγράψεις την αίτηση;");
    if (!ok) return;
    try {
      const res = await fetch(
        `http://localhost:3004/lifeEvents/${eventId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("DELETE failed");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (e) {
      console.error(e);
      alert("Αποτυχία διαγραφής.");
    }
  };

  React.useEffect(() => {
    if (!vetId) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const ownerRes = await fetch(
          `http://localhost:3004/users/${ownerId}`
        );
        const foundOwner = ownerRes.ok ? await ownerRes.json() : null;
        const foundPet = Array.isArray(foundOwner?.pets)
          ? foundOwner.pets.find((p) => String(p.id) === String(petId))
          : null;

        setPet(foundPet);
        setOwner(foundOwner);

        if (foundPet?.microchip) {
          const regRes = await fetch(
            `http://localhost:3004/petRegistrations?microchip=${foundPet.microchip}&_sort=updatedAt&_order=desc`
          );
          if (regRes.ok) {
            const regData = await regRes.json();
            setBirthDate(regData?.[0]?.birthDate || "");
          }
        }

        if (foundPet?.id) {
          const actsRes = await fetch(
            `http://localhost:3004/medicalActs?petId=${foundPet.id}&ownerId=${ownerId}&_sort=actDate&_order=desc`
          );
          const actsData = actsRes.ok ? await actsRes.json() : [];
          setActs(Array.isArray(actsData) ? actsData : []);
        } else {
          setActs([]);
        }
      } catch (e) {
        console.error(e);
        alert("Σφάλμα φόρτωσης βιβλιαρίου.");
      } finally {
        setLoading(false);
      }
    };

    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        if (!ownerId || !petId) {
          setEvents([]);
          return;
        }
        const res = await fetch(
          `http://localhost:3004/lifeEvents?petId=${petId}&ownerId=${ownerId}&_sort=date&_order=desc`
        );
        if (!res.ok) {
          setEvents([]);
          return;
        }
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    load();
    loadEvents();
  }, [petId, ownerId, vetId, navigate]);

  return (
    <div className="hb-page">
      <Paper elevation={0} className="hb-card">
        <Box className="hb-card-header">
          <Typography className="hb-card-title">
            Καταγραφή Ιατρικών Πράξεων
          </Typography>
          <Box className="hb-card-actions">
            <Button
              variant="contained"
              className="hb-btn-print"
              onClick={() => window.print()}
              startIcon={<PrintIcon />}
            >
              Εκτύπωση
            </Button>
          </Box>
        </Box>

        <Paper elevation={0} className="hb-panel">
          <Typography className="hb-panel-title">Στοιχεία Κατοικιδίου</Typography>
          <Box className="hb-pet">
            <Box className="hb-photo">
              {pet?.photo ? (
                <img src={pet.photo} alt={pet.name || "pet"} />
              ) : (
                <div className="hb-photo-placeholder">—</div>
              )}
            </Box>

            <Box className="hb-info">
              <div className="hb-info-grid">
                <div className="hb-info-row">
                  <span className="hb-label">Όνομα:</span>
                  <span className="hb-value">{pet?.name || "—"}</span>
                </div>
                <div className="hb-info-row">
                  <span className="hb-label">Φύλο:</span>
                  <span className="hb-value">{pet?.gender || "—"}</span>
                </div>
                <div className="hb-info-row">
                  <span className="hb-label">Είδος:</span>
                  <span className="hb-value">{pet?.type || "—"}</span>
                </div>
                <div className="hb-info-row">
                  <span className="hb-label">Ράτσα:</span>
                  <span className="hb-value">{pet?.breed || "—"}</span>
                </div>
                <div className="hb-info-row">
                  <span className="hb-label">Ηλικία:</span>
                  <span className="hb-value">
                    {pet?.age ? `${pet.age} ετών` : "—"}
                  </span>
                </div>
                <div className="hb-info-row">
                  <span className="hb-label">Ημ/νία γέννησης:</span>
                  <span className="hb-value">{birthDate || "—"}</span>
                </div>
                <div className="hb-info-row">
                  <span className="hb-label">Microchip:</span>
                  <span className="hb-value">{pet?.microchip || "—"}</span>
                </div>
                <div className="hb-info-row">
                  <span className="hb-label">Ιδιοκτήτης:</span>
                  <span className="hb-value">
                    {owner ? `${owner.name || ""} ${owner.surname || ""}`.trim() : "—"}
                  </span>
                </div>
              </div>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} className="hb-panel">
          <Typography className="hb-panel-title">Συμβάντα Ζωής Κατοικιδίου</Typography>

          <TableContainer className="hb-table">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="hb-th" width={60}>
                    Α/Α
                  </TableCell>
                  <TableCell className="hb-th">Γεγονός</TableCell>
                  <TableCell className="hb-th">Κατάσταση</TableCell>
                  <TableCell className="hb-th" width={120}>
                    Ημ/νία
                  </TableCell>
                  <TableCell className="hb-th" width={140}>
                    Ενέργειες
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingEvents && (
                  <TableRow>
                    <TableCell colSpan={5} className="hb-empty-cell">
                      Φόρτωση…
                    </TableCell>
                  </TableRow>
                )}
                {!loadingEvents && events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="hb-empty-cell">
                      — Δεν υπάρχουν καταχωρίσεις
                    </TableCell>
                  </TableRow>
                )}
                {!loadingEvents &&
                  events.map((ev, idx) => (
                    <TableRow key={ev.id || idx}>
                      <TableCell className="hb-td">{idx + 1}</TableCell>
                      <TableCell className="hb-td">
                        {ev.type || ev.title || ev.event || ev.name || "—"}
                      </TableCell>
                      <TableCell className="hb-td">
                        {ev.status === "draft" ? "Εκκρεμής" : "Οριστικοποιημένη"}
                      </TableCell>
                      <TableCell className="hb-td">
                        {ev.date || "—"}
                      </TableCell>
                      <TableCell className="hb-td">
                        {ev.status === "draft" ? (
                          <Box className="hb-action-group">
                            <Button
                              variant="outlined"
                              className="hb-btn-outline hb-btn-table"
                              onClick={() =>
                                navigate(
                                  `/vet/health-book/${ownerId}/${petId}/new-event?editId=${ev.id || ""}`
                                )
                              }
                            >
                              Επεξεργασία
                            </Button>
                            <Button
                              variant="outlined"
                              className="hb-btn-outline hb-btn-table hb-btn-danger"
                              onClick={() => removeEvent(ev.id)}
                            >
                              Διαγραφή
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            className="hb-btn-outline hb-btn-table"
                            onClick={() =>
                              navigate(
                                `/vet/health-book/event-preview/${ev.id || ""}`
                              )
                            }
                          >
                            Προεπισκόπηση
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="hb-panel-actions">
            <Button
              variant="outlined"
              className="hb-btn-outline"
              onClick={() => navigate(`/vet/health-book/${ownerId}/${petId}/new-event`)}
            >
              + Νέο Συμβάν
            </Button>
          </Box>
        </Paper>

        <Paper elevation={0} className="hb-panel">
          <Typography className="hb-panel-title">Βιβλιάριο Υγείας</Typography>

          <TableContainer className="hb-table">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="hb-th" width={60}>
                    Α/Α
                  </TableCell>
                  <TableCell className="hb-th">Ιατρική Πράξη</TableCell>
                  <TableCell className="hb-th">Φαρμακευτική Αγωγή</TableCell>
                  <TableCell className="hb-th">Δοσολογία & Συχνότητα</TableCell>
                  <TableCell className="hb-th">Κατάσταση</TableCell>
                  <TableCell className="hb-th" width={120}>
                    Ημ/νία
                  </TableCell>
                  <TableCell className="hb-th" width={160}>
                    Ενέργειες
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="hb-empty-cell">
                      Φόρτωση…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && acts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="hb-empty-cell">
                      — Δεν υπάρχουν καταχωρίσεις
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  acts.map((a, idx) => (
                    <TableRow key={a.id || idx}>
                      <TableCell className="hb-td">{idx + 1}</TableCell>
                      <TableCell className="hb-td">{a.actType || "—"}</TableCell>
                      <TableCell className="hb-td">{a.medication || "—"}</TableCell>
                      <TableCell className="hb-td">
                        {a.dosage || "—"}
                        {a.frequency ? ` / ${a.frequency}` : ""}
                      </TableCell>
                      <TableCell className="hb-td">
                        {a.status === "draft" ? "Εκκρεμής" : "Οριστικοποιημένη"}
                      </TableCell>
                      <TableCell className="hb-td">
                        {a.actDate || "—"}
                      </TableCell>
                      <TableCell className="hb-td">
                        {a.status === "draft" ? (
                          <Box className="hb-action-group">
                            <Button
                              variant="outlined"
                              className="hb-btn-outline hb-btn-table"
                              onClick={() =>
                                navigate(
                                  `/vet/health-book/${ownerId}/${petId}/new-act?editId=${a.id || ""}`
                                )
                              }
                            >
                              Επεξεργασία
                            </Button>
                            <Button
                              variant="outlined"
                              className="hb-btn-outline hb-btn-table hb-btn-danger"
                              onClick={() => removeAct(a.id)}
                            >
                              Διαγραφή
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            className="hb-btn-outline hb-btn-table"
                            onClick={() =>
                              navigate(
                                `/vet/health-book/act-preview/${a.id || ""}`
                              )
                            }
                          >
                            Προεπισκόπηση
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="hb-panel-actions">
            <Button
              variant="outlined"
              className="hb-btn-outline"
              onClick={() => navigate(`/vet/health-book/${ownerId}/${petId}/new-act`)}
            >
              + Νέα Ιατρική Πράξη
            </Button>
          </Box>
        </Paper>

        <Paper elevation={0} className="hb-panel hb-notes">
          <Typography className="hb-panel-title">Οδηγίες</Typography>
          <ol className="hb-notes-list">
            <li>Να τηρείται τακτικά το πρόγραμμα εμβολιασμού.</li>
            <li>Να ενημερώνεται ο κτηνίατρος για κάθε αλλαγή στην υγεία.</li>
          </ol>
        </Paper>
      </Paper>

      <div className="hb-back">
        <BackButton />
      </div>
    </div>
  );
}
