import './FindVet.css';
import * as React from 'react';
import { useLayoutEffect, useRef, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, CssBaseline, Typography, Rating, Divider, CircularProgress, Alert, Button, Tab, Tabs } from '@mui/material';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const drawerWidth = 270;

export default function FindVetViewProfileBio() {
  const location = useLocation();
  const hasScrolled = useRef(false);
  const { id: userId, vetid } = useParams();
  const navigate = useNavigate();
  const storedRole = (localStorage.getItem("role") || "").trim();
  const storedUserId = (localStorage.getItem("userId") || "").trim();
  const ownerId = userId || storedUserId;
  const showDrawer = storedRole === "owner" && ownerId;

  const [vetData, setVetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    hasScrolled.current = true;

    const timer1 = setTimeout(() => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }, 10);

    const timer2 = setTimeout(() => {
      if (window.scrollY !== 0) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 50);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      hasScrolled.current = false;
    };
  }, [location.pathname]);

  // Στο top level του component, προσθέστε αυτά τα states
const [reviewFilter, setReviewFilter] = React.useState(0);
const [reviews, setReviews] = useState([]);

const handleReviewFilterChange = (event, newValue) => {
    setReviewFilter(newValue);
};

useEffect(() => {
    const loadReviews = async () => {
        if (!vetid) return;
        try {
            const res = await fetch(`http://localhost:3004/reviews?vetId=${vetid}&_sort=createdAt&_order=desc`);
            const data = res.ok ? await res.json() : [];
            const mapped = (Array.isArray(data) ? data : []).map((r) => ({
                id: r.id,
                userName: r.ownerName || "Ανώνυμος",
                rating: Number(r.rating) || 0,
                date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("el-GR") : "—",
                comment: r.comment || "—",
            }));
            setReviews(mapped);
        } catch (e) {
            console.error(e);
            setReviews([]);
        }
    };
    loadReviews();
}, [vetid]);

