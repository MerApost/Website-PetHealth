import { Box, Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const drawerWidth = 270;

export default function PetHealthBook() {
  const { id: userId, petid: petId } = useParams(); // petid με μικρό d όπως στο Route
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // Κάνε scroll στην αρχή της σελίδας όταν φορτώνεται
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Φόρτωση δεδομένων χρήστη και κατοικίδιου
  useEffect(() => {
    const fetchUserAndPet = async () => {
      if (!userId || !petId) return;
      
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3004/users');
        if (!response.ok) {
          throw new Error('HTTP error!');
        }
        const usersData = await response.json();
        
        console.log('Searching for user with id:', userId);
        console.log('Looking for pet with id:', petId);
        
        // Βρίσκουμε τον χρήστη - σύγκριση ως string
        const user = usersData.find(u => u.id.toString() === userId.toString());
        if (user) {
          console.log('Found user:', user.name);
          setUserData(user);
          
          // Βρίσκουμε το κατοικίδιο - σύγκριση ως string για ασφάλεια
          const pet = user.pets?.find(p => p.id.toString() === petId.toString());
          if (pet) {
            console.log('Found pet:', pet.name);
            setPetData(pet);
          } else {
            console.error('Pet not found. Available pets:', user.pets);
            console.error('Looking for pet id:', petId, 'Type:', typeof petId);
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

    fetchUserAndPet();
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
            <ListItemButton onClick={() => navigate(`./find_vet`)}>
              <ListItemIcon>
                <SearchIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Εύρεση Κτηνίατρου" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./appointments`)}>
              <ListItemIcon>
                <CalendarMonthIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./lost_report`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Δήλωση Απώλειας" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./found_report`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Δήλωση Εύρεσης" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./history_report`)}>
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
          ) : !petData ? (
            <Box sx={{ 
              m: 3,
              p: 4,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: 3,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Το κατοικίδιο δεν βρέθηκε
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Δεν βρέθηκε κατοικίδιο με ID: {petId} για τον χρήστη με ID: {userId}
              </Typography>
            </Box>
          ) : (
            <Box 
              sx={{ 
                m: 3,
                p: 4,
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
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
                  {petData.photo ? (
                    <img 
                      src={petData.photo} 
                      alt={petData.name}
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
                          <strong>Όνομα:</strong> {petData.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                          <strong>Είδος:</strong> {petData.type || 'Άγνωστο'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                          <strong>Ράτσα:</strong> {petData.breed || 'Άγνωστη'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                          <strong>Χρώμα:</strong> {petData.color || 'Άγνωστο'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Δεύτερη στήλη - στοίχιση αριστερά */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                      {petData.microchip && (
                        <Box>
                          <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                            <strong>Αριθμός Microchip:</strong> {petData.microchip}
                          </Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                          <strong>Φύλο:</strong> {petData.gender || 'Άγνωστο'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ mb: 0.5, textAlign: 'left' }}>
                          <strong>Ηλικία:</strong> {petData.age || 'Άγνωστη'} {petData.age === "1" ? "έτους" : "ετών"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {/* Δεύτερο μικρό box */}
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
                <Box sx={{ overflowX: 'auto' }}>
                    <Box 
                        sx={{ 
                            minWidth: 400,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            overflow: 'hidden'
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
                        
                        {/* Σώμα πίνακα - Παράδειγμα δεδομένων */}
                        <Box>
                            {/* Γραμμή 1 */}
                            <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 120px',
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                bgcolor: '#f8f9fa'
                                }
                            }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                    1
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    Ετήσιος εμβολιασμός
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    15/03/2024
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 2 */}
                            <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 120px',
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                bgcolor: '#f8f9fa'
                                }
                            }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 3 */}
                            <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 120px',
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                bgcolor: '#f8f9fa'
                                }
                            }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 4 */}
                            <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 120px',
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                bgcolor: '#f8f9fa'
                                }
                            }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 5 */}
                            <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 120px',
                                '&:hover': {
                                bgcolor: '#f8f9fa'
                                }
                            }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
              
              {/* Τρίτο μικρό box */}
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
                
                {/* Πίνακας Συμβάντων */}
                <Box sx={{ overflowX: 'auto' }}>
                    <Box 
                        sx={{ 
                            maxWidth: 900,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            overflow: 'hidden'
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
                            <Box sx={{ p: 1.5,borderRight: '1px solid #ddd' }}>
                                Φαρμακευτική Αγωγή 
                            </Box>
                            <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                Δοσολογία & Συχνότητα
                            </Box>
                            <Box sx={{ p: 1.5 }}>
                                Ημ/νία
                            </Box>
                        </Box>
                        
                        {/* Σώμα πίνακα - Παράδειγμα δεδομένων */}
                        <Box>
                            {/* Γραμμή 1 */}
                            <Box 
                                sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px repeat(4, 1fr)', // 5 στήλες
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                    bgcolor: '#f8f9fa'
                                }
                                }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                    1
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    Ετήσιος εμβολιασμός
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    aaaaaaa
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                    bbbbbbbbbb
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    15/03/2024
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 2 */}
                            <Box 
                                sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px repeat(4, 1fr)',
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                    bgcolor: '#f8f9fa'
                                }
                                }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 3 */}
                            <Box 
                                sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px repeat(4, 1fr)',
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                    bgcolor: '#f8f9fa'
                                }
                                }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 4 */}
                            <Box 
                                sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px repeat(4, 1fr)',
                                borderBottom: '1px solid #ddd',
                                '&:hover': {
                                    bgcolor: '#f8f9fa'
                                }
                                }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                
                                </Box>
                            </Box>
                            
                            {/* Γραμμή 5 */}
                            <Box 
                                sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '60px repeat(4, 1fr)',
                                '&:hover': {
                                    bgcolor: '#f8f9fa'
                                }
                                }}
                            >
                                <Box sx={{ p: 1.5, textAlign: 'center', borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5, borderRight: '1px solid #ddd' }}>
                                
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

              {/* Τέταρτο μικρό box */}
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
                <Box sx={{ ml: 2 }}>    {/*Κανονικά τα παίρνει από τη βάση */}
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
          )}
        </div>
      </Box>
    </Box>
  );
}