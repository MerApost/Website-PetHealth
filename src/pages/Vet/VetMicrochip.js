import * as React from "react";
import { useNavigate } from "react-router-dom";
import "../Owner/OwnerMainPage.css";
import "./VetMainPage.css";
import "./VetMicrochip.css";

import {
  Typography,
  Box,
  TextField,
  Button,
  CssBaseline,
} from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import SearchIcon from "@mui/icons-material/Search";
import VetDashboard from "./VetDashboard";

export default function VetMicrochip() {
  const navigate = useNavigate();
  const vetId = (localStorage.getItem("userId") || "").trim();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const role = (localStorage.getItem("role") || "").trim();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleSearch = async () => {
    const needle = query.trim();
    if (!needle) {
      setMessage("Πληκτρολόγησε κωδικό microchip.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const usersRes = await fetch("http://localhost:3004/users");
      const usersData = usersRes.ok ? await usersRes.json() : [];

      let foundPet = null;
      let foundOwner = null;

      if (Array.isArray(usersData)) {
        for (const u of usersData) {
          if (!Array.isArray(u.pets)) continue;
          const match = u.pets.find(
            (p) => String(p.microchip || "").trim() === needle
          );
          if (match) {
            foundPet = match;
            foundOwner = u;
            break;
          }
        }
      }

      if (!foundPet) {
        setMessage("Δεν βρέθηκε κατοικίδιο με αυτό το microchip.");
        return;
      }

      if (!isLoggedIn || role !== "vet" || !vetId) {
        sessionStorage.setItem(
          "postAuthVetHealthBook",
          JSON.stringify({ ownerId: foundOwner.id, petId: foundPet.id })
        );
        navigate("/login");
        return;
      }
      navigate(`/vet_main/${vetId}/health-book/${foundOwner.id}/${foundPet.id}`);
    } catch (e) {
      console.error(e);
      setMessage("Σφάλμα φόρτωσης δεδομένων.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="microchip" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <div className="vm-page">
          <Typography className="vm-title">Καταγραφή Ιατρικών Πράξεων</Typography>

          <Box className="find_vet-vet">
            <Box className="input_group_vet">
              <MemoryIcon className="icons" />
              <TextField
                variant="filled"
                label="Εισαγωγή κωδικού Microchip"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input_field_vet"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "56px",
                    width: "400px",
                  },
                }}
              />
            </Box>

            <Button
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              <SearchIcon className="search_icon" />
              Αναζήτηση
            </Button>
          </Box>

          {message && <div className="vm-message">{message}</div>}
        </div>
      </Box>
    </Box>
  );
}
