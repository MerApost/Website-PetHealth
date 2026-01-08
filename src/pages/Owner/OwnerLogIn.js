import './OwnerLogIn.css';
import './../Main/MainPage.css'
import big_left_arrow from "./../../pics/big_left_arrow.png"

import { Box, Button, Typography, Paper, IconButton } from '@mui/material';

import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PetsIcon from '@mui/icons-material/Pets';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarHalfIcon from '@mui/icons-material/StarHalf';

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function OwnerLogIn() {
  const { id: userId } = useParams(); // Το userId από την URL
  const [notifications] = useState([
    { id: 1, text: "Κάποιος εντόπισε το κατοικίδιό σας - παρακαλώ ελέγξτε τις λεπτομέρειες", time: "10 λεπτά πριν" },
    { id: 2, text: "Νέα ενημέρωση για χαμένο σκύλο στην περιοχή σας", time: "1 ώρα πριν" },
    { id: 3, text: "Ενημέρωση προφίλ κατοικιδίου: Αναβάθμιση προφίλ ολοκληρώθηκε", time: "2 ώρες πριν" }
  ]);
  
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [pets, setPets] = useState([]); // Τα κατοικίδια του χρήστη
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  const navigate = useNavigate();
  
  const latestNotification = notifications.length > 0 ? notifications[0] : null;
  
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
        
        // Βρες τον χρήστη με το id από την URL
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
  
  const handleBellClick = () => {
    navigate('/notifications');
  };

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
    // Πλοήγηση στη σελίδα υγείας του κατοικιδίου
    navigate(`/pet/${pet.id}/health`, { state: { ownerId: userId } });
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
    // Αυτή είναι μια δοκιμαστική λογική
    // Στην πραγματικότητα θα έπρεπε να ελέγχεις τη βάση δεδομένων
    const appointments = [
      { petId: 1, date: "15/12/2025", time: "10:30" },
      { petId: 3, date: "20/12/2025", time: "14:00" }
    ];
    return appointments.find(app => app.petId === petId);
  };

  return (
    <div className="owner-main-container"> 
      {/* Κύριο container για το notification bar */}
      <Box className='notification_bar_position'>
        <Box className='notification_bar'>
          {/* Πλαίσιο με μήνυμα - μεγαλύτερο και πιο επεκτατικό */}
          {latestNotification && (
            <Paper elevation={0} className='message_box' onClick={() => navigate('/notifications')}>
              <Box className='message_box_position'>
                <Box className='message_content_position'>
                  <Typography variant="body1" className='message_content'>
                    {latestNotification.text}
                  </Typography>
                  
                  {/* Χρόνος δίπλα στο κείμενο */}
                  <Typography variant="caption" className='message_time'>
                    {latestNotification.time}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Bell button - μεγαλύτερο και πιο εμφανές */}
          <Button onClick={handleBellClick} className='bell_button'>
            <NotificationsIcon sx={{color: 'black', fontSize: { xs: 20, sm: 22, md: 35 } }}/>
            <Box className='notification_number'>
              {notifications.length}
            </Box>
          </Button>
        </Box>
      </Box>

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
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${itemsPerView}, 1fr)`,
                gap: '16px',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                alignSelf: 'center'
              }}
            >
              {visiblePets.map((pet) => {
                const appointment = hasScheduledAppointment(pet.id);
                
                return (
                  <Paper 
                    key={pet.id} 
                    className="carousel-item" 
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
                      sx={{
                        width: '120px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px',
                        flexShrink: 0,
                        border: '1px solid black',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      {pet.photo ? (
                        <img 
                          src={pet.photo} 
                          alt={pet.name} 
                          className="carousel-item-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />
                      ) : (
                        <Box 
                          className="carousel-item-placeholder"
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '12px',
                            border: '2px dashed #bdbdbd'
                          }}
                        >
                          <InsertPhotoIcon sx={{ fontSize: 48, color: '#9e9e9e' }} />
                        </Box>
                      )}
                    </Box>
                    
                    {/* Δεξιά πλευρά - Πληροφορίες */}
                    <Box 
                      className="carousel-item-content"
                      sx={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Πάνω μέρος: Όνομα, Ράτσα, Ηλικία */}
                      <Box className="carousel-item-info">
                        <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '8px', color: 'black', fontSize: '1.1rem' }}>
                          {pet.name}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ fontWeight: 400, marginBottom: '4px', color: 'black', fontSize: '0.8rem' }}>
                          {pet.breed}, {pet.age} {pet.age === "1" ? "έτους" : "ετών"}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                          {pet.type} • {pet.gender}
                        </Typography>
                      </Box>
                      
                      {/* Μεσαίο μέρος: Ραντεβού */}
                      <Box className="carousel-item__appointment-section">
                        {appointment ? (
                          <Paper 
                            sx={{
                              backgroundColor: 'white',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              marginBottom: '16px'
                            }}
                          >
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: 'black', fontSize: '0.85rem' }}>
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
            <Box className="carousel-dots">
              {Array.from({ length: Math.ceil(pets.length / itemsPerView) }).map((_, index) => (
                <Box
                  key={index}
                  className={`carousel-dot ${index === carouselIndex ? 'carousel-dot--active' : ''}`}
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
            Δεν έχετε προσθέσει ακόμα κατοικίδια
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: '500px', margin: '0 auto' }}>
            Προσθέστε το πρώτο σας κατοικίδιο για να εμφανίζεται εδώ.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/add-pet')}
            sx={{
              backgroundColor: '#1976d2',
              padding: '10px 24px',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Προσθέστε το πρώτο σας κατοικίδιο
          </Button>
        </Box>
      )}

      {/* Νέο πλαίσιο χαρακτηριστικών πλατφόρμας */}
      <div className="platform-features-frame">
        <span className="platform-features-title">
          Δες το βιβλιάριο υγείας του κατοικίδιού σου, εύκολα και γρήγορα!
        </span>
        <Box className='platform-features-container'>
          <Box className='platform-features-box'>
            <div className='platform-features-content'>
              <div className="platform-features-icon">
                <PetsIcon sx={{ fontSize: 40 }} />
              </div>
              <span className="platform-features-box-description">
                1. Επέλεξε το κατοικίδιο που θες.
              </span>
            </div>
          </Box>

          <Box className='platform-features-box'>
            <div className='platform-features-content'>
              <div className="platform-features-icon">
                <DescriptionIcon sx={{ fontSize: 40 }} />
              </div>
              <span className="platform-features-box-description">
                2. Πάτα πάνω στο κατοικίδιο για προβολή των στοιχείων και του βιβλ. υγείας.
              </span>
            </div>
          </Box>

          <Box className='platform-features-box'>
            <div className='platform-features-content'>
              <div className="platform-features-icon">
                <PrintIcon sx={{ fontSize: 40 }} />
              </div>
              <span className="platform-features-box-description">
                3. Δυνατότητα εκτύπωσης.
              </span>
            </div>
          </Box>
        </Box>
      </div>
      
      <Typography variant="h5" className="history-appointments-title">
        Ιστορικό / Διαχείριση των Ραντεβού μου
      </Typography>

      <Typography variant="h5" className="history-appointments-title">
        Πως να κλείσεις ραντεβού;
      </Typography>
      <Box className='quick-details'>
        <Box className='appointment-selections'>
          <div className='box-details-text vertical'>
            <SearchIcon sx={{ fontSize: 100 }} />
            <span className="platform-features-box-description">
              1. Εύρεση Κτηνίατρου
            </span>
          </div>
        </Box>

        <img src={big_left_arrow} className="appointment-arrow-pic" alt="Arrow"/>

        <Box className='appointment-selections'>
          <div className='box-details-text vertical'>
            <CalendarMonthIcon sx={{ fontSize: 100 }} />
            <span className="platform-features-box-description">
              2. Προγραμματισμός Ραντεβού
            </span>
          </div>
        </Box>

        <img src={big_left_arrow} className="appointment-arrow-pic" alt="Arrow"/>

        <Box className='appointment-selections'>
          <div className='box-details-text vertical'>
            <StarHalfIcon sx={{ fontSize: 100 }} />
            <span className="platform-features-box-description">
              3. Αξιολόγηση
            </span>
          </div>
        </Box>
      </Box>

      <Box className='quick-reports'>
        <Box className='selections'>
          <span className="box-details-title">
            Δήλωση Απώλειας  
          </span>
          <div className='box-details-text vertical'>
            <span className="citizen-details-text">
              Αναφέρετε το χαμένο κατοικίδιο.
            </span>
            <Box sx={{ display: 'flex', gap: '10px', width: '100%' }}>
              <Button variant="contained" onClick={() => navigate('/new-report')} className="report-buttons" sx={{ flex: 1 }}>
                Νέα Δήλωση
              </Button>
              <Button variant="contained" onClick={() => navigate('/new-report')} className="history-buttons" sx={{ flex: 1 }}>
                Ιστορικό
              </Button>
            </Box>
          </div>
        </Box>

        <Box className='selections'>
          <span className="box-details-title">
            Δήλωση Εύρεσης 
          </span>
          <div className='box-details-text vertical'>
            <span className="citizen-details-text">
              Αναφέρετε το κατοικίδιο που βρήκατε.
            </span>
            <Box sx={{ display: 'flex', gap: '10px', width: '100%' }}>
              <Button variant="contained" onClick={() => navigate('/new-report')} className="report-buttons" sx={{ flex: 1 }}>
                Νέα Δήλωση
              </Button>
              <Button variant="contained" onClick={() => navigate('/new-report')} className="history-buttons" sx={{ flex: 1 }}>
                Ιστορικό
              </Button>
            </Box>
          </div>
        </Box>

        <Box className='selections'>
          <span className="box-details-title">
            Εύρεση Κτηνίατρου   
          </span>
          <div className='box-details-text vertical'>
            <span className="citizen-details-text">
              Βρείτε τον κτηνίατρο που σας ταιριάζει, δείτε τις αξολογήσεις του.
            </span>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button variant="contained" onClick={() => navigate('/search')} className="history-buttons">
                Αναζήτηση
              </Button>
            </Box>
          </div>
        </Box>
      </Box>
    </div> 
  );
}