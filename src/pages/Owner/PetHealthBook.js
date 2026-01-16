import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Tabs, Tab, Pagination, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PrintIcon from '@mui/icons-material/Print'; // Προσθήκη εικονιδίου εκτύπωσης
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react'; // Προσθήκη useRef

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
const getPetContent = (pet, currentPageEvents, setCurrentPageEvents, currentPageHealth, setCurrentPageHealth, printRef, eventsData, healthData) => {
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

  // Συνάρτηση για εκτύπωση - Εμφανίζει ΟΛΑ τα δεδομένα (όχι μόνο της τρέχουσας σελίδας)
  const handlePrint = () => {
    const printContent = printRef.current;
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
            .print-note {
              font-style: italic;
              color: #666;
              margin-top: 10px;
              font-size: 11px;
              text-align: center;
              margin-bottom: 15px;
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
      sx={{ 
        m: 3,
        p: 4,
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: 'relative'
      }}
    >
      {/* Κουμπί εκτύπωσης - πάνω δεξιά */}
      <Box sx={{ 
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1
      }}>
        <Button 
          variant="contained"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          sx={{ 
            backgroundColor: '#2e7d32', // Πράσινο χρώμα
            color: 'white',
            '&:hover': {
              backgroundColor: '#1b5e20' // Σκούρο πράσινο για hover
            },
            boxShadow: 2,
            borderRadius: 2,
            padding: '8px 16px',
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1rem'
          }}
          title="Εκτύπωση πλήρους έκθεσης"
        >
          Εκτύπωση
        </Button>
      </Box>
      
      {/* Πρώτο μικρό box - Φωτογραφία και πληροφορίες κατοικίδιου */}
      <Box 
        sx={{ 
          p: 3,
          bgcolor: '#f0f0f0',
          borderRadius: 2,
          boxShadow: 1,
          minHeight: 200,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3
        }}
      >
        {/* Φωτογραφία - αριστερά */}
        <Box 
          sx={{
            width: 200,
            height: 250,
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1.5px solid black'
          }}
        >
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
            <InsertPhotoIcon sx={{ fontSize: 60, color: '#9e9e9e' }} />
          )}
        </Box>
        
        {/* Πληροφορίες - δεξιά */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
            Στοιχεία Κατοικιδίου
          </Typography>
          
          {/* Δίστηλη διάταξη με Grid */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 3
          }}>
            
            {/* Πρώτη στήλη - στοίχιση αριστερά */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                  <strong>Όνομα:</strong> {pet.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                  <strong>Είδος:</strong> {pet.type || 'Άγνωστο'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                  <strong>Ράτσα:</strong> {pet.breed || 'Άγνωστη'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                  <strong>Χρώμα:</strong> {pet.color || 'Άγνωστο'}
                </Typography>
              </Box>
            </Box>
            
            {/* Δεύτερη στήλη - στοίχιση αριστερά */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              {pet.microchip && (
                <Box>
                  <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                    <strong>Αριθμός Microchip:</strong> {pet.microchip}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                  <strong>Φύλο:</strong> {pet.gender || 'Άγνωστο'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                  <strong>Ηλικία:</strong> {pet.age || 'Άγνωστη'} {pet.age === "1" ? "έτους" : "ετών"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Δεύτερο μικρό box - Συμβάντα Ζωής */}
      <Box 
        sx={{ 
          p: 3,
          bgcolor: '#f0f0f0',
          borderRadius: 2,
          boxShadow: 1,
          minHeight: 120
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
          Συμβάντα Ζωής Κατοικιδίου
        </Typography>
        
        {/* Πίνακας Συμβάντων */}
        <Box sx={{ overflowX: 'auto', display: 'flex', justifyContent:'center', alignItems:'center' }}>
          <Box 
            sx={{ 
              maxWidth: '600px',
              border: '1px solid #ddd',
              borderRadius: 1,
              overflow: 'hidden',
              mb: 2
            }}
          >
            {/* Κεφαλίδα πίνακα */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px',
                bgcolor: '#bbb9b9',
                color: 'black',
                fontWeight: 'bold'
              }}
            >
              <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                A/A
              </Box>
              <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                Γεγονός
              </Box>
              <Box sx={{ p: 1.5 }}>
                Ημ/νία
              </Box>
            </Box>
            
            {/* Σώμα πίνακα - Χρησιμοποιώντας τα δεδομένα με pagination */}
            <Box>
              {currentEvents.map((item, index) => (
                <Box 
                  key={item.id}
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px',
                    borderBottom: index < currentEvents.length - 1 ? '1px solid #ddd' : 'none',
                    '&:hover': {
                      bgcolor: '#f8f9fa'
                    }
                  }}
                >
                  <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                    {(currentPageEvents - 1) * 5 + index + 1}
                  </Box>
                  <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                    {item.event}
                  </Box>
                  <Box sx={{ p: 1.5 }}>
                    {item.date}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        {/* Pagination controls για Συμβάντα */}
        {totalEventPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
      <Box 
        sx={{ 
          p: 3,
          bgcolor: '#f0f0f0',
          borderRadius: 2,
          boxShadow: 1,
          minHeight: 120
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
          Βιβλιάριο Υγείας
        </Typography>
        
        {/* Πίνακας Υγείας */}
        <Box sx={{ overflowX: 'auto', display: 'flex', justifyContent:'center', alignItems:'center' }}>
          <Box 
            sx={{ 
              maxWidth: '1050px',
              border: '1px solid #ddd',
              borderRadius: 1,
              overflow: 'hidden',
              mb: 2
            }}
          >
            {/* Κεφαλίδα πίνακα */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: '60px repeat(4, 1fr)',
                bgcolor: '#bbb9b9',
                color: 'black',
                fontWeight: 'bold'
              }}
            >
              <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                A/A
              </Box>
              <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                Ιατρικές Πράξεις
              </Box>
              <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                Φαρμακευτική Αγωγή 
              </Box>
              <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                Δοσολογία & Συχνότητα
              </Box>
              <Box sx={{ p: 1.5 }}>
                Ημ/νία
              </Box>
            </Box>
            
            {/* Σώμα πίνακα - Χρησιμοποιώντας τα δεδομένα με pagination */}
            <Box>
              {currentHealth.map((item, index) => (
                <Box 
                  key={item.id}
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: '60px repeat(4, 1fr)',
                    borderBottom: index < currentHealth.length - 1 ? '1px solid #ddd' : 'none',
                    '&:hover': {
                      bgcolor: '#f8f9fa'
                    }
                  }}
                >
                  <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                    {(currentPageHealth - 1) * 5 + index + 1}
                  </Box>
                  <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                    {item.procedure}
                  </Box>
                  <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                    {item.medication}
                  </Box>
                  <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                    {item.dosage}
                  </Box>
                  <Box sx={{ p: 1.5 }}>
                    {item.date}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        {/* Pagination controls για Βιβλιάριο Υγείας */}
        {totalHealthPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
      <Box 
        sx={{ 
          p: 3,
          bgcolor: '#f0f0f0',
          borderRadius: 2,
          boxShadow: 1,
          minHeight: 120
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
          Οδηγίες
        </Typography>
        <Box sx={{ ml: 2 }}>
          {[
            "Να δίνεται το φάρμακο μετά το φαγητό για να αποφεύγεται δυσφορία στο στομάχι.",
            "Να παρατηρείται το κατοικίδιο για τυχόν αλλεργικές αντιδράσεις τις πρώτες 24 ώρες.",
            "Να διατηρείται ο χώρος του κατοικίδιου καθαρός και στεγνός κατά τη διάρκεια της ανάρρωσης.",
            "Να αποφεύγονται έντονα σπορ και μακριές βόλτες για τις επόμενες 48 ώρες.",
            "Επικοινωνήστε με τον κτηνίατρο σε περίπτωση έντονου πόνου ή πυρετού."
          ].map((instruction, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2 }}>
              <Typography sx={{ mr: 2, fontWeight: 'bold', minWidth: '24px' }}>
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
  
  // State για τα tabs
  const [value, setValue] = React.useState(0);
  
  // State για pagination - ξεχωριστά για κάθε κατοικίδιο
  const [currentPageEvents, setCurrentPageEvents] = useState(1);
  const [currentPageHealth, setCurrentPageHealth] = useState(1);
  
  // Ref για το περιεχόμενο που θα εκτυπωθεί
  const printRef = useRef(null);
  
  // Δεδομένα για τους πίνακες (τώρα στο main component)
  const eventsData = [
    { id: 1, event: "Ετήσιος εμβολιασμός", date: "15/03/2024" },
    { id: 2, event: "Καθαρισμός δοντιών", date: "20/02/2024" },
    { id: 3, event: "Επέμβαση στειρώσεως", date: "10/01/2024" },
    { id: 4, event: "Έλεγχος παρασίτων", date: "05/12/2023" },
    { id: 5, event: "Πρώτη επισκέψη κτηνίατρου", date: "20/10/2023" },
    { id: 6, event: "Εμβολιασμός λύσσας", date: "10/09/2023" },
    { id: 7, event: "Έλεγχος βάρους", date: "05/08/2023" },
    { id: 8, event: "Αφαίρεση κοντιλοματώδους", date: "15/07/2023" },
    { id: 9, event: "Ρουτίνα ελέγχου", date: "20/06/2023" },
    { id: 10, event: "Ετήσιος εμβολιασμός", date: "15/05/2023" },
    { id: 11, event: "Έλεγχος δέρματος", date: "10/04/2023" },
    { id: 12, event: "Διόρθωση προσθίου", date: "01/03/2023" },
  ];

  const healthData = [
    { id: 1, procedure: "Ετήσιος εμβολιασμός", medication: "Parvovirus vaccine", dosage: "1 δόση", date: "15/03/2024" },
    { id: 2, procedure: "Καθαρισμός δοντιών", medication: "Antibiotic", dosage: "2 φορές ημερησίως για 7 ημέρες", date: "20/02/2024" },
    { id: 3, procedure: "Επέμβαση στειρώσεως", medication: "Pain medication", dosage: "1 φορά ημερησίως για 5 ημέρες", date: "10/01/2024" },
    { id: 4, procedure: "Έλεγχος παρασίτων", medication: "Flea treatment", dosage: "Μηνιαία εφαρμογή", date: "05/12/2023" },
    { id: 5, procedure: "Πρώτη επισκέψη κτηνίατρου", medication: "Vitamin supplements", dosage: "Καθημερινά", date: "20/10/2023" },
    { id: 6, procedure: "Εμβολιασμός λύσσας", medication: "Rabies vaccine", dosage: "1 δόση", date: "10/09/2023" },
    { id: 7, procedure: "Αντιμετώπιση αλλεργίας", medication: "Antihistamine", dosage: "1 φορά ημερησίως για 3 ημέρες", date: "05/08/2023" },
    { id: 8, procedure: "Χειρουργική επέμβαση", medication: "Painkiller", dosage: "2 φορές ημερησίως για 10 ημέρες", date: "15/07/2023" },
    { id: 9, procedure: "Ρουτίνα ελέγχου", medication: "-", dosage: "-", date: "20/06/2023" },
    { id: 10, procedure: "Εμβολιασμός", medication: "Combination vaccine", dosage: "1 δόση", date: "15/05/2023" },
    { id: 11, procedure: "Αντιμετώπιση μόλυνσης", medication: "Antibiotic", dosage: "3 φορές ημερησίως για 14 ημέρες", date: "01/04/2023" },
    { id: 12, procedure: "Έλεγχος όρασης", medication: "Eye drops", dosage: "2 φορές ημερησίως για 5 ημέρες", date: "15/03/2023" },
  ];

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
          setPets(user.pets || []);
          
          // Βρίσκουμε το index του τρέχοντος κατοικίδιου
          if (petId && user.pets) {
            const petIndex = user.pets.findIndex(p => p.id.toString() === petId.toString());
            if (petIndex !== -1) {
              setSelectedPetIndex(petIndex);
              setValue(petIndex);
            }
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Sidebar Menu */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
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
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      > 
        <div className="owner-main-container">
          <Typography variant="h5" className="carousel-title" sx={{marginTop: '50px', marginLeft: '30px'}}>
            Τα Κατοικίδιά Μου
          </Typography>
          
          {loading ? (
            <Box sx={{ 
              m: 3,
              p: 4,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: 3,
              textAlign: 'center'
            }}>
              <Typography>Φόρτωση δεδομένων κατοικίδιου...</Typography>
            </Box>
          ) : pets.length === 0 ? (
            <Box sx={{ 
              m: 3,
              p: 4,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: 3,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Δεν βρέθηκαν κατοικίδια
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Ο χρήστης δεν έχει καταχωρημένα κατοικίδια.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              {/* Tabs Component */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs 
                  value={value} 
                  onChange={handleChange} 
                  aria-label="basic tabs example"
                  sx={{ 
                    ml: 3,
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#a56312',
                      height: 3,
                    }
                  }}
                >
                  {pets.map((pet, index) => (
                    <Tab 
                      key={pet.id} 
                      label={
                        <Typography 
                          sx={{ 
                            fontWeight: 'bold', 
                            color: 'black',
                            fontSize: '1.3rem',
                            textTransform: 'capitalize'
                          }}
                        >
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
                    eventsData,
                    healthData
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