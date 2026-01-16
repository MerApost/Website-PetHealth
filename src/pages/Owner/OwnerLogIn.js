import { Box, Drawer, CssBaseline, List, Typography, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Paper, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import './OwnerLogIn.css';

const drawerWidth = 270;

export default function OwnerLogIn() {
  const { id: userId } = useParams();
  
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // Χρησιμοποιείται τώρα
  
  const navigate = useNavigate();
  
  // Φόρτωση δεδομένων χρήστη και κατοικιδίων
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
        
        const user = usersData.find(u => u.id === userId);
        if (user) {
          setUserData(user);
          setPets(user.pets || []);
          console.log('Found user:', user.name, 'with pets:', user.pets?.length || 0);
        } else {
          console.error('User not found with id:', userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Σφάλμα φόρτωσης δεδομένων χρήστη');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPets();
  }, [userId]);

  // Αυτόματος υπολογισμός items ανά προβολή βάσει πλάτους οθόνης
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerView(1);
      } else if (width < 900) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const handleNext = () => {
    if (pets.length === 0) return;
    const maxIndex = Math.ceil(pets.length / itemsPerView) - 1;
    setCarouselIndex((prevIndex) => 
      prevIndex < maxIndex ? prevIndex + 1 : 0
    );
  }; 

  const handlePrev = () => {
    if (pets.length === 0) return;
    const maxIndex = Math.ceil(pets.length / itemsPerView) - 1;
    setCarouselIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : maxIndex
    );
  };

  const handleHealthClick = (pet) => {
    navigate(`./pet/${pet.id}/health_book`, { state: { ownerId: userId, ownerName: userData?.name } });
  };

  // Υπολογισμός ορατών κουτιών
  const totalItems = pets.length;
  const showArrows = totalItems > itemsPerView;
  const visiblePets = pets.slice(
    carouselIndex * itemsPerView,
    carouselIndex * itemsPerView + itemsPerView
  );
  
  // Πλασματικά προγραμματισμένα ραντεβού για δοκιμή
  const hasScheduledAppointment = (petId) => {
    const appointments = [
      { petId: 1, date: "15/12/2025", time: "10:30" },
      { petId: 3, date: "20/12/2025", time: "14:00" }
    ];
    return appointments.find(app => app.petId === petId);
  };

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
          {loading ? (
            <Box sx={{padding: '40px 20px', textAlign: 'center', color: '#666'}}>
              <Typography variant="h6">Φόρτωση κατοικιδίων...</Typography>
            </Box>
          ) : pets.length > 0 ? (
            <Box className="carousel-section">
              <Typography variant="h5" className="carousel-title">
                Τα Κατοικίδιά Μου ({pets.length})
              </Typography>
              
              <Box className="carousel-container">
                {/* Βέλος αριστερά */}
                {showArrows && (
                  <IconButton className="carousel-arrow carousel-arrow--left" onClick={handlePrev}>
                    <ChevronLeftIcon className="carousel-arrow__icon" />
                  </IconButton>
                )}
                
                <Box 
                  className="carousel-grid"
                >
                  {visiblePets.map((pet) => {
                    const appointment = hasScheduledAppointment(pet.id);
                    
                    return (
                      <Paper 
                        key={pet.id} 
                        elevation={3}
                        sx={{
                          height: '220px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '16px',
                          backgroundColor: 'white',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
                            backgroundColor: '#f8f9fa'
                          }
                        }}
                      >
                        {/* Αριστερή πλευρά - Εικόνα */}
                        <Box 
                          className="carousel-item-image-container"
                        >
                          {pet.photo ? (
                            <img 
                              src={pet.photo} 
                              alt={pet.name} 
                              className="carousel-item-image"
                            />
                          ) : (
                            <Box 
                              className="carousel-item-placeholder"
                            >
                              <InsertPhotoIcon sx={{ fontSize: 48, color: '#9e9e9e' }} />
                            </Box>
                          )}
                        </Box>
                        
                        {/* Δεξιά πλευρά - Πληροφορίες */}
                        <Box 
                          className="carousel-item-content"
                        >
                          {/* Πάνω μέρος: Όνομα, Ράτσα, Ηλικία */}
                          <Box className="carousel-item-info">
                            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '8px', color: 'black', fontSize: '1.1rem' }}>
                              {pet.name}
                            </Typography>
                            
                            <Typography variant="body1" sx={{ fontWeight: 400, marginBottom: '4px', color: 'black', fontSize: '0.8rem' }}>
                              {pet.breed}, {pet.age} {pet.age === "1" ? "έτους" : "ετών"}
                            </Typography>
                          </Box>
                          
                          {/* Μεσαίο μέρος: Ραντεβού */}
                          <Box className="carousel-item__appointment-section">
                            {appointment ? (
                              <Paper 
                                sx={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  marginBottom: '16px',
                                  backgroundColor: '#e8f4ff',
                                }}
                              >
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: '#1976d2', fontSize: '0.85rem' }}>
                                  Επόμενο ραντεβού
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', color: 'black' }}>
                                  {appointment.date} στις {appointment.time}
                                </Typography>
                              </Paper>
                            ) : (
                              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(0, 0, 0, 0.51)', fontStyle: 'italic', marginBottom: '16px' }}>
                                Δεν υπάρχει ραντεβού
                              </Typography>
                            )}
                          </Box>
                          
                          {/* Κουμπί Βιβλίου Υγείας */}
                          <Box>
                            <Button 
                              variant="contained" 
                              onClick={() => handleHealthClick(pet)} 
                              sx={{
                                backgroundColor: '#2e487839',
                                color: '#2E4878',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                padding: '6px 16px',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                width: '100%',
                                height: '36px',
                                marginTop: '-4px',
                                border: '1px solid #2E4878',
                                '&:hover': {
                                  backgroundColor: '#2e48785f'
                                }
                              }}
                            >
                              Βιβλ. Υγείας
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
                
                {/* Βέλος δεξιά */}
                {showArrows && (
                  <IconButton className="carousel-arrow carousel-arrow--right" onClick={handleNext}>
                    <ChevronRightIcon className="carousel-arrow__icon" />
                  </IconButton>
                )}
              </Box>
              
              {/* Δείκτες σελίδας */}
              {pets.length > itemsPerView && (
                <Box className="carousel-dots" sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  {Array.from({ length: Math.ceil(pets.length / itemsPerView) }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        margin: '0 4px',
                        backgroundColor: index === carouselIndex ? '#2E4878' : '#ccc',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: index === carouselIndex ? '#2E4878' : '#999'
                        }
                      }}
                      onClick={() => setCarouselIndex(index)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{padding: '40px 20px', textAlign: 'center', color: '#666'}}>
              <InsertPhotoIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Δεν έχουν προστεθεί ακόμα κατοικίδια.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: '500px', margin: '0 auto' }}>
                Τα κατοικίδιά σας θα εμφανίζονται εδώ.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate(`/owner/${userId}/add-pet`)}
                sx={{
                  backgroundColor: '#AD653A',
                  padding: '10px 24px',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#8c4d2e'
                  }
                }}
              >
                ΚΛΕΙΣΤΕ ΡΑΝΤΕΒΟΥ ΜΕ ΚΤΗΝΙΑΤΡΟ!
              </Button>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
}