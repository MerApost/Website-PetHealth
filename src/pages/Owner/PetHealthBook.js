import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Tabs, Tab, Pagination, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './PetHealthBook.css'; // Import CSS file

const drawerWidth = 270;

// Tabs Components
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Helper function για να επιστρέφει τα δεδομένα ενός κατοικίδιου
const getPetContent = (
  pet,
  currentPageEvents,
  setCurrentPageEvents,
  currentPageHealth,
  setCurrentPageHealth,
  printRef,
  eventsData,
  healthData,
  birthDate
) => {
  // Ρυθμίσεις pagination
  const rowsPerPage = 5;
  
  // Υπολογισμός των δεδομένων που θα εμφανιστούν για την τρέχουσα σελίδα
  const indexOfLastEvent = currentPageEvents * rowsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - rowsPerPage;
  const currentEvents = eventsData.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalEventPages = Math.ceil(eventsData.length / rowsPerPage);

  const indexOfLastHealth = currentPageHealth * rowsPerPage;
  const indexOfFirstHealth = indexOfLastHealth - rowsPerPage;
  const currentHealth = healthData.slice(indexOfFirstHealth, indexOfLastHealth);
  const totalHealthPages = Math.ceil(healthData.length / rowsPerPage);

  // Συναρτήσεις για αλλαγή σελίδας
  const handleEventsPageChange = (event, page) => {
    setCurrentPageEvents(page);
  };

  const handleHealthPageChange = (event, page) => {
    setCurrentPageHealth(page);
  };

  // Συνάρτηση για εκτύπωση - Εμφανίζει ΟΛΑ τα δεδομένα
  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Βιβλιάριο Υγείας - ${pet.name}</title>
        <meta charset="UTF-8">
        <style>
          @media print {
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 20px;
              font-size: 12px;
            }
            .print-container { 
              max-width: 100%;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .print-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #000;
            }
            .print-subtitle {
              font-size: 18px;
              color: #555;
              margin-bottom: 20px;
            }
            .print-section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .print-section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              background-color: #f0f0f0;
              padding: 8px;
              border-radius: 4px;
              color: #000;
              border-left: 4px solid #2e7d32;
            }
            .print-pet-info {
              display: flex;
              margin-bottom: 25px;
              gap: 30px;
              align-items: flex-start;
            }
            .print-pet-photo {
              width: 180px;
              height: 220px;
              border: 1px solid #000;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f5f5f5;
              flex-shrink: 0;
            }
            .print-pet-details {
              flex: 1;
            }
            .print-pet-details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .print-detail-item {
              margin-bottom: 6px;
            }
            .print-detail-label {
              font-weight: bold;
              color: #000;
              display: inline-block;
              width: 160px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 6px 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              color: #000;
            }
            .print-instruction {
              margin-bottom: 6px;
              padding-left: 15px;
            }
            .print-footer {
              margin-top: 40px;
              text-align: center;
              font-size: 11px;
              color: #777;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .page-break {
              page-break-before: always;
            }
            .print-total {
              font-weight: bold;
              margin-bottom: 10px;
              color: #2e7d32;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <div class="print-title">Βιβλιάριο Υγείας Κατοικίδιου</div>
            <div class="print-subtitle">${pet.name} - ${new Date().toLocaleDateString('el-GR')}</div>
          </div>
          
          <div class="print-section">
            <div class="print-section-title">Στοιχεία Κατοικιδίου</div>
            <div class="print-pet-info">
              <div class="print-pet-photo">
                ${pet.photo ? `<img src="${pet.photo}" alt="${pet.name}" style="width:100%;height:100%;object-fit:cover;">` : '<div style="text-align:center;color:#777;">Χωρίς φωτογραφία</div>'}
              </div>
              <div class="print-pet-details">
                <div class="print-pet-details-grid">
                  <div class="print-detail-item">
                    <span class="print-detail-label">Όνομα:</span> ${pet.name}
                  </div>
                  <div class="print-detail-item">
                    <span class="print-detail-label">Είδος:</span> ${pet.type || 'Άγνωστο'}
                  </div>
                  <div class="print-detail-item">
                    <span class="print-detail-label">Ράτσα:</span> ${pet.breed || 'Άγνωστη'}
                  </div>
                  <div class="print-detail-item">
                    <span class="print-detail-label">Χρώμα:</span> ${pet.color || 'Άγνωστο'}
                  </div>
                  ${pet.microchip ? `
                    <div class="print-detail-item">
                      <span class="print-detail-label">Αριθμός Microchip:</span> ${pet.microchip}
                    </div>
                  ` : ''}
                  <div class="print-detail-item">
                    <span class="print-detail-label">Φύλο:</span> ${pet.gender || 'Άγνωστο'}
                  </div>
                  <div class="print-detail-item">
                    <span class="print-detail-label">Ηλικία:</span> ${pet.age || 'Άγνωστη'} ${pet.age === "1" ? "έτους" : "ετών"}
                  </div>
                  <div class="print-detail-item">
                    <span class="print-detail-label">Ημ/νία Γέννησης:</span> ${birthDate || "Άγνωστο"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="print-section">
            <div class="print-section-title">Συμβάντα Ζωής Κατοικιδίου</div>
            <div class="print-total">Σύνολο: ${eventsData.length} συμβάντα</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">A/A</th>
                  <th>Γεγονός</th>
                  <th style="width: 100px;">Ημ/νία</th>
                </tr>
              </thead>
              <tbody>
                ${eventsData.map((item, index) => `
                  <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${item.event}</td>
                    <td>${item.date}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="print-section page-break">
            <div class="print-section-title">Βιβλιάριο Υγείας</div>
            <div class="print-total">Σύνολο: ${healthData.length} εγγραφές</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">A/A</th>
                  <th>Ιατρικές Πράξεις</th>
                  <th>Φαρμακευτική Αγωγή</th>
                  <th>Δοσολογία & Συχνότητα</th>
                  <th style="width: 90px;">Ημ/νία</th>
                </tr>
              </thead>
              <tbody>
                ${healthData.map((item, index) => `
                  <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${item.procedure}</td>
                    <td>${item.medication}</td>
                    <td>${item.dosage}</td>
                    <td>${item.date}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="print-section">
            <div class="print-section-title">Οδηγίες</div>
            <div>
              ${[
                "Να δίνεται το φάρμακο μετά το φαγητό για να αποφεύγεται δυσφορία στο στομάχι.",
                "Να παρατηρείται το κατοικίδιο για τυχόν αλλεργικές αντιδράσεις τις πρώτες 24 ώρες.",
                "Να διατηρείται ο χώρος του κατοικίδιου καθαρός και στεγνός κατά τη διάρκεια της ανάρρωσης.",
                "Να αποφεύγονται έντονα σπορ και μακριές βόλτες για τις επόμενες 48 ώρες.",
                "Επικοινωνήστε με τον κτηνίατρο σε περίπτωση έντονου πόνου ή πυρετού."
              ].map((instruction, index) => `
                <div class="print-instruction">
                  <strong>${index + 1}.</strong> ${instruction}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="print-footer">
            <p>Εκτυπώθηκε από το PetCare System στις ${new Date().toLocaleString('el-GR')}</p>
            <p style="font-size: 10px; color: #999;">Πλήρης έκθεση - Όλα τα δεδομένα</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Box 
      ref={printRef}
      className="pet-content-box"
    >
      {/* Κουμπί εκτύπωσης - πάνω δεξιά */}
      <div className="print-button">
        <Button 
          variant="contained"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          title="Εκτύπωση πλήρους έκθεσης"
          className="print-button-content"
        >
          Εκτύπωση
        </Button>
      </div>
      
      {/* Πρώτο μικρό box - Φωτογραφία και πληροφορίες κατοικίδιου */}
      <Box className="pet-info-box" sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        {/* Φωτογραφία - αριστερά */}
        <Box className="pet-photo-container">
          {pet.photo ? (
            <img 
              src={pet.photo} 
              alt={pet.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <InsertPhotoIcon className="pet-photo-placeholder" />
          )}
        </Box>
        
        {/* Πληροφορίες - δεξιά */}
        <Box className="pet-details-container">
          <Typography variant="h5" className="section-title">
            Στοιχεία Κατοικιδίου
          </Typography>
          
          {/* Δίστηλη διάταξη με Grid */}
          <Box className="details-grid">
            
            {/* Πρώτη στήλη - στοίχιση αριστερά */}
            <Box className="details-column">
              <Box className="detail-item">
                <Typography variant="body1" className="detail-text">
                  <strong>Όνομα:</strong> {pet.name}
                </Typography>
              </Box>
              <Box className="detail-item">
                <Typography variant="body1" className="detail-text">
                  <strong>Είδος:</strong> {pet.type || 'Άγνωστο'}
                </Typography>
              </Box>
              <Box className="detail-item">
                <Typography variant="body1" className="detail-text">
                  <strong>Ράτσα:</strong> {pet.breed || 'Άγνωστη'}
                </Typography>
              </Box>
              <Box className="detail-item">
                <Typography variant="body1" className="detail-text">
                  <strong>Χρώμα:</strong> {pet.color || 'Άγνωστο'}
                </Typography>
              </Box>
            </Box>
            
            {/* Δεύτερη στήλη - στοίχιση αριστερά */}
            <Box className="details-column">
              {pet.microchip && (
                <Box className="detail-item">
                  <Typography variant="body1" className="detail-text">
                    <strong>Αριθμός Microchip:</strong> {pet.microchip}
                  </Typography>
                </Box>
              )}
              <Box className="detail-item">
                <Typography variant="body1" className="detail-text">
                  <strong>Φύλο:</strong> {pet.gender || 'Άγνωστο'}
                </Typography>
              </Box>
              <Box className="detail-item">
                <Typography variant="body1" className="detail-text">
                  <strong>Ηλικία:</strong> {pet.age || 'Άγνωστη'} {pet.age === "1" ? "έτους" : "ετών"}
                </Typography>
              </Box>
              <Box className="detail-item">
                <Typography variant="body1" className="detail-text">
                  <strong>Ημ/νία Γέννησης:</strong> {birthDate || "Άγνωστο"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Δεύτερο μικρό box - Συμβάντα Ζωής */}
      <Box className="pet-info-box">
        <Typography variant="h5" className="section-title">
          Συμβάντα Ζωής Κατοικιδίου
        </Typography>
        
        {/* Πίνακας Συμβάντων */}
        <Box className="pet-table-container">
          <Box className="pet-table pet-table-small">
            {/* Κεφαλίδα πίνακα */}
            <Box className="table-header table-row table-row-small">
              <Box className="table-cell">
                A/A
              </Box>
              <Box className="table-cell-left">
                Γεγονός
              </Box>
              <Box className="table-cell-left">
                Ημ/νία
              </Box>
            </Box>
            
            {/* Σώμα πίνακα - Χρησιμοποιώντας τα δεδομένα με pagination */}
            <Box>
              {currentEvents.map((item, index) => (
                <Box 
                  key={item.id}
                  className="table-row table-row-small"
                  sx={{ 
                    borderBottom: index < currentEvents.length - 1 ? '1px solid #ddd' : 'none',
                  }}
                >
                  <Box className="table-cell">
                    {(currentPageEvents - 1) * 5 + index + 1}
                  </Box>
                  <Box className="table-cell-left">
                    {item.event}
                  </Box>
                  <Box className="table-cell-left">
                    {item.date}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        {/* Pagination controls για Συμβάντα */}
        {totalEventPages > 1 && (
          <Box className="pagination-container">
            <Pagination
              count={totalEventPages}
              page={currentPageEvents}
              onChange={handleEventsPageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
      
      {/* Τρίτο μικρό box - Βιβλιάριο Υγείας */}
      <Box className="pet-info-box">
        <Typography variant="h5" className="section-title">
          Βιβλιάριο Υγείας
        </Typography>
        
        {/* Πίνακας Υγείας */}
        <Box className="pet-table-container">
          <Box className="pet-table pet-table-large">
            {/* Κεφαλίδα πίνακα */}
            <Box className="table-header table-row table-row-large">
              <Box className="table-cell">
                A/A
              </Box>
              <Box className="table-cell-left">
                Ιατρικές Πράξεις
              </Box>
              <Box className="table-cell-left">
                Φαρμακευτική Αγωγή 
              </Box>
              <Box className="table-cell-left">
                Δοσολογία & Συχνότητα
              </Box>
              <Box className="table-cell-left">
                Ημ/νία
              </Box>
            </Box>
            
            {/* Σώμα πίνακα - Χρησιμοποιώντας τα δεδομένα με pagination */}
            <Box>
              {currentHealth.map((item, index) => (
                <Box 
                  key={item.id}
                  className="table-row table-row-large"
                  sx={{ 
                    borderBottom: index < currentHealth.length - 1 ? '1px solid #ddd' : 'none',
                  }}
                >
                  <Box className="table-cell">
                    {(currentPageHealth - 1) * 5 + index + 1}
                  </Box>
                  <Box className="table-cell-left">
                    {item.procedure}
                  </Box>
                  <Box className="table-cell-left">
                    {item.medication}
                  </Box>
                  <Box className="table-cell-left">
                    {item.dosage}
                  </Box>
                  <Box className="table-cell-left">
                    {item.date}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        {/* Pagination controls για Βιβλιάριο Υγείας */}
        {totalHealthPages > 1 && (
          <Box className="pagination-container">
            <Pagination
              count={totalHealthPages}
              page={currentPageHealth}
              onChange={handleHealthPageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>

      {/* Τέταρτο μικρό box - Οδηγίες */}
      <Box className="pet-info-box">
        <Typography variant="h5" className="section-title">
          Οδηγίες
        </Typography>
        <Box className="instructions-container">
          {[
            "Να δίνεται το φάρμακο μετά το φαγητό για να αποφεύγεται δυσφορία στο στομάχι.",
            "Επικοινωνήστε με τον κτηνίατρο σε περίπτωση έντονου πόνου ή πυρετού."
          ].map((instruction, index) => (
            <Box key={index} className="instruction-item">
              <Typography className="instruction-number">
                {index + 1}.
              </Typography>
              <Typography>
                {instruction}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default function PetHealthBook() {
  const { id: userId, petid: petId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [pets, setPets] = useState([]);
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [eventsByPet, setEventsByPet] = useState({});
  const [healthByPet, setHealthByPet] = useState({});
  const [birthByPet, setBirthByPet] = useState({});
  
  // State για τα tabs
  const [value, setValue] = React.useState(0);
  
  // State για pagination - ξεχωριστά για κάθε κατοικίδιο
  const [currentPageEvents, setCurrentPageEvents] = useState(1);
  const [currentPageHealth, setCurrentPageHealth] = useState(1);
  
  // Ref για το περιεχόμενο που θα εκτυπωθεί
  const printRef = useRef(null);
  
  const mapEvents = (items) =>
    (Array.isArray(items) ? items : []).map((item) => ({
      id: item.id,
      event: item.type || "—",
      date: item.date || "—",
    }));

  const mapHealth = (items) =>
    (Array.isArray(items) ? items : []).map((item) => {
      const dosage = item.dosage ? String(item.dosage) : "";
      const frequency = item.frequency ? String(item.frequency) : "";
      const dosageText =
        dosage && frequency ? `${dosage} / ${frequency}` : dosage || frequency || "—";
      return {
        id: item.id,
        procedure: item.actType || "—",
        medication: item.medication || "—",
        dosage: dosageText,
        date: item.actDate || "—",
      };
    });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedPetIndex(newValue);
    // Επαναφορά pagination όταν αλλάζουμε κατοικίδιο
    setCurrentPageEvents(1);
    setCurrentPageHealth(1);
  };

  // Κάνε scroll στην αρχή της σελίδας όταν φορτώνεται
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Φόρτωση δεδομένων χρήστη και κατοικίδιου
  useEffect(() => {
    const fetchUserAndPets = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3004/users');
        if (!response.ok) {
          throw new Error('HTTP error!');
        }
        const usersData = await response.json();
        
        const user = usersData.find(u => u.id.toString() === userId.toString());
        if (user) {
          console.log('Found user:', user.name);
          setUserData(user);
          const nextPets = user.pets || [];
          setPets(nextPets);
          
          // Βρίσκουμε το index του τρέχοντος κατοικίδιου
          if (petId && nextPets) {
            const petIndex = nextPets.findIndex(p => p.id.toString() === petId.toString());
            if (petIndex !== -1) {
              setSelectedPetIndex(petIndex);
              setValue(petIndex);
            }
          }

          if (nextPets.length > 0) {
            const eventsEntries = await Promise.all(
              nextPets.map(async (pet) => {
                const res = await fetch(
                  `http://localhost:3004/lifeEvents?petId=${pet.id}&ownerId=${userId}&_sort=date&_order=desc`
                );
                const data = res.ok ? await res.json() : [];
                return [String(pet.id), mapEvents(data)];
              })
            );
            setEventsByPet(Object.fromEntries(eventsEntries));

            const healthEntries = await Promise.all(
              nextPets.map(async (pet) => {
                const res = await fetch(
                  `http://localhost:3004/medicalActs?petId=${pet.id}&ownerId=${userId}&_sort=actDate&_order=desc`
                );
                const data = res.ok ? await res.json() : [];
                return [String(pet.id), mapHealth(data)];
              })
            );
            setHealthByPet(Object.fromEntries(healthEntries));

            const birthEntries = await Promise.all(
              nextPets.map(async (pet) => {
                if (pet.birthDate) {
                  return [String(pet.id), pet.birthDate];
                }
                if (!pet.microchip) {
                  return [String(pet.id), ""];
                }
                const res = await fetch(
                  `http://localhost:3004/petRegistrations?microchip=${pet.microchip}&_sort=updatedAt&_order=desc`
                );
                const data = res.ok ? await res.json() : [];
                return [String(pet.id), data?.[0]?.birthDate || ""];
              })
            );
            setBirthByPet(Object.fromEntries(birthEntries));
          }
        } else {
          console.error('User not found. Available users:', usersData.map(u => ({id: u.id, type: typeof u.id})));
          console.error('Looking for user id:', userId, 'Type:', typeof userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Σφάλμα φόρτωσης δεδομένων κατοικίδιου');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPets();
  }, [userId, petId]);

  return (
    <Box className="pet-health-book-container">
      <CssBaseline />
      
      {/* Sidebar Menu */}
      <Drawer
        className="pet-sidebar"
        variant="permanent"
        anchor="left"
      >
        
        {/* Κύριο μενού */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)} sx={{backgroundColor: '#D7D3CB'}}>
              <ListItemIcon>
                <PetsIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Τα Κατοικίδιά μου" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/find_vet`)}>
              <ListItemIcon>
                <SearchIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Εύρεση Κτηνίατρου" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/appointments`)}>
              <ListItemIcon>
                <CalendarMonthIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/lost_report`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Δήλωση Απώλειας" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/found_report`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Δήλωση Εύρεσης" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}/history_report`)}>
              <ListItemIcon>
                <HistoryIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Ιστορικό Δηλώσεων" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      {/* Κύριο περιεχόμενο */}
      <Box
        component="main"
        className="pet-main-content"
      > 
        <div className="owner-main-container">
          <Typography variant="h5" className="carousel-title">
            Τα Κατοικίδιά Μου
          </Typography>
          
          {loading ? (
            <Box className="loading-container">
              <Typography>Φόρτωση δεδομένων κατοικίδιου...</Typography>
            </Box>
          ) : pets.length === 0 ? (
            <Box className="no-pets-container">
              <Typography variant="h6" className="no-pets-title">
                Δεν βρέθηκαν κατοικίδια
              </Typography>
              <Typography className="no-pets-text">
                Ο χρήστης δεν έχει καταχωρημένα κατοικίδια.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              {/* Tabs Component */}
              <Box className="pet-tabs-container">
                <Tabs 
                  value={value} 
                  onChange={handleChange} 
                  aria-label="basic tabs example"
                  className="pet-tabs"
                >
                  {pets.map((pet, index) => (
                    <Tab 
                      key={pet.id} 
                      label={
                        <Typography className="pet-tab-label">
                          {pet.name}
                        </Typography>
                      } 
                      {...a11yProps(index)} 
                    />
                  ))}
                </Tabs>
              </Box>
              
              {/* Περιεχόμενο για κάθε καρτέλα */}
              {pets.map((pet, index) => (
                <CustomTabPanel key={pet.id} value={value} index={index}>
                  {getPetContent(
                    pet, 
                    currentPageEvents, 
                    setCurrentPageEvents, 
                    currentPageHealth, 
                    setCurrentPageHealth,
                    printRef,
                    eventsByPet[String(pet.id)] || [],
                    healthByPet[String(pet.id)] || [],
                    birthByPet[String(pet.id)] || pet.birthDate || ""
                  )}
                </CustomTabPanel>
              ))}
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
}
