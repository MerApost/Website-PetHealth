import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./VetNewEvent.css";

import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepButton,
  StepConnector,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LossRequestForm from "./Request/LossRequestForm";
import LossRequestPreview from "./Request/LossRequestPreview";

const steps = [
  "Επέλεξε συμβάν και ημερομηνία",
  "Νέα δήλωση - Συμπλήρωσε τα στοιχεία",
  "Προεπισκόπηση Δήλωσης",
  "Οριστική Υποβολή Δήλωσης",
];

const StepLine = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "rgba(0,0,0,0.4)",
    borderTopWidth: 1,
  },
}));

const StepCircle = styled("div")(({ ownerState }) => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "1px solid rgba(0,0,0,0.35)",
  background: ownerState.active
    ? "#b99a8f"
    : ownerState.completed
    ? "#ddd1cb"
    : "#c9b1a6",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 12,
}));

export default function VetNewEvent() {
  const navigate = useNavigate();
  const { ownerId, petId } = useParams();
  const [searchParams] = useSearchParams();
  const vetId = (localStorage.getItem("userId") || "").trim();

  const [eventType, setEventType] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [createdAt, setCreatedAt] = React.useState("");
  const editId = searchParams.get("editId");
  const [lossForm, setLossForm] = React.useState({
    ownerFirstName: "",
    ownerLastName: "",
    ownerPhone: "",
    ownerAddress: "",
    ownerEmail: "",
    petName: "",
    petType: "",
    petMicrochip: "",
    petPhoto: "",
    petBreed: "",
    petAge: "",
    petColor: "",
    petGender: "",
    lossDate: "",
    lossArea: "",
    lossDescription: "",
    vetFirstName: "",
    vetLastName: "",
    vetPhone: "",
  });

  const updateLossForm = (key, value) =>
    setLossForm((prev) => ({ ...prev, [key]: value }));

  const countWords = (text) => {
    const s = String(text || "").trim();
    if (!s) return 0;
    return s.split(/\s+/).filter(Boolean).length;
  };

  React.useEffect(() => {
    if (!vetId) return;
    const loadVet = async () => {
      try {
        const res = await fetch(`http://localhost:3004/users/${vetId}`);
        if (!res.ok) return;
        const data = await res.json();
        setLossForm((prev) => ({
          ...prev,
          vetFirstName: data?.name || prev.vetFirstName,
          vetLastName: data?.surname || prev.vetLastName,
          vetPhone: data?.phone || prev.vetPhone,
        }));
      } catch (e) {
        console.error(e);
      }
    };
    loadVet();
  }, [vetId]);

  React.useEffect(() => {
    if (!editId) return;
    const loadEvent = async () => {
      try {
        const res = await fetch(
          `http://localhost:3004/lifeEvents/${editId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setEventType(data.type || "");
        setEventDate(data.date || "");
        setCreatedAt(data.createdAt || "");
        if (data.type === "Απώλεια" && data.details) {
          setLossForm((prev) => ({ ...prev, ...data.details }));
        }
        setActiveStep(1);
      } catch (e) {
        console.error(e);
      }
    };
    loadEvent();
  }, [editId]);

  React.useEffect(() => {
    if (!petId || !ownerId) return;
    const loadOwnerPet = async () => {
      try {
        const res = await fetch(
          `http://localhost:3004/users/${ownerId}`
        );
        if (!res.ok) return;
        const foundOwner = await res.json();
        const foundPet = Array.isArray(foundOwner?.pets)
          ? foundOwner.pets.find((p) => String(p.id) === String(petId))
          : null;

        if (!foundPet || !foundOwner) return;

        setLossForm((prev) => ({
          ...prev,
          ownerFirstName: foundOwner.name || prev.ownerFirstName,
          ownerLastName: foundOwner.surname || prev.ownerLastName,
          ownerPhone: foundOwner.phone || prev.ownerPhone,
          ownerAddress: foundOwner.address || prev.ownerAddress,
          ownerEmail: foundOwner.email || prev.ownerEmail,
          petName: foundPet.name || prev.petName,
          petType: foundPet.type || prev.petType,
          petMicrochip: foundPet.microchip || prev.petMicrochip,
          petBreed: foundPet.breed || prev.petBreed,
          petAge: foundPet.age || prev.petAge,
          petColor: foundPet.color || prev.petColor,
          petGender: foundPet.gender || prev.petGender,
          petPhoto: foundPet.photo || prev.petPhoto,
        }));
      } catch (e) {
        console.error(e);
      }
    };

    loadOwnerPet();
  }, [petId, ownerId]);

  const validateLossForm = () => {
    const requiredKeys = [
      "ownerFirstName",
      "ownerLastName",
      "ownerPhone",
      "ownerEmail",
      "petName",
      "petType",
      "petMicrochip",
      "petBreed",
      "petAge",
      "petGender",
      "lossDate",
      "lossArea",
      "lossDescription",
      "vetFirstName",
      "vetLastName",
      "vetPhone",
    ];

    const hasEmpty = requiredKeys.some(
      (k) => String(lossForm[k] || "").trim() === ""
    );
    if (hasEmpty) {
      alert("Συμπλήρωσε όλα τα υποχρεωτικά πεδία.");
      return false;
    }
    if (countWords(lossForm.lossDescription) > 50) {
      alert("Η περιγραφή πρέπει να είναι έως 50 λέξεις.");
      return false;
    }
    return true;
  };

  const checkOwnerPet = async () => {
    try {
      setChecking(true);
      const res = await fetch(
        `http://localhost:3004/users/${ownerId}`
      );
      const owner = res.ok ? await res.json() : null;
      const microchip = String(lossForm.petMicrochip || "").trim();
      const matches =
        owner && Array.isArray(owner.pets)
          ? owner.pets.some(
              (p) => String(p.microchip || "").trim() === microchip
            )
          : false;

      if (!matches) {
        alert(
          "Ο ιδιοκτήτης δεν έχει δηλωμένο κατοικίδιο με αυτό το microchip."
        );
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      alert("Αποτυχία ελέγχου ιδιοκτήτη.");
      return false;
    } finally {
      setChecking(false);
    }
  };

  const save = async (status = "final") => {
    if (!eventType || !eventDate) {
      alert("Συμπλήρωσε συμβάν και ημερομηνία.");
      return;
    }
    if (eventType === "Απώλεια" && !validateLossForm()) return;

    try {
      setSaving(true);
      const cleanEditId =
        editId && editId !== "undefined" && editId !== "null" ? editId : "";
      const payload = {
        petId,
        ownerId,
        type: eventType,
        date: eventDate,
        details: eventType === "Απώλεια" ? lossForm : {},
        status,
        createdAt: createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let res;
      if (cleanEditId) {
        res = await fetch(`http://localhost:3004/lifeEvents/${cleanEditId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 404) {
          res = await fetch("http://localhost:3004/lifeEvents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      } else {
        res = await fetch("http://localhost:3004/lifeEvents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        throw new Error("POST failed");
      }
      navigate(`/vet/health-book/${ownerId}/${petId}`);
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ve-page">
      <Typography className="ve-title">Καταγραφή Συμβάντος</Typography>

      <Paper elevation={0} className="ve-card">
        <Stepper
          nonLinear
          activeStep={activeStep}
          className="ve-stepper"
          alternativeLabel
          connector={<StepLine />}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepButton
                onClick={() => {
                  setActiveStep(index);
                }}
                icon={
                  <StepCircle ownerState={{ active: index === activeStep, completed: index < activeStep }}>
                    {index + 1}
                  </StepCircle>
                }
              >
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Paper elevation={0} className="ve-panel">
            <Box className="ve-grid">
              <div>
                <Typography className="ve-panel-title">Επέλεξε συμβάν:</Typography>
                <RadioGroup
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="ve-radio"
                >
                  <FormControlLabel value="Απώλεια" control={<Radio />} label="Απώλεια" />
                  <FormControlLabel value="Εύρεση" control={<Radio />} label="Εύρεση" />
                  <FormControlLabel value="Μεταβίβαση" control={<Radio />} label="Μεταβίβαση" />
                  <FormControlLabel value="Υιοθεσία" control={<Radio />} label="Υιοθεσία" />
                  <FormControlLabel value="Αναδοχή" control={<Radio />} label="Αναδοχή" />
                </RadioGroup>
              </div>

              <div>
                <Typography className="ve-panel-title">Επέλεξε Ημερομηνία:</Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="ve-date"
                />
              </div>
            </Box>
          </Paper>
        )}

        {activeStep === 1 && eventType === "Απώλεια" && (
          <LossRequestForm
            form={lossForm}
            onChange={updateLossForm}
            wordCount={countWords(lossForm.lossDescription)}
            disableVet
          />
        )}

        {activeStep === 2 && eventType === "Απώλεια" && (
          <LossRequestPreview form={lossForm} />
        )}

        {activeStep === 3 && eventType === "Απώλεια" && (
          <Paper elevation={0} className="ve-panel">
            <Typography className="ve-panel-title">
              Θέλετε να προχωρήσετε σε οριστική υποβολή της δήλωσης σας;
            </Typography>
            <Box className="ve-confirm-actions">
              <Button
                variant="contained"
                className="ve-btn-red"
                disabled={saving || checking}
                onClick={() => save("draft")}
              >
                ΟΧΙ, προσωρινή αποθήκευση
              </Button>
              <Button
                variant="contained"
                className="ve-btn-green"
                disabled={saving || checking}
                onClick={() => save("final")}
              >
                ΝΑΙ, οριστική υποβολή δήλωσης
              </Button>
            </Box>
          </Paper>
        )}

        {(activeStep > 0 && eventType !== "Απώλεια") && (
          <Paper elevation={0} className="ve-panel">
            <Typography className="ve-panel-title">
              Βήμα {activeStep + 1}
            </Typography>
            <Typography className="ve-placeholder">
              Η αίτηση για το συγκεκριμένο συμβάν θα προστεθεί στη συνέχεια.
            </Typography>
          </Paper>
        )}

        <Box className="ve-actions">
          <Button
            variant="outlined"
            className="ve-btn"
            onClick={() => {
              if (activeStep === 0) {
                navigate(`/vet/health-book/${ownerId}/${petId}`);
              } else {
                setActiveStep((s) => Math.max(s - 1, 0));
              }
            }}
          >
            <span className="ve-arrow">‹</span> Επιστροφή
          </Button>
          {activeStep !== 3 && (
            <Button
              variant="outlined"
              className="ve-btn"
              onClick={() => {
                if (activeStep === 0) {
                  if (!eventType || !eventDate) {
                    alert("Συμπλήρωσε συμβάν και ημερομηνία.");
                    return;
                  }
                  setActiveStep(1);
                } else if (activeStep === 1 && eventType === "Απώλεια") {
                  (async () => {
                    if (!validateLossForm()) return;
                    const ok = await checkOwnerPet();
                    if (!ok) return;
                    setActiveStep(2);
                  })();
                } else if (activeStep === 2 && eventType === "Απώλεια") {
                  setActiveStep((s) => Math.min(s + 1, steps.length - 1));
                } else {
                  setActiveStep((s) => Math.min(s + 1, steps.length - 1));
                }
              }}
              disabled={saving || checking}
            >
              Επόμενο Βήμα <span className="ve-arrow">›</span>
            </Button>
          )}
        </Box>
      </Paper>
    </div>
  );
}
