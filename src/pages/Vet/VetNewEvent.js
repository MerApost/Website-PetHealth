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
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VetDashboard from "./VetDashboard";
import LossRequestForm from "./Request/LossRequestForm";
import LossRequestPreview from "./Request/LossRequestPreview";
import FindRequestForm from "./Request/FindRequestForm";
import FindRequestPreview from "./Request/FindRequestPreview";
import AdoptionRequestForm from "./Request/AdoptionRequestForm";
import AdoptionRequestPreview from "./Request/AdoptionRequestPreview";
import TransferRequestForm from "./Request/TransferRequestForm";
import TransferRequestPreview from "./Request/TransferRequestPreview";
import FosterRequestForm from "./Request/FosterRequestForm";
import FosterRequestPreview from "./Request/FosterRequestPreview";

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
  const [lossErrors, setLossErrors] = React.useState({});
  const [findErrors, setFindErrors] = React.useState({});
  const [adoptionErrors, setAdoptionErrors] = React.useState({});
  const [fosterErrors, setFosterErrors] = React.useState({});
  const [transferErrors, setTransferErrors] = React.useState({});
  const [eventErrors, setEventErrors] = React.useState({});
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
  const [findForm, setFindForm] = React.useState({
    contactFirstName: "",
    contactLastName: "",
    contactPhone: "",
    contactEmail: "",
    contactNotes: "",
    petNameMicrochip: "",
    petMicrochip: "",
    petType: "",
    petBreed: "",
    petAge: "",
    petColor: "",
    petGender: "",
    petPhoto: "",
    petDescription: "",
    foundDate: "",
    foundArea: "",
  });
  const [adoptionForm, setAdoptionForm] = React.useState({
    adopterFirstName: "",
    adopterLastName: "",
    adopterPhone: "",
    adopterAddress: "",
    adopterEmail: "",
    homeInfo: "",
    lifestyleInfo: "",
    experienceInfo: "",
    petName: "",
    petType: "",
    petMicrochip: "",
    petBreed: "",
    petAge: "",
    petGender: "",
  });
  const [fosterForm, setFosterForm] = React.useState({
    fosterFirstName: "",
    fosterLastName: "",
    fosterPhone: "",
    fosterAddress: "",
    fosterEmail: "",
    homeInfo: "",
    lifestyleInfo: "",
    experienceInfo: "",
    petName: "",
    petType: "",
    petMicrochip: "",
    petBreed: "",
    petAge: "",
    petGender: "",
  });
  const [transferForm, setTransferForm] = React.useState({
    currentFirstName: "",
    currentLastName: "",
    currentPhone: "",
    currentAddress: "",
    currentEmail: "",
    newFirstName: "",
    newLastName: "",
    newPhone: "",
    newAddress: "",
    newEmail: "",
    petName: "",
    petType: "",
    petMicrochip: "",
    petBreed: "",
    petAge: "",
    petGender: "",
  });

  const sanitizePhone = (value) =>
    String(value || "")
      .replace(/\D/g, "")
      .slice(0, 10);

  const updateLossForm = (key, value) => {
    const nextValue =
      key === "ownerPhone" || key === "vetPhone"
        ? sanitizePhone(value)
        : value;
    setLossForm((prev) => ({ ...prev, [key]: nextValue }));
    if (lossErrors[key]) {
      setLossErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };
  const updateFindForm = (key, value) => {
    const nextValue = key === "contactPhone" ? sanitizePhone(value) : value;
    setFindForm((prev) => ({ ...prev, [key]: nextValue }));
    if (findErrors[key]) {
      setFindErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };
  const updateAdoptionForm = (key, value) => {
    const nextValue = key === "adopterPhone" ? sanitizePhone(value) : value;
    setAdoptionForm((prev) => ({ ...prev, [key]: nextValue }));
    clearFormError(setAdoptionErrors, key);
  };
  const updateFosterForm = (key, value) => {
    const nextValue = key === "fosterPhone" ? sanitizePhone(value) : value;
    setFosterForm((prev) => ({ ...prev, [key]: nextValue }));
    clearFormError(setFosterErrors, key);
  };
  const updateTransferForm = (key, value) => {
    const nextValue =
      key === "currentPhone" || key === "newPhone"
        ? sanitizePhone(value)
        : value;
    setTransferForm((prev) => ({ ...prev, [key]: nextValue }));
    clearFormError(setTransferErrors, key);
  };

  const clearFormError = (setter, key) => {
    setter((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const countWords = (text) => {
    const s = String(text || "").trim();
    if (!s) return 0;
    return s.split(/\s+/).filter(Boolean).length;
  };

  const toLostPetsDate = (value) => {
    if (!value) return "";
    const s = String(value);
    if (s.includes("-")) {
      const [y, m, d] = s.split("-");
      if (y && m && d) return `${d}/${m}/${y}`;
    }
    return s;
  };

  const updatePetLostFlag = async (nextLost, microchipValue) => {
    if (!ownerId || !petId) return;
    const res = await fetch(`http://localhost:3004/users/${ownerId}`);
    if (!res.ok) return;
    const owner = await res.json();
    if (!Array.isArray(owner?.pets)) return;
    const microchip = String(microchipValue || "").trim();
    const updatedPets = owner.pets.map((p) => {
      const matchId = String(p.id) === String(petId);
      const matchChip = microchip && String(p.microchip || "").trim() === microchip;
      if (!matchId && !matchChip) {
        return p;
      }
      return { ...p, isLost: nextLost };
    });
    await fetch(`http://localhost:3004/users/${ownerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pets: updatedPets }),
    });
  };

  const upsertLostPet = async () => {
    const microchip = String(lossForm.petMicrochip || "").trim();
    const res = await fetch(
      `http://localhost:3004/lostPets?microchip=${microchip}`
    );
    const data = res.ok ? await res.json() : [];
    const existing = Array.isArray(data) && data.length > 0 ? data[0] : null;
    const payload = {
      ownerId,
      petId: Number.isNaN(Number(petId)) ? petId : Number(petId),
      microchip,
      lostDate: toLostPetsDate(lossForm.lossDate),
      location: lossForm.lossArea,
      additionalInfo: lossForm.lossDescription,
      status: "lost",
    };

    if (existing?.id) {
      await fetch(`http://localhost:3004/lostPets/${existing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return;
    }

    await fetch("http://localhost:3004/lostPets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const removeLostPet = async () => {
    const microchip = String(findForm.petMicrochip || "").trim();
    let res = await fetch(
      `http://localhost:3004/lostPets?microchip=${microchip}`
    );
    let data = res.ok ? await res.json() : [];
    if (!Array.isArray(data) || data.length === 0) {
      res = await fetch(
        `http://localhost:3004/lostPets?ownerId=${ownerId}&petId=${petId}`
      );
      data = res.ok ? await res.json() : [];
    }
    if (!Array.isArray(data)) return;
    await Promise.all(
      data.map((item) =>
        fetch(`http://localhost:3004/lostPets/${item.id}`, {
          method: "DELETE",
        })
      )
    );
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
        // no vet fields for find request
      } catch (e) {
        console.error(e);
      }
    };
    loadVet();
  }, [vetId]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

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
        if (data.type === "Εύρεση" && data.details) {
          setFindForm((prev) => ({ ...prev, ...data.details }));
        }
        if (data.type === "Υιοθεσία" && data.details) {
          setAdoptionForm((prev) => ({ ...prev, ...data.details }));
        }
        if (data.type === "Μεταβίβαση" && data.details) {
          setTransferForm((prev) => ({ ...prev, ...data.details }));
        }
        if (data.type === "Αναδοχή" && data.details) {
          setFosterForm((prev) => ({ ...prev, ...data.details }));
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
        setFindForm((prev) => ({
          ...prev,
          petNameMicrochip:
            foundPet.name && foundPet.microchip
              ? `${foundPet.name} - ${foundPet.microchip}`
              : prev.petNameMicrochip,
          petMicrochip: foundPet.microchip || prev.petMicrochip,
          petType: foundPet.type || prev.petType,
          petBreed: foundPet.breed || prev.petBreed,
          petAge: foundPet.age || prev.petAge,
          petColor: foundPet.color || prev.petColor,
          petGender: foundPet.gender || prev.petGender,
          petPhoto: foundPet.photo || prev.petPhoto,
        }));
        setAdoptionForm((prev) => ({
          ...prev,
          petName: foundPet.name || prev.petName,
          petType: foundPet.type || prev.petType,
          petMicrochip: foundPet.microchip || prev.petMicrochip,
          petBreed: foundPet.breed || prev.petBreed,
          petAge: foundPet.age || prev.petAge,
          petGender: foundPet.gender || prev.petGender,
        }));
        setFosterForm((prev) => ({
          ...prev,
          petName: foundPet.name || prev.petName,
          petType: foundPet.type || prev.petType,
          petMicrochip: foundPet.microchip || prev.petMicrochip,
          petBreed: foundPet.breed || prev.petBreed,
          petAge: foundPet.age || prev.petAge,
          petGender: foundPet.gender || prev.petGender,
        }));
        setTransferForm((prev) => ({
          ...prev,
          currentFirstName: foundOwner.name || prev.currentFirstName,
          currentLastName: foundOwner.surname || prev.currentLastName,
          currentPhone: foundOwner.phone || prev.currentPhone,
          currentAddress: foundOwner.address || prev.currentAddress,
          currentEmail: foundOwner.email || prev.currentEmail,
          petName: foundPet.name || prev.petName,
          petType: foundPet.type || prev.petType,
          petMicrochip: foundPet.microchip || prev.petMicrochip,
          petBreed: foundPet.breed || prev.petBreed,
          petAge: foundPet.age || prev.petAge,
          petGender: foundPet.gender || prev.petGender,
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

    const nextErrors = {};
    requiredKeys.forEach((k) => {
      if (String(lossForm[k] || "").trim() === "") {
        nextErrors[k] = "Υποχρεωτικό πεδίο.";
      }
    });

    const email = String(lossForm.ownerEmail || "").trim();
    if (email && !email.includes("@")) {
      nextErrors.ownerEmail = "Βάλε σωστό e-mail (με @).";
    }

    const ownerPhone = String(lossForm.ownerPhone || "").trim();
    if (ownerPhone && ownerPhone.length > 10) {
      nextErrors.ownerPhone = "Έως 10 ψηφία.";
    }

    const vetPhone = String(lossForm.vetPhone || "").trim();
    if (vetPhone && vetPhone.length > 10) {
      nextErrors.vetPhone = "Έως 10 ψηφία.";
    }

    if (countWords(lossForm.lossDescription) > 50) {
      nextErrors.lossDescription = "Έως 50 λέξεις.";
    }

    setLossErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateFosterForm = () => {
    const requiredKeys = [
      "fosterFirstName",
      "fosterLastName",
      "fosterPhone",
      "fosterAddress",
      "fosterEmail",
      "homeInfo",
      "lifestyleInfo",
      "experienceInfo",
      "petName",
      "petType",
      "petMicrochip",
      "petBreed",
      "petAge",
      "petGender",
    ];

    const nextErrors = {};
    requiredKeys.forEach((k) => {
      if (String(fosterForm[k] || "").trim() === "") {
        nextErrors[k] = "Υποχρεωτικό πεδίο.";
      }
    });

    const email = String(fosterForm.fosterEmail || "").trim();
    if (email && !email.includes("@")) {
      nextErrors.fosterEmail = "Βάλε σωστό e-mail (με @).";
    }

    const phone = String(fosterForm.fosterPhone || "").trim();
    if (phone && phone.length > 10) {
      nextErrors.fosterPhone = "Έως 10 ψηφία.";
    }

    if (countWords(fosterForm.homeInfo) > 50) {
      nextErrors.homeInfo = "Έως 50 λέξεις.";
    }
    if (countWords(fosterForm.lifestyleInfo) > 50) {
      nextErrors.lifestyleInfo = "Έως 50 λέξεις.";
    }
    if (countWords(fosterForm.experienceInfo) > 50) {
      nextErrors.experienceInfo = "Έως 50 λέξεις.";
    }

    setFosterErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateFindForm = () => {
    const requiredKeys = [
      "petType",
      "petBreed",
      "petColor",
      "petNameMicrochip",
      "petPhoto",
      "petDescription",
      "foundArea",
      "foundDate",
      "contactFirstName",
      "contactLastName",
      "contactPhone",
      "contactEmail",
      "contactNotes",
    ];

    const nextErrors = {};
    requiredKeys.forEach((k) => {
      if (String(findForm[k] || "").trim() === "") {
        nextErrors[k] = "Υποχρεωτικό πεδίο.";
      }
    });

    const email = String(findForm.contactEmail || "").trim();
    if (email && !email.includes("@")) {
      nextErrors.contactEmail = "Βάλε σωστό e-mail (με @).";
    }

    const phone = String(findForm.contactPhone || "").trim();
    if (phone && phone.length > 10) {
      nextErrors.contactPhone = "Έως 10 ψηφία.";
    }

    if (countWords(findForm.petDescription) > 50) {
      nextErrors.petDescription = "Έως 50 λέξεις.";
    }
    if (countWords(findForm.contactNotes) > 50) {
      nextErrors.contactNotes = "Έως 50 λέξεις.";
    }

    setFindErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateAdoptionForm = () => {
    const requiredKeys = [
      "adopterFirstName",
      "adopterLastName",
      "adopterPhone",
      "adopterAddress",
      "adopterEmail",
      "homeInfo",
      "lifestyleInfo",
      "experienceInfo",
      "petName",
      "petType",
      "petMicrochip",
      "petBreed",
      "petAge",
      "petGender",
    ];

    const nextErrors = {};
    requiredKeys.forEach((k) => {
      if (String(adoptionForm[k] || "").trim() === "") {
        nextErrors[k] = "Υποχρεωτικό πεδίο.";
      }
    });

    const email = String(adoptionForm.adopterEmail || "").trim();
    if (email && !email.includes("@")) {
      nextErrors.adopterEmail = "Βάλε σωστό e-mail (με @).";
    }

    const phone = String(adoptionForm.adopterPhone || "").trim();
    if (phone && phone.length > 10) {
      nextErrors.adopterPhone = "Έως 10 ψηφία.";
    }

    if (countWords(adoptionForm.homeInfo) > 50) {
      nextErrors.homeInfo = "Έως 50 λέξεις.";
    }
    if (countWords(adoptionForm.lifestyleInfo) > 50) {
      nextErrors.lifestyleInfo = "Έως 50 λέξεις.";
    }
    if (countWords(adoptionForm.experienceInfo) > 50) {
      nextErrors.experienceInfo = "Έως 50 λέξεις.";
    }

    setAdoptionErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateTransferForm = () => {
    const requiredKeys = [
      "currentFirstName",
      "currentLastName",
      "currentPhone",
      "currentAddress",
      "currentEmail",
      "newFirstName",
      "newLastName",
      "newPhone",
      "newAddress",
      "newEmail",
      "petName",
      "petType",
      "petMicrochip",
      "petBreed",
      "petAge",
      "petGender",
    ];

    const nextErrors = {};
    requiredKeys.forEach((k) => {
      if (String(transferForm[k] || "").trim() === "") {
        nextErrors[k] = "Υποχρεωτικό πεδίο.";
      }
    });

    const currentEmail = String(transferForm.currentEmail || "").trim();
    if (currentEmail && !currentEmail.includes("@")) {
      nextErrors.currentEmail = "Βάλε σωστό e-mail (με @).";
    }
    const newEmail = String(transferForm.newEmail || "").trim();
    if (newEmail && !newEmail.includes("@")) {
      nextErrors.newEmail = "Βάλε σωστό e-mail (με @).";
    }

    const currentPhone = String(transferForm.currentPhone || "").trim();
    if (currentPhone && currentPhone.length > 10) {
      nextErrors.currentPhone = "Έως 10 ψηφία.";
    }
    const newPhone = String(transferForm.newPhone || "").trim();
    if (newPhone && newPhone.length > 10) {
      nextErrors.newPhone = "Έως 10 ψηφία.";
    }

    setTransferErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const checkOwnerPet = async (microchipValue) => {
    try {
      setChecking(true);
      const res = await fetch(
        `http://localhost:3004/users/${ownerId}`
      );
      const owner = res.ok ? await res.json() : null;
      const microchip = String(microchipValue || "").trim();
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
      const nextErrors = {};
      if (!eventType) nextErrors.eventType = "Υποχρεωτικό πεδίο.";
      if (!eventDate) nextErrors.eventDate = "Υποχρεωτικό πεδίο.";
      setEventErrors(nextErrors);
      alert("Συμπλήρωσε συμβάν και ημερομηνία.");
      return;
    }
    if (eventType === "Απώλεια" && !validateLossForm()) return;
    if (eventType === "Εύρεση" && !validateFindForm()) return;
    if (eventType === "Υιοθεσία" && !validateAdoptionForm()) return;
    if (eventType === "Μεταβίβαση" && !validateTransferForm()) return;
    if (eventType === "Αναδοχή" && !validateFosterForm()) return;

    try {
      setSaving(true);
      const cleanEditId =
        editId && editId !== "undefined" && editId !== "null" ? editId : "";
      const payload = {
        petId,
        ownerId,
        type: eventType,
        date: eventDate,
        details:
          eventType === "Απώλεια"
            ? lossForm
            : eventType === "Εύρεση"
            ? findForm
            : eventType === "Υιοθεσία"
            ? adoptionForm
            : eventType === "Μεταβίβαση"
            ? transferForm
            : eventType === "Αναδοχή"
            ? fosterForm
            : {},
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

      if (status === "final" && eventType === "Απώλεια") {
        try {
          await updatePetLostFlag(true, lossForm.petMicrochip);
          await upsertLostPet();
        } catch (e) {
          console.error(e);
          alert("Η δήλωση αποθηκεύτηκε αλλά απέτυχε η ενημέρωση απωλειών.");
        }
      }

      if (status === "final" && eventType === "Εύρεση") {
        try {
          await updatePetLostFlag(false, findForm.petMicrochip);
          await removeLostPet();
        } catch (e) {
          console.error(e);
          alert("Η δήλωση αποθηκεύτηκε αλλά απέτυχε η ενημέρωση απωλειών.");
        }
      }
      navigate(`/vet_main/${vetId}/health-book/${ownerId}/${petId}`);
    } catch (e) {
      console.error(e);
      alert("Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <VetDashboard active="microchip" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
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
                  onChange={(e) => {
                    setEventType(e.target.value);
                    if (eventErrors.eventType) {
                      setEventErrors((prev) => ({ ...prev, eventType: "" }));
                    }
                  }}
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
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    if (eventErrors.eventDate) {
                      setEventErrors((prev) => ({ ...prev, eventDate: "" }));
                    }
                  }}
                  className="ve-date"
                  error={Boolean(eventErrors.eventDate)}
                  helperText={eventErrors.eventDate || ""}
                />
                {eventErrors.eventType && (
                  <div className="ve-error">{eventErrors.eventType}</div>
                )}
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
            errors={lossErrors}
          />
        )}

        {activeStep === 2 && eventType === "Απώλεια" && (
          <LossRequestPreview form={lossForm} />
        )}

        {activeStep === 1 && eventType === "Εύρεση" && (
          <FindRequestForm
            form={findForm}
            onChange={updateFindForm}
            petWordCount={countWords(findForm.petDescription)}
            notesWordCount={countWords(findForm.contactNotes)}
            errors={findErrors}
          />
        )}

        {activeStep === 2 && eventType === "Εύρεση" && (
          <FindRequestPreview form={findForm} />
        )}

        {activeStep === 1 && eventType === "Υιοθεσία" && (
          <AdoptionRequestForm
            form={adoptionForm}
            onChange={updateAdoptionForm}
            homeWordCount={countWords(adoptionForm.homeInfo)}
            lifestyleWordCount={countWords(adoptionForm.lifestyleInfo)}
            experienceWordCount={countWords(adoptionForm.experienceInfo)}
            errors={adoptionErrors}
          />
        )}

        {activeStep === 2 && eventType === "Υιοθεσία" && (
          <AdoptionRequestPreview form={adoptionForm} />
        )}

        {activeStep === 1 && eventType === "Αναδοχή" && (
          <FosterRequestForm
            form={fosterForm}
            onChange={updateFosterForm}
            homeWordCount={countWords(fosterForm.homeInfo)}
            lifestyleWordCount={countWords(fosterForm.lifestyleInfo)}
            experienceWordCount={countWords(fosterForm.experienceInfo)}
            errors={fosterErrors}
          />
        )}

        {activeStep === 2 && eventType === "Αναδοχή" && (
          <FosterRequestPreview form={fosterForm} />
        )}

        {activeStep === 1 && eventType === "Μεταβίβαση" && (
          <TransferRequestForm
            form={transferForm}
            onChange={updateTransferForm}
            errors={transferErrors}
          />
        )}

        {activeStep === 2 && eventType === "Μεταβίβαση" && (
          <TransferRequestPreview form={transferForm} />
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

        {activeStep === 3 && eventType === "Εύρεση" && (
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

        {activeStep === 3 && eventType === "Υιοθεσία" && (
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

        {activeStep === 3 && eventType === "Αναδοχή" && (
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

        {activeStep === 3 && eventType === "Μεταβίβαση" && (
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

        {activeStep > 0 &&
          eventType !== "Απώλεια" &&
          eventType !== "Εύρεση" &&
          eventType !== "Υιοθεσία" &&
          eventType !== "Μεταβίβαση" &&
          eventType !== "Αναδοχή" && (
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
                navigate(`/vet_main/${vetId}/health-book/${ownerId}/${petId}`);
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
                    const ok = await checkOwnerPet(lossForm.petMicrochip);
                    if (!ok) return;
                    setActiveStep(2);
                  })();
                } else if (activeStep === 1 && eventType === "Εύρεση") {
                  (async () => {
                    if (!validateFindForm()) return;
                    const ok = await checkOwnerPet(findForm.petMicrochip);
                    if (!ok) return;
                    setActiveStep(2);
                  })();
                } else if (activeStep === 1 && eventType === "Υιοθεσία") {
                  if (!validateAdoptionForm()) return;
                  setActiveStep(2);
                } else if (activeStep === 1 && eventType === "Αναδοχή") {
                  if (!validateFosterForm()) return;
                  setActiveStep(2);
                } else if (activeStep === 1 && eventType === "Μεταβίβαση") {
                  (async () => {
                    if (!validateTransferForm()) return;
                    const ok = await checkOwnerPet(transferForm.petMicrochip);
                    if (!ok) return;
                    setActiveStep(2);
                  })();
                } else if (activeStep === 2 && eventType === "Απώλεια") {
                  setActiveStep((s) => Math.min(s + 1, steps.length - 1));
                } else if (activeStep === 2 && eventType === "Εύρεση") {
                  setActiveStep((s) => Math.min(s + 1, steps.length - 1));
                } else if (activeStep === 2 && eventType === "Υιοθεσία") {
                  setActiveStep((s) => Math.min(s + 1, steps.length - 1));
                } else if (activeStep === 2 && eventType === "Αναδοχή") {
                  setActiveStep((s) => Math.min(s + 1, steps.length - 1));
                } else if (activeStep === 2 && eventType === "Μεταβίβαση") {
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
      </Box>
    </Box>
  );
}
