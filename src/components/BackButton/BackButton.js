import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./BackButton.css";

export default function BackButton({ label = "Επιστροφή" }) {
  const navigate = useNavigate();

  return (
    <div className="backbutton">
      <Button
        variant="outlined"
        startIcon={<ArrowBackIosNewIcon fontSize="small" />}
        onClick={() => navigate(-1)}   //Πήγαινε 1 σελίδα πίσω στο ιστορικό του browser
        className="backbtn"
      >
        {label}
      </Button>
      
    </div>
    
  );
}