// Φιλτράρισμα αξιολογήσεων βάσει του επιλεγμένου tab
const filteredReviews = React.useMemo(() => {
    if (!reviews.length) return [];
    
    switch(reviewFilter) {
        case 0: // Όλες
            return reviews;
        case 1: // Υψηλές (≥3.5)
            return reviews.filter(review => review.rating >= 3.5);
        case 2: // Χαμηλές (<3.5)
            return reviews.filter(review => review.rating < 3.5);
        default:
            return reviews;
    }
}, [reviews, reviewFilter]);

  const avgRating = React.useMemo(() => {
    if (!reviews.length) return 5;
    const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  // Συνάρτηση για μεταφορά σε σελίδα κτηνίατρου
  const handleArrangeMeeting = useCallback((vetId) => {
    if (!showDrawer) {
      navigate(`/find_vet/${vetId}/arrange_meeting`);
      return;
    }
    navigate(`/owner_main/${ownerId}/find_vet/${vetId}/arrange_meeting`);
  }, [navigate, ownerId, showDrawer]);
  
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchVetData = async () => {
      if (!vetid) {
        setError('Δεν βρέθηκε ID κτηνίατρου στο URL');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3004/users/${vetid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.role !== 'vet') {
          throw new Error('Ο χρήστης δεν είναι κτηνίατρος');
        }
        
        // Βοηθητική συνάρτηση για εξαγωγή ονόματος από services
        const extractServiceNames = (services) => {
          if (!services || !Array.isArray(services)) {
            return ['Εκτακτη επίσκεψη', 'Γενικός έλεγχος'];
          }
          
          // Αν τα services είναι strings, επιστροφή ως έχει
          if (services.length > 0 && typeof services[0] === 'string') {
            return services;
          }
          
          // Αν τα services είναι objects, εξαγωγή των ονομάτων
          if (services.length > 0 && typeof services[0] === 'object') {
            return services.map(service => service.name || 'Υπηρεσία');
          }
          
          return ['Εκτακτη επίσκεψη', 'Γενικός έλεγχος'];
        };

        // Εξαγωγή πληροφοριών για κάθε υπηρεσία
        const extractServiceDetails = (services) => {
          if (!services || !Array.isArray(services)) {
            return [];
          }
          
          return services.map(service => ({
            name: service.name || 'Υπηρεσία',
            duration: service.duration || 'Δεν καθορίζεται',
            price: service.price || 'Δεν καθορίζεται'
          }));
        };

        const formattedVetData = {
          id: data.id,
          name: `${data.name} ${data.surname}`,
          photo: data.photo || `https://via.placeholder.com/180x180?text=Vet+${data.id}`,
          specialty: data.specialty || 'Γενικός Κτηνίατρος',
          experience: data.experience || 5,
          studiesLevel: data.studiesLevel || 'Πληροφορίες σπουδών δεν διατίθενται',
          clinicAddress: data.clinicAddress || 'Διεύθυνση δεν διατίθεται',
          about: data.about || 'Χωρίς περιγραφή',
          rating: data.rating || 4.5,
          reviewsCount: data.reviewsCount || 0,
          phone: data.phone || '+30 210 XXXXXXX',
          email: data.email || 'email@example.com',
          licenseNumber: data.licenseNumber || 'Δεν διατίθεται',
          profession: data.profession || 'Κτηνίατρος',
          gender: data.gender || 'Άγνωστο',
          
          // Χρήση βοηθητικών συναρτήσεων
          services: extractServiceNames(data.services),
          serviceDetails: extractServiceDetails(data.services),
          languages: data.languages || ['Ελληνικά'],
          paymentMethods: data.paymentMethods || ['Μετρητά'],
          availability: data.availability || ['Δευτέρα-Παρασκευή 09:00-17:00']
        };
        
        console.log('Formatted Vet Data:', formattedVetData);
        setVetData(formattedVetData);
      } catch (err) {
        console.error('Error fetching vet data:', err);
        setError(`Σφάλμα φόρτωσης δεδομένων: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVetData();
  }, [vetid]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {showDrawer && (
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
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${ownerId}`)}>
                  <ListItemIcon>
                    <PetsIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Τα Κατοικίδιά μου" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/owner_main/${ownerId}/find_vet`)}
                  sx={{ backgroundColor: '#D7D3CB' }}
                >
                  <ListItemIcon>
                    <SearchIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Εύρεση Κτηνίατρου" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        )}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {showDrawer && (
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
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${ownerId}`)}>
                  <ListItemIcon>
                    <PetsIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Τα Κατοικίδιά μου" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/owner_main/${ownerId}/find_vet`)}
                  sx={{ backgroundColor: '#D7D3CB' }}
                >
                  <ListItemIcon>
                    <SearchIcon sx={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText primary="Εύρεση Κτηνίατρου" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        )}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Alert severity="error" sx={{ mb: 2, width: '80%' }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate(showDrawer ? `/owner_main/${ownerId}/find_vet` : "/find_vet")}
            sx={{ mt: 2 }}
          >
            Επιστροφή στη λίστα κτηνιάτρων
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      {showDrawer && (
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
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(`/owner_main/${ownerId}`)}>
                <ListItemIcon>
                  <PetsIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Τα Κατοικίδιά μου" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${ownerId}/find_vet`)}
                sx={{ backgroundColor: '#D7D3CB' }}
              >
                <ListItemIcon>
                  <SearchIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Εύρεση Κτηνίατρου" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${ownerId}/appointments`)}
              >
                <ListItemIcon>
                  <CalendarMonthIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${ownerId}/lost_report`)}
              >
                <ListItemIcon>
                  <DescriptionIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Δήλωση Απώλειας" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${ownerId}/found_report`)}
              >
                <ListItemIcon>
                  <DescriptionIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Δήλωση Εύρεσης" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${ownerId}/history_report`)}
              >
                <ListItemIcon>
                  <HistoryIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Ιστορικό Δηλώσεων" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <header className="FindVet-main-header">
          <Box sx={{ p: 3 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 3,
                height: '730px',
                alignItems: 'stretch',
                mt: 2,
                marginTop: '-20px',
                width: '1000px'
              }}
            >
              {/* Αριστερό κουτάκι */}
              <Box 
                sx={{ 
                  flex: '0 0 30%',
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: 2,
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Box 
                    sx={{ 
                        height: '300px',
                        width: '300px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5',
                        overflow: 'hidden'
                    }}
                    >
                    <Box
                        component="img"
                        src={vetData.photo}
                        alt={vetData.name}
                        sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',  
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        backgroundColor: '#f0f0f0'
                        }}
                        onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/400x250?text=Vet+${vetData.id}`;
                        }}
                    />
                    </Box>
                <Box 
                  sx={{ 
                    flex: 1,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                  }}
                >
                  <Box sx={{ mb: -1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: -1.0 }}>
                      {vetData.name}
                    </Typography>
                    <Typography variant="h7" sx={{ fontSize: '0.9rem' }}>
                      {vetData.specialty}
                    </Typography>
                    <Divider sx={{ my: 1.0, backgroundColor: '#221f1f', width: '75%', mx: 'auto' }} />
                    <Box sx={{ 
                        my: 2.0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexWrap: 'nowrap',
                        whiteSpace: 'nowrap'
                        }}>
                        <Rating
                            name="text-feedback"
                            value={avgRating}
                            readOnly
                            precision={0.5}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        <Box sx={{ ml: 1, fontSize: '1.0rem', whiteSpace: 'nowrap' }}>
                            {avgRating.toFixed(1)}
                        </Box>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                            color: '#6c757d', 
                            ml: 0.5,
                            whiteSpace: 'nowrap'
                            }}
                        >
                            ({reviews.length} αξιολογήσεις)
                        </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5, backgroundColor: 'black', width: '299px', mx: -3, height: '1.4px', opacity: 0.6 }} />
                  <Button
                    variant="contained"
                    onClick={() => handleArrangeMeeting(vetData.id)}
                    sx={{
                        backgroundColor: '#438fabe8',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#438fabe8',
                        },
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1.0rem',
                        py: 0.6,
                        px: 2,
                        borderRadius: '6px',
                        boxShadow: 'none',
                        width: '250px'
                    }}
                  >
                    <EditCalendarIcon sx={{ fontSize: 25, mr: 2.0, color: 'white' }} />
                    Κλείσε Ραντεβού!
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, marginTop: '15px' }}>
                    <PlaceIcon sx={{ fontSize: 25, mr: 1.5, color: '#67A3B8' }} />
                    <Typography variant="body2">
                      {vetData.clinicAddress}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ fontSize: 25, mr: 1.5, color: '#67A3B8' }} />
                    <Typography variant="body2">
                      {vetData.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ fontSize: 25, mr: 1.5, color: '#67A3B8' }} />
                    <Typography variant="body2">
                      {vetData.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {/* Δεξί κουτάκι */}
            <Box 
                sx={{ 
                    flex: '1',
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                    p: 3,
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {/* Τα tabs στο πάνω μέρος */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="vet profile tabs"
                        sx={{
                            '& .MuiTab-root': {
                                fontSize: '1rem',
                                fontWeight: 'medium',
                                textTransform: 'none',
                                minHeight: '48px',
                                color: 'black',
                                '&.Mui-selected': {
                                    color: 'black' // Ενεργό tab μαύρο
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#a56312',
                                height: '3px'
                            }
                        }}
                    >
                        <Tab label="Πληροφορίες" />
                        <Tab label="Υπηρεσίες" />
                        <Tab label="Αξιολογήσεις" />
                    </Tabs>
                </Box>
                
                {/* Κενό μεταξύ των box */}
                <Box sx={{ height: '24px' }} />
                
                {/* Περιεχόμενο ανάλογα με το επιλεγμένο tab */}
                <Box 
                    sx={{ 
                    flex: 1,
                    overflowY: 'auto',
                    p: 1
                    }}
                >
                    {value === 0 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#black' }}>
                            Γιατί είναι ο κατάλληλος/η για σένα:
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6, mb: 3 }}>
                            {vetData.about}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, mt:10 }}>
                            <SchoolIcon sx={{ mr: 2, color: '#5542c3', fontSize: 40, mt: 0.5 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography 
                                    variant="h6"
                                    sx={{ 
                                        fontWeight: 'bold', 
                                        color: 'black', 
                                        mb: 1,
                                        textDecoration: 'underline',
                                        textDecorationThickness: '2px', 
                                        textUnderlineOffset: '6px'
                                    }}
                                >
                                    Εκπαίδευση
                                </Typography>
                                
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'black',
                                        lineHeight: 1.6
                                    }}
                                >
                                    {vetData.studiesLevel}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, mt:10 }}>
                            <BusinessCenterIcon sx={{ mr: 2, color: '#5542c3', fontSize: 40, mt: 0.5 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography 
                                    variant="h6"
                                    sx={{ 
                                        fontWeight: 'bold', 
                                        color: 'black', 
                                        mb: 1,
                                        textDecoration: 'underline',
                                        textDecorationThickness: '2px', 
                                        textUnderlineOffset: '6px'
                                    }}
                                >
                                    Επαγγελματική Εμπειρία
                                </Typography>
                                
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'black',
                                        lineHeight: 1.6
                                    }}
                                >
                                    {vetData.experience} χρόνια εμπειρίας
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={() => handleArrangeMeeting(vetData.id)}
                            sx={{
                                backgroundColor: '#438fabe8',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#438fabe8',
                                },
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '1.0rem',
                                py: 0.6,
                                px: 2,
                                borderRadius: '6px',
                                boxShadow: 'none',
                                width: '250px',
                                mt:5,
                                ml: 'auto', // Προσθήκη αυτού
                                display: 'block' // Προσθήκη αυτού αν είναι απαραίτητο
                            }}
                        >
                            <EditCalendarIcon sx={{ fontSize: 25, mr: 2.0, color: 'white' }} />
                            Κλείσε Ραντεβού!
                        </Button>
                    </Box>
                    )}
                    
                    {value === 1 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
                            Διαθέσιμες Υπηρεσίες 
                        </Typography>
                        
                        {vetData.serviceDetails && vetData.serviceDetails.length > 0 ? (
                            <Box>
                                {vetData.serviceDetails.map((service, index) => (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            mb: 3, 
                                            p: 2, 
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0',
                                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                                            <Typography sx={{ fontSize: '1.0rem', fontWeight: 'bold', textDecoration: 'underline', textDecorationThickness: '2px', 
                                                                        textUnderlineOffset: '6px' }}>
                                                {service.name}
                                            </Typography>
                                            <Typography variant='h6' sx={{fontWeight: 'bold', fontSize: '1.5rem'}}>
                                                {service.price}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 3, ml: 0 }}>
                                            <Typography variant="body2">
                                                <strong>Διάρκεια:</strong> {service.duration}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <Button
                                    variant="contained"
                                    onClick={() => handleArrangeMeeting(vetData.id)}
                                    sx={{
                                        backgroundColor: '#438fabe8',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#438fabe8',
                                        },
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        fontSize: '1.0rem',
                                        py: 0.6,
                                        px: 2,
                                        borderRadius: '6px',
                                        boxShadow: 'none',
                                        width: '250px',
                                        mt:10,
                                        ml: 'auto', // Προσθήκη αυτού
                                        display: 'block' // Προσθήκη αυτού αν είναι απαραίτητο
                                    }}
                                >
                                    <EditCalendarIcon sx={{ fontSize: 25, mr: 2.0, color: 'white' }} />
                                    Κλείσε Ραντεβού!
                                </Button>
                            </Box>
                        ) : (
                            <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
                                Δεν υπάρχουν διαθέσιμες πληροφορίες για υπηρεσίες.
                            </Typography>
                        )}
                    </Box>
                    )}
                                        
                    {value === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
                                Αξιολογήσεις Πελατών
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#000000a1', mt: -3 }}>
                                Τι λένε οι ιδιοκτήτες κατοικιδίων για τον/την {vetData.name}.
                            </Typography>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', // Προσθήκη αυτού
                                alignItems: 'center', 
                                mt: -1, 
                                mb: 4 
                            }}>
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', // Αυτό ευθυγραμμίζει ήδη τα παιδιά στο κέντρο
                                    textAlign: 'center' // Προσθήκη για κεντροποίηση κειμένου
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 'bold', 
                                        fontSize: '2.5rem',
                                        mb: 1 // Προσθήκη margin bottom για χώρο μεταξύ rating και αστεριών
                                    }}>
                                        {avgRating.toFixed(1)}
                                    </Typography>
                                    
                                    <Rating 
                                        value={avgRating} 
                                        readOnly 
                                        precision={0.5} 
                                        sx={{ fontSize: '1.5rem', mb: 0.5 }} 
                                    />
                                    
                                    <Typography variant="body2" sx={{ color: 'black' }}>
                                        ({reviews.length} αξιολογήσεις)
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Προσθήκη tabs για φιλτράρισμα αξιολογήσεων */}
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                <Tabs 
                                    value={reviewFilter} 
                                    onChange={handleReviewFilterChange}
                                    sx={{
                                        '& .MuiTab-root': {
                                            fontSize: '0.9rem',
                                            fontWeight: 'medium',
                                            textTransform: 'none',
                                            minHeight: '40px',
                                            color: 'black',
                                            '&.Mui-selected': {
                                                color: 'black'
                                            }
                                        },
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: '#a56312',
                                            height: '2px'
                                        }
                                    }}
                                >
                                    <Tab label="Όλες οι Αξιολογήσεις" />
                                    <Tab label="Υψηλές" />
                                    <Tab label="Χαμηλές" />
                                </Tabs>
                            </Box>

                            {/* ΑΛΛΑΓΗ ΕΔΩ: reviews.length αντί για vetData.reviewsCount */}
                            {reviews.length === 0 ? (
                                <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                                    Δεν υπάρχουν αξιολογήσεις ακόμα για αυτόν τον κτηνίατρο.
                                </Typography>
                            ) : (
                                <Box>
                                    {filteredReviews.length === 0 ? (
                                        <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                                            Δεν υπάρχουν αξιολογήσεις για το επιλεγμένο φίλτρο.
                                        </Typography>
                                    ) : (
                                        filteredReviews.map((review, index) => (
                                            <Box 
                                                key={review.id || index} 
                                                sx={{ 
                                                    mb: 3, 
                                                    p: 3, 
                                                    borderRadius: 2,
                                                    border: '1px solid #e0e0e0',
                                                    backgroundColor: '#f9f9f9',
                                                    height:'90px'
                                                }}
                                            >
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 3, mb: 2, alignItems: 'start',mt:-2 }}>
                                                    {/* Αριστερή στήλη - Ονομα, Rating, Ημερομηνία */}
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: -1 }}>
                                                            {review.userName}
                                                        </Typography>
                                                        
                                                        <Box sx={{ mb: -1 }}>
                                                            <Rating value={review.rating} readOnly size="small" />
                                                        </Box>
                                                        
                                                        <Typography variant="caption" sx={{ color: '#666' }}>
                                                            {review.date}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    {/* Δεξιά στήλη - Σχόλιο */}
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: 'black', 
                                                                lineHeight: 1.6,
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            {review.comment}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                
                                            </Box>
                                        ))
                                    )}
                                </Box>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleArrangeMeeting(vetData.id)}
                                    sx={{
                                        backgroundColor: '#438fabe8',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#438fabe8',
                                        },
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        fontSize: '1.0rem',
                                        py: 0.6,
                                        px: 2,
                                        borderRadius: '6px',
                                        boxShadow: 'none',
                                        width: '250px'
                                    }}
                                >
                                    <EditCalendarIcon sx={{ fontSize: 25, mr: 2.0, color: 'white' }} />
                                    Κλείσε Ραντεβού!
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
              </Box>    
            </Box>
          </Box>
        </header>
      </Box>
    </Box>
  );
}
