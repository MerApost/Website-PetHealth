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
import useScrollTop from "../components/useScrollTop";


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
  useScrollTop();
  const [tab, setTab] = React.useState(0);

  const owners = [
    { q: "Πώς μπορώ να καταχωρίσω το κατοικίδιό μου στην πλατφόρμα;", a: "Η καταχώριση γίνεται από κτηνίατρο. Δώστε του το ΑΦΜ σας και τα στοιχεία του κατοικιδίου και θα εμφανιστεί αυτόματα στο προφίλ σας." },
    { q: "Πώς βλέπω το βιβλιάριο υγείας του κατοικιδίου μου;", a: "Στην καρτέλα του ζώου σας εμφανίζονται όλες οι ιατρικές πράξεις που έχουν καταχωριστεί από κτηνιάτρους. Μπορείτε επίσης να το εκτυπώσετε." },
    { q: "Τι κάνω αν χάθηκε το κατοικίδιό μου;", a: "Κάνετε «Δήλωση Απώλειας» από το μενού δηλώσεων και συμπληρώνετε τα στοιχεία. Το κατοικίδιο εμφανίζεται στη λίστα απολεσθέντων." },
    { q: "Βρήκα το κατοικίδιό μου μετά τη δήλωση απώλειας.Πώς ενημερώνω;", a: "Κάνετε «Δήλωση Εύρεσης» με το ίδιο microchip. Έτσι ενημερώνεται η βάση και το ζώο αφαιρείται από τα απολεσθέντα." },
    { q: "Πώς μπορώ να κλείσω ραντεβού με κτηνίατρο;", a: "Από τη σελίδα «Βρες κτηνίατρο» επιλέγετε κτηνίατρο και στη συνέχεια «Κλείσε ραντεβού» για να ολοκληρώσετε τα βήματα." },
    { q: "Μπορώ να ακυρώσω ραντεβού;", a: "Ναι. Από το «Ιστορικό/Διαχείριση Ραντεβού» μπορείτε να πατήσετε «Απόρριψη» ή «Αναπρογραμματισμό» όπου υπάρχει." },
    { q: "Τι σημαίνει «εκκρεμές ραντεβού»;", a: "Ότι έχει σταλεί αίτημα και περιμένει επιβεβαίωση από τον κτηνίατρο." },
    { q: "Πού βλέπω το ιστορικό των ραντεβού μου;", a: "Στην ενότητα «Ιστορικό/Διαχείριση Ραντεβού» από το πλάι μενού." },
    { q: "Μπορώ να αξιολογήσω έναν κτηνίατρο;", a: "Ναι. Μετά από ένα ολοκληρωμένο ραντεβού μπορείτε να αφήσετε αξιολόγηση." },
  ];

  const vets = [
    { q: "Πώς δημιουργώ λογαριασμό ως κτηνίατρος;", a: "Από την «Εγγραφή» επιλέγετε ρόλο «Κτηνίατρος» και συμπληρώνετε τα επαγγελματικά στοιχεία." },
    { q: "Τι πληροφορίες μπορώ να καταχωρήσω για ένα κατοικίδιο;", a: "Μπορείτε να καταχωρίσετε στοιχεία ταυτότητας (microchip, είδος, ηλικία) και συμβάντα ζωής (απώλεια, εύρεση, υιοθεσία, μεταβίβαση κ.λπ.)." },
    { q: "Πώς καταχωρώ ιατρικές πράξεις;", a: "Από «Καταγραφή Ιατρικών Πράξεων» κάνετε αναζήτηση με microchip, συμπληρώνετε τα στοιχεία και πατάτε προσωρινή αποθήκευση ή οριστική υποβολή." },
    { q: "Μπορώ να αποθηκεύσω προσωρινά μια καταχώριση;", a: "Ναι. Οι προσωρινές εμφανίζονται ως εκκρεμείς και μπορείτε να τις επεξεργαστείτε ή να τις διαγράψετε." },
    { q: "Πώς ορίζω τη διαθεσιμότητά μου;", a: "Από την ενότητα «Διαθεσιμότητα» ορίζετε εβδομαδιαίο πρόγραμμα και εξαιρέσεις (γιορτές/αργίες)." },
    { q: "Πώς διαχειρίζομαι τα αιτήματα ραντεβού;", a: "Στη «Διαχείριση Ραντεβού» μπορείτε να δείτε εκκρεμή, επιβεβαιωμένα και απορριφθέντα και να επιβεβαιώσετε ή να απορρίψετε." },
    { q: "Τι συμβαίνει όταν ακυρωθεί ένα ραντεβού;", a: "Η κατάσταση αλλάζει σε ακυρωμένο και η ώρα γίνεται ξανά διαθέσιμη για νέα ραντεβού." },
    { q: "Πού βλέπω το ιστορικό ιατρικών πράξεων;", a: "Στο «Βιβλιάριο Υγείας» του κατοικιδίου, στις καρτέλες ιατρικών πράξεων και συμβάντων." },
    { q: "Μπορώ να δω τις αξιολογήσεις μου;", a: "Ναι, στην ενότητα «Αξιολογήσεις». Οι αξιολογήσεις εμφανίζονται μόνο εφόσον προέρχονται από ολοκληρωμένα ραντεβού." },
  ];

  const citizens = [
    { q: "Πώς μπορώ να δω απολεσθέντα ζώα;", a: "Από τη σελίδα «Απολεσθέντα» βλέπετε τη λίστα και μπορείτε να κάνετε αναζήτηση/φίλτρα." },
    { q: "Χρειάζεται να δημιουργήσω λογαριασμό;", a: "Όχι. Μπορείτε να δείτε όλα τα απολεσθέντα κατοικίδια χωρίς εγγραφή." },
    { q: "Βρήκα ένα κατοικίδιο. Μπορώ να το δηλώσω;", a: "Ναι, μέσω «Δήλωσης Εύρεσης» χωρίς να απαιτείται σύνδεση." },
    { q: "Ποια στοιχεία μου εμφανίζονται στον ιδιοκτήτη;", a: "Μόνο τα στοιχεία επικοινωνίας που συμπληρώνετε στη φόρμα εύρεσης." },
    { q: "Μπορώ να δω αν κάποιος δήλωσε ότι έχασε ένα ζώο που βρήκα;", a: "Μπορείτε να αναζητήσετε στη λίστα απολεσθέντων με microchip ή στοιχεία και να δείτε το προφίλ του ζώου." },
    { q: "Μπορώ να βοηθήσω χωρίς λογαριασμό;", a: "Ναι. Η αναζήτηση απολεσθέντων και η δήλωση εύρεσης γίνονται χωρίς σύνδεση." },
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
