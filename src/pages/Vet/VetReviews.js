import * as React from "react";
import "./VetReviews.css";
import { Box, CssBaseline, Paper, Typography, Rating, Tabs, Tab } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import VetDashboard from "./VetDashboard";

export default function VetReviews() {
  const vetId = (localStorage.getItem("userId") || "").trim();
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      if (!vetId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3004/reviews?vetId=${vetId}`);
        let data = res.ok ? await res.json() : [];
        if (!res.ok) {
          const apptRes = await fetch(`http://localhost:3004/appointments?vetId=${vetId}`);
          const apptData = apptRes.ok ? await apptRes.json() : [];
          data = Array.isArray(apptData)
            ? apptData
                .filter((a) => a.review && a.review.rating)
                .map((a) => ({
                  id: a.review.id || a.id,
                  ...a.review,
                }))
            : [];
        }
        const usersRes = await fetch("http://localhost:3004/users");
        const usersData = usersRes.ok ? await usersRes.json() : [];
        const withPhotos = (Array.isArray(data) ? data : []).map((r) => {
          if (r.ownerPhoto || !r.ownerId) return r;
          const owner = usersData.find((u) => String(u.id) === String(r.ownerId));
          return { ...r, ownerPhoto: owner?.photo || "" };
        });
        setReviews(withPhotos);
      } catch (e) {
        console.error(e);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vetId]);

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
      : 0;

  const filteredReviews = React.useMemo(() => {
    if (filter === 1) return reviews.filter((r) => Number(r.rating || 0) >= 3.5);
    if (filter === 2) return reviews.filter((r) => Number(r.rating || 0) < 3.5);
    if (filter === 3) {
      return [...reviews].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }
    return reviews;
  }, [filter, reviews]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="reviews" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="vr-page">
          <Paper elevation={0} className="vr-card">
            <Typography className="vr-title">Αξιολογήσεις Πελατών</Typography>
            <div className="vr-score-block">
              <div className="vr-score-value">{avg ? avg.toFixed(1) : "—"}</div>
              <Rating
                value={Number(avg.toFixed(1))}
                readOnly
                precision={0.5}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <div className="vr-score-count">({reviews.length} αξιολογήσεις)</div>
            </div>

            <Tabs
              value={filter}
              onChange={(_e, v) => setFilter(v)}
              className="vr-tabs"
              variant="fullWidth"
            >
              <Tab label="Όλες" />
              <Tab label="Υψηλές" />
              <Tab label="Χαμηλές" />
              <Tab label="Πρόσφατες" />
            </Tabs>

            {loading && <div className="vr-empty">Φόρτωση…</div>}
            {!loading && filteredReviews.length === 0 && (
              <div className="vr-empty">— Δεν υπάρχουν αξιολογήσεις</div>
            )}

            {!loading &&
              filteredReviews.map((r) => (
                <div key={r.id} className="vr-item">
                  <div className="vr-item-avatar">
                    {r.ownerPhoto ? (
                      <img src={r.ownerPhoto} alt="owner" />
                    ) : (
                      <div className="vr-avatar-placeholder">—</div>
                    )}
                  </div>
                  <div className="vr-item-body">
                    <div className="vr-item-head">
                      <div className="vr-item-name">{r.ownerName || "Ιδιοκτήτης"}</div>
                      <div className="vr-item-date">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                      </div>
                    </div>
                    <Rating value={Number(r.rating || 0)} readOnly size="small" />
                    {r.comment && <div className="vr-item-comment">“{r.comment}”</div>}
                  </div>
                </div>
              ))}
          </Paper>
        </div>
      </Box>
    </Box>
  );
}
