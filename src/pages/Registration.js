import * as React from "react";
import "./Registration.css";

import { useNavigate } from "react-router-dom";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";


export default function Registration() {
  const navigate = useNavigate();

  const [role, setRole] = React.useState("owner");
  const isVet = role === "vet";   //boolean 

  const [form, setForm] = React.useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    afm: "",

    petsCount: "",

    gender: "",
    experience: "",
    studiesLevel: "",
    clinicAddress: "",
    specialty: "",
    licenseNumber: "",
    profession: "",


    password: "",
    confirmPassword: "",
  });

  const [acceptTerms, setAcceptTerms] = React.useState(false);

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const password = form.password;

  const rules = {
      len: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9\s]/.test(password),
    };

  const allGood = Object.values(rules).every(Boolean);
  const match = form.password.length > 0 && form.password === form.confirmPassword;

  const onSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      role: role,
      name: form.name,
      surname: form.surname,
      email: form.email,
      phone: form.phone,
      afm: form.afm,
      password: form.password
    };

    if (role === "owner") {
      newUser.petsCount = form.petsCount;
    } else {
      newUser.gender = form.gender;
      newUser.experience = form.experience;
      newUser.studiesLevel = form.studiesLevel;
      newUser.clinicAddress = form.clinicAddress;
      newUser.specialty = form.specialty;
      newUser.licenseNumber = form.licenseNumber;
      newUser.profession = form.profession;
    }

    try {
    const checkRes = await fetch(
      `http://localhost:3004/users?role=${role}&afm=${form.afm}`
    );
    const exists = await checkRes.json();
    if (exists.length > 0) {
      alert("Υπάρχει ήδη χρήστης με αυτό το ΑΦΜ.");
      return;
    }

    await fetch("http://localhost:3004/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    alert("Η εγγραφή ολοκληρώθηκε!");
    navigate("/login");
  } catch (err) {
    alert("Σφάλμα σύνδεσης με τον server. Είναι ανοιχτός ο json-server;");
    console.log(err);
  }
   
  };

  const RuleItem = ({ ok, text }) => (
    <div className={`pw-rule ${ok ? "ok" : "bad"}`}>
      {ok ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="reg-page">
      <Paper elevation={0} className="reg-card">
        <Typography variant="h6" className="reg-title">
          Δημιουργία Νέου Λογαριασμού
        </Typography>
        <Typography variant="body2" className="reg-subtitle">
          Επιλέξτε τον τύπο χρήστη και συμπληρώστε τα στοιχεία σας
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={role}
          onChange={(_e, val) => val && setRole(val)}
          className="reg-toggle"
        >
          <ToggleButton value="owner" className="reg-toggle-btn">
            Ιδιοκτήτης
          </ToggleButton>
          <ToggleButton value="vet" className="reg-toggle-btn">
            Κτηνίατρος
          </ToggleButton>
        </ToggleButtonGroup>

        <form onSubmit={onSubmit} className="reg-form">
          <div className="reg-grid">
            <TextField label="Όνομα:" required value={form.name} onChange={setField("name")} size="small" fullWidth />
            <TextField label="Επίθετο:" required value={form.surname} onChange={setField("surname")} size="small" fullWidth />

            <TextField label="E-mail:" type="email" required value={form.email} onChange={setField("email")} size="small" fullWidth />
            <TextField label="Τηλέφωνο:" required value={form.phone} onChange={setField("phone")} size="small" fullWidth />

            {/* ιδιοκτιτης */}

            {!isVet && (
              <>
                <TextField
                  label="Δημιουργία Κωδικού Πρόσβασης:"
                  required
                  type="password"
                  value={form.password}
                  onChange={setField("password")}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Αριθμός Κατοικιδίων:"
                  type="number"
                  value={form.petsCount}
                  onChange={setField("petsCount")}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Επαλήθευση Κωδικού:"
                  required
                  type="password"
                  value={form.confirmPassword}
                  onChange={setField("confirmPassword")}
                  size="small"
                  fullWidth
                />
                <TextField label="ΑΦΜ:" required value={form.afm} onChange={setField("afm")} size="small" fullWidth />
              </>
            )}

            {/* κτηνιατροσ */}
            {isVet && (
              <>
                <TextField label="ΑΦΜ:" required value={form.afm} onChange={setField("afm")} size="small" fullWidth />
                <TextField label="Φύλο:" value={form.gender} onChange={setField("gender")} size="small" fullWidth />

                <TextField label="Έτη εμπειρίας:" type="number" value={form.experience} onChange={setField("experience")} size="small" fullWidth />
                <TextField
                  label="Επίπεδο Σπουδών:"
                  value={form.studiesLevel}
                  onChange={setField("studiesLevel")}
                  size="small"
                  fullWidth
                />

                <TextField
                  label="Διεύθυνση Ιατρείου:"
                  value={form.clinicAddress}
                  onChange={setField("clinicAddress")}
                  size="small"
                  fullWidth
                />
                <TextField label="Ειδικότητα:" value={form.specialty} onChange={setField("specialty")} size="small" fullWidth />

                <TextField
                  label="Αριθμός Άδειας Ασκήσεως:"
                  type="number"
                  required
                  value={form.licenseNumber}
                  onChange={setField("licenseNumber")}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Επάγγελμα:"
                  value={form.profession}
                  onChange={setField("profession")}
                  size="small"
                  fullWidth
                />

                <TextField
                  label="Δημιουργία Κωδικού Πρόσβασης:"
                  required
                  type="password"
                  value={form.password}
                  onChange={setField("password")}
                  size="small"
                  fullWidth
                />
                <Box />

                <TextField
                  label="Επιβεβαίωση Κωδικού:"
                  required
                  type="password"
                  value={form.confirmPassword}
                  onChange={setField("confirmPassword")}
                  size="small"
                  fullWidth
                />
                <Box />
              </>
            )}
          </div>

          <div className="pw-box">
            <RuleItem ok={rules.len} text="Ο κωδικός να έχει τουλάχιστον 8 χαρακτήρες" />
            <RuleItem ok={rules.upper} text="Ο κωδικός να έχει κεφαλαίο γράμμα" />
            <RuleItem ok={rules.lower} text="Ο κωδικός να έχει μικρό γράμμα" />
            <RuleItem ok={rules.number} text="Ο κωδικός να έχει αριθμό" />
            <RuleItem ok={rules.special} text="Ο κωδικός να έχει ειδικό χαρακτήρα (π.χ. ! @ #)" />
            <RuleItem ok={match} text="Οι κωδικοί ταιριάζουν" />
          </div>

          <div className="reg-checkboxes">
            <FormControlLabel
                control={
                <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                }
                label={
                <span>
                    Αποδέχομαι τους{" "}
                    <Link component="button" className="reg-link" onClick={(e) => {e.preventDefault(); navigate("/terms");}}>
                    Όρους Χρήσης
                    </Link>{" "}
                    και την{" "}
                    <Link component="button" className="reg-link" onClick={(e) => {e.preventDefault(); navigate("/privacy")}}>
                    Πολιτική Απορρήτου
                    </Link>
                </span>
                }
            />
            </div>

          <Button type="submit" variant="contained" className="reg-submit" disabled={!allGood || !match || !acceptTerms}>
            Δημιουργία λογαριασμού
          </Button>

          <div className="reg-bottom">
            <Link component="button" className="reg-link" onClick={() => navigate("/login")}>
              Έχω ήδη λογαριασμό
            </Link>
          </div>
        </form>
      </Paper>
    </div>
  );
}
