import * as React from "react";
import "./Faq.css";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import BackButton from "../components/BackButton/BackButton";
import "../components/BackButton/BackButton.css";


//δειχνει περιεχομενο αναλογα το tab που είναι ανοικτό
function TabPanel({ value, index, children }) {
  if (value !== index) return null;
  return <div>{children}</div>;
}


function ControlledAccordionList({ items, groupKey }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {items.map((it, idx) => {
        const panelId = `${groupKey}-panel-${idx}`;
        return (
          <Accordion
            key={panelId}
            expanded={expanded === panelId}
            onChange={handleChange(panelId)}
            className="faq-accordion"
            disableGutters
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${panelId}-content`}
              id={`${panelId}-header`}
              className="faq-accordion-summary"
            >
              <Typography className="faq-question">
                {idx + 1}. {it.q}
              </Typography>
            </AccordionSummary>

            <AccordionDetails className="faq-accordion-details">
              <Typography className="faq-answer">{it.a}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

export default function Faq() {
  const [tab, setTab] = React.useState(0);

  const owners = [
    { q: "Πώς μπορώ να καταχωρίσω το κατοικίδιό μου στην πλατφόρμα;", a: "ααα" },
    { q: "Πώς βλέπω το βιβλιάριο υγείας του κατοικιδίου μου;", a: "Στην καρτέλα του ζώου σας εμφανίζονται όλες οι ιατρικές πράξεις που έχουν καταχωριστεί από κτηνιάτρους. Μπορείτε επίσης να το εκτυπώσετε." },
    { q: "Τι κάνω αν χάθηκε το κατοικίδιό μου;", a: "ααααα" },
    { q: "Βρήκα το κατοικίδιό μου μετά τη δήλωση απώλειας.Πώς ενημερώνω;", a: "ααααααααα" },
    { q: "Πώς μπορώ να κλείσω ραντεβού με κτηνίατρο;", a: "ααααααααα" },
    { q: "Μπορώ να ακυρώσω ραντεβού;", a: "αααααα" },
    { q: "Τι σημαίνει «εκκρεμές ραντεβού»;", a: "ααααααααα" },
    { q: "Πού βλέπω το ιστορικό των ραντεβού μου;", a: "αααα" },
    { q: "Μπορώ να αξιολογήσω έναν κτηνίατρο;", a: "Ναι. Μετά από ένα ολοκληρωμένο ραντεβού μπορείτε να αφήσετε αξιολόγηση." },
  ];

  const vets = [
    { q: "Πώς δημιουργώ λογαριασμό ως κτηνίατρος;", a: "Από την «Εγγραφή» επιλέγετε ρόλο «Κτηνίατρος» και συμπληρώνετε τα επαγγελματικά στοιχεία." },
    { q: "Τι πληροφορίες μπορώ να καταχωρήσω για ένα κατοικίδιο;", a: "Μπορείτε να καταχωρίσετε στοιχεία ταυτότητας (microchip, είδος, ηλικία) και συμβάντα ζωής (απώλεια, εύρεση, υιοθεσία, μεταβίβαση κ.λπ.)." },
    { q: "Πώς καταχωρώ ιατρικές πράξεις;", a: "αααααααα" },
    { q: "Μπορώ να αποθηκεύσω προσωρινά μια καταχώριση;", a: "ααααα" },
    { q: "Πώς ορίζω τη διαθεσιμότητά μου;", a: "ααααα" },
    { q: "Πώς διαχειρίζομαι τα αιτήματα ραντεβού;", a: "ααααααα" },
    { q: "Τι συμβαίνει όταν ακυρωθεί ένα ραντεβού;", a: "ασααα" },
    { q: "Πού βλέπω το ιστορικό ιατρικών πράξεων;", a: "αααααααα" },
    { q: "Μπορώ να δω τις αξιολογήσεις μου;", a: "Ναι, στην ενότητα «Αξιολογήσεις». Οι αξιολογήσεις εμφανίζονται μόνο εφόσον προέρχονται από ολοκληρωμένα ραντεβού." },
  ];

  const citizens = [
    { q: "Πώς μπορώ να δω απολεσθέντα ζώα;", a: "ααααααααααααα" },
    { q: "Χρειάζεται να δημιουργήσω λογαριασμό;", a: "Όχι. Μπορείτε να δείτε όλα τα απολεσθέντα κατοικίδια χωρίς εγγραφή." },
    { q: "Βρήκα ένα κατοικίδιο. Μπορώ να το δηλώσω;", a: "αααααα" },
    { q: "Ποια στοιχεία μου εμφανίζονται στον ιδιοκτήτη;", a: "ααααα" },
    { q: "Μπορώ να δω αν κάποιος δήλωσε ότι έχασε ένα ζώο που βρήκα;", a: "αααα" },
    { q: "Μπορώ να βοηθήσω χωρίς λογαριασμό;", a: "ααα" },
    { q: "Τι κάνω αν πιστεύω ότι ένα ζώο που βρήκα έχει μικροτσίπ;", a: "Μπορείτε να επικοινωνήσετε με έναν κοντινό κτηνίατρο για έλεγχο μικροτσίπ ή να χρησιμοποιήσετε τη φόρμα εύρεσης για να ενημερώσετε τον ιδιοκτήτη." },

  ];

  return (
    <div className="faq-page">
      <div className="faq-card">
        <Tabs
          value={tab}
          onChange={(_e, newVal) => setTab(newVal)}
          className="faq-tabs"
        >
            <Tab label="Ιδιοκτήτες" />
            <Tab label="Κτηνίατροι" />
            <Tab label="Πολίτες" />

        </Tabs>

        <TabPanel value={tab} index={0}>
          <ControlledAccordionList items={owners} groupKey="owners" />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <ControlledAccordionList items={vets} groupKey="vets" />
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <ControlledAccordionList items={citizens} groupKey="citizens" />
        </TabPanel>
      </div>

      <div className="back-button-spacing">
        <BackButton />
      </div>
    </div>
  );
}
