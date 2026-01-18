import "./PrivacyPolicy.css";
import BackButton from "../components/BackButton/BackButton";
import "../components/BackButton/BackButton.css";
import useScrollTop from "../components/useScrollTop";

export default function PrivacyPolicy() {
  useScrollTop();
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Πολιτική Απορρήτου</h1>

        <hr className="legal-divider" />

        <h2 className="legal-heading">1. Γενικά</h2>
        <p className="legal-text">
            Η προστασία των προσωπικών δεδομένων των χρηστών αποτελεί προτεραιότητα. Η παρούσα Πολιτική εξηγεί πώς συλλέγουμε, χρησιμοποιούμε, αποθηκεύουμε και προστατεύουμε τα δεδομένα.        </p>



        <h2 className="legal-heading">2. Δεδομένα που Συλλέγονται</h2>
        <p className="legal-text">
         Ανάλογα με τον τύπο χρήστη, η πλατφόρμα συλλέγει: <br />
         Α. Ιδιοκτήτες κατοικιδίων  
        </p>
        <ul className="legal-list">
          <li>Ονοματεπώνυμο, email, τηλέφωνο</li>
          <li>Στοιχεία κατοικιδίου (όνομα, ηλικία, φύλο, μικροτσίπ)</li>
          <li>Ιστορικό ιατρικών πράξεων</li>
          <li>Ιστορικό δηλώσεων (απώλειας/εύρεσης)</li>
          <li>Ραντεβού</li>
        </ul>
        <p className="legal-text">
        Β. Κτηνίατροι
        </p>
        <ul className="legal-list">
          <li>Στοιχεία ταυτοποίησης επαγγελματία</li>
          <li>Προφίλ κτηνιάτρου (σπουδές, ειδικότητα, εμπειρία)</li>
          <li>Διαθεσιμότητες</li>
          <li>Ιατρικές πράξεις που καταχωρούνται</li>
        </ul>
         <p className="legal-text"> Γ. Πολίτες (χωρίς login)</p>
        <ul className="legal-list">
          <li>Προαιρετικά στοιχεία σε περίπτωση δήλωσης εύρεσης (π.χ. όνομα, τηλέφωνο).</li>
        </ul>



        <h2 className="legal-heading">3.  Χρήση των Δεδομένων</h2>
        <p className="legal-text">
          Τα δεδομένα χρησιμοποιούνται για: </p>
        <ul className="legal-list">
          <li>λειτουργία της πλατφόρμας,</li>
          <li>παροχή υπηρεσιών προς τους χρήστες,</li>
          <li>επικοινωνία για ραντεβού και ενημερώσεις,</li>
          <li>βελτίωση της εμπειρίας χρήσης,</li>
          <li>προστασία από κατάχρηση και καταγραφή συμβάντων.</li>
        
        </ul>



        <h2 className="legal-heading">4. Κοινοποίηση Δεδομένων</h2>
        <p className="legal-text">
            Τα δεδομένα δεν κοινοποιούνται σε τρίτους, εκτός: </p>
         <ul className="legal-list">
            <li>αν απαιτείται από τον νόμο,</li>
            <li>αν αφορά δημοσίευση απολεσθέντος ζώου (χωρίς προσωπικά στοιχεία ιδιοκτήτη),</li>
            <li>αν υπάρχει ρητή συγκατάθεση του χρήστη.</li>

        </ul>



        <h2 className="legal-heading">5.Αποθήκευση & Ασφάλεια</h2>
        <p className="legal-text">   Τα δεδομένα αποθηκεύονται με τεχνικά και οργανωτικά μέτρα ασφαλείας, όπως:</p>
         <ul className="legal-list">
            <li>κρυπτογράφηση,</li>
            <li>περιορισμένη πρόσβαση προσωπικού,</li>
            <li>ασφαλής διαχείριση μεταδεδομένων.</li>
        </ul>


        <h2 className="legal-heading">6. Δικαιώματα Χρηστών</h2>
        <p className="legal-text">
                 Οι χρήστες μπορούν:
        </p>
        <ul className="legal-list">
            <li>να ζητήσουν πρόσβαση στα δεδομένα τους,</li>
            <li>να τα διορθώσουν,</li>
            <li>να ζητήσουν διαγραφή (δικαίωμα στη λήθη),</li>
            <li>να ζητήσουν φορητότητα,</li>
            <li>να αποσύρουν τη συγκατάθεση.</li>
        </ul>



        <h2 className="legal-heading">7. Cookies</h2>
        <p className="legal-text">
                     Η πλατφόρμα χρησιμοποιεί cookies μόνο για τεχνικούς σκοπούς (session, λειτουργικότητα, προτιμήσεις). Δεν χρησιμοποιεί cookies διαφήμισης.
        </p>



        <h2 className="legal-heading">8. Αλλαγές στην Πολιτική</h2>
        <p className="legal-text">
           Οι αλλαγές δημοσιεύονται στην πλατφόρμα και τίθενται σε ισχύ άμεσα.
        </p>


      </div>

      <div className="back-button-spacing">
        <BackButton />
      </div>

    </div>

    

  );
}
