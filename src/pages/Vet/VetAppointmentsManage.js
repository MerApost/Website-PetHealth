import "./VetAppointmentsManage.css";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  CssBaseline,
} from "@mui/material";
import VetDashboard from "./VetDashboard";

const statusTabs = [
  { key: "pending", label: "Εκκρεμή" },
  { key: "confirmed", label: "Επιβεβαιωμένα" },
  { key: "rejected", label: "Απορριφθέντα" },
];

const getStatusKey = (status) => {
  if (status === "confirmed" || status === "completed") return "confirmed";
  if (status === "rejected" || status === "cancelled") return "rejected";
  return "pending";
};

export default function VetAppointmentsManage() {
  const navigate = useNavigate();
  const vetId = (localStorage.getItem("userId") || "").trim();
  const [tab, setTab] = React.useState("pending");
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [owners, setOwners] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [apptRes, usersRes] = await Promise.all([
          fetch(`http://localhost:3004/appointments?vetId=${vetId}`),
          fetch("http://localhost:3004/users"),
        ]);
        const apptData = apptRes.ok ? await apptRes.json() : [];
        const usersData = usersRes.ok ? await usersRes.json() : [];
        const now = new Date();
        const parseDurationMinutes = (value) => {
          if (!value) return 30;
          const s = String(value).toLowerCase();
          const nums = s.match(/\d+(\.\d+)?/g);
          if (!nums) return 30;
          const values = nums.map((n) => parseFloat(n)).filter((n) => !Number.isNaN(n));
          const maxVal = values.length ? Math.max(...values) : 30;
          if (s.includes("ωρ")) return Math.round(maxVal * 60);
          return Math.round(maxVal);
        };
        const getServiceDuration = (serviceName) => {
          if (!serviceName) return 30;
          const vet = usersData.find((u) => String(u.id) === String(vetId));
          const service = vet?.services?.find((s) => s.name === serviceName);
          return parseDurationMinutes(service?.duration);
        };
        const updated = await Promise.all(
          (Array.isArray(apptData) ? apptData : []).map(async (a) => {
            if (!a?.date || !a?.time) return a;
            if (["rejected", "cancelled", "completed"].includes(a.status)) return a;
            const start = new Date(`${a.date}T${a.time}:00`);
            if (Number.isNaN(start.getTime())) return a;
            const duration = getServiceDuration(a.service);
            const end = new Date(start.getTime() + duration * 60000);
            if (now > end) {
              try {
                const res = await fetch(`http://localhost:3004/appointments/${a.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: "completed", updatedAt: new Date().toISOString() }),
                });
                if (res.ok) {
                  return { ...a, status: "completed" };
                }
              } catch (e) {
                console.error(e);
              }
            }
            return a;
          })
        );
        setAppointments(updated);
        setOwners(Array.isArray(usersData) ? usersData : []);
      } catch (e) {
        console.error(e);
        setAppointments([]);
        setOwners([]);
      } finally {
        setLoading(false);
      }
    };
    if (vetId) load();
  }, [vetId]);

  const ownerById = (ownerId) =>
    owners.find((o) => String(o.id) === String(ownerId));
  const petById = (ownerId, petId) =>
    ownerById(ownerId)?.pets?.find((p) => String(p.id) === String(petId));

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3004/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("update failed");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = appointments.filter(
    (a) => getStatusKey(a.status) === tab
  );

  const counts = statusTabs.reduce((acc, t) => {
    acc[t.key] = appointments.filter((a) => getStatusKey(a.status) === t.key).length;
    return acc;
  }, {});

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="appointments" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="vam-page">
          <div className="vam-card">
        <Typography className="vam-title">Διαχείριση Ραντεβού</Typography>
        <Typography className="vam-subtitle">
          Επιβεβαιώστε ή απορρίψτε εκκρεμή αιτήματα ραντεβού
        </Typography>

        <Tabs
          value={tab}
          onChange={(_e, val) => setTab(val)}
          className="vam-tabs"
        >
          {statusTabs.map((t) => (
            <Tab
              key={t.key}
              value={t.key}
              label={
                <span className="vam-tab-label">
                  {t.label}
                  <span className={`vam-pill ${t.key}`}>{counts[t.key] || 0}</span>
                </span>
              }
            />
          ))}
        </Tabs>

        <Paper elevation={0} className="vam-panel">
          {loading && <div className="vam-empty">Φόρτωση…</div>}
          {!loading && filtered.length === 0 && (
            <div className="vam-empty">— Δεν υπάρχουν ραντεβού</div>
          )}
          {!loading &&
            filtered.map((a) => {
              const owner = ownerById(a.ownerId);
              const pet = petById(a.ownerId, a.petId);
              return (
                <div key={a.id} className="vam-row">
                  <div className="vam-row-info">
                    <div className="vam-field">
                      <span className="vam-label">Ημερομηνία & Ώρα Ραντεβού:</span>
                      <span className="vam-value">{a.date || "—"}, {a.time || "—"}</span>
                    </div>
                    <div className="vam-field">
                      <span className="vam-label">Ιατρική Πράξη:</span>
                      <span className="vam-value">{a.service || "—"}</span>
                    </div>
                    <div className="vam-field">
                      <span className="vam-label">Κατοικίδιο:</span>
                      <span className="vam-value">
                        {pet
                          ? `${pet.type || "—"}, ${pet.breed || pet.name || "—"}`
                          : "—"}
                      </span>
                    </div>
                    <div className="vam-field">
                      <span className="vam-label">Επείγον:</span>
                      <span className="vam-value">
                        {(() => {
                          if (a.urgent === true) return "Ναι";
                          if (a.urgent === false) return "Όχι";
                          const s = String(a.urgent || "").trim().toLowerCase();
                          if (!s) return "—";
                          if (["ναι", "nai", "yes", "y", "true"].includes(s)) return "Ναι";
                          if (["όχι", "οχι", "oxi", "no", "n", "false"].includes(s)) return "Όχι";
                          return "—";
                        })()}
                      </span>
                    </div>
                    <div className="vam-owner">
                      {owner ? `${owner.name || ""} ${owner.surname || ""}`.trim() : "—"}
                    </div>
                  </div>
                  <div className="vam-row-actions">
                    {tab === "pending" && (
                      <>
                        <div className="vam-actions-top">
                          <Button
                            variant="outlined"
                            className="vam-btn confirm"
                            onClick={() => updateStatus(a.id, "confirmed")}
                          >
                            Επιβεβαίωση
                          </Button>
                          <Button
                            variant="outlined"
                            className="vam-btn reject"
                            onClick={() => updateStatus(a.id, "rejected")}
                          >
                            Απόρριψη
                          </Button>
                        </div>
                        <Button
                          variant="outlined"
                          className="vam-btn more"
                          onClick={() => navigate(`/vet_main/${vetId}/appointments/${a.id}`)}
                        >
                          Περισσότερα
                        </Button>
                      </>
                    )}
                    {tab === "confirmed" && (
                      <>
                        <Button
                          variant="outlined"
                          className="vam-btn reject"
                          onClick={() => updateStatus(a.id, "rejected")}
                        >
                          Απόρριψη
                        </Button>
                        <Button
                          variant="outlined"
                          className="vam-btn more"
                          onClick={() => navigate(`/vet_main/${vetId}/appointments/${a.id}`)}
                        >
                          Περισσότερα
                        </Button>
                      </>
                    )}
                    {tab === "rejected" && (
                      <Button
                        variant="outlined"
                        className="vam-btn more"
                        onClick={() => navigate(`/vet_main/${vetId}/appointments/${a.id}`)}
                      >
                        Περισσότερα
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
        </Paper>

        <div className="vam-footer">
          <Button variant="outlined" className="vam-back" onClick={() => window.history.back()}>
            ‹ Επιστροφή
          </Button>
        </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
