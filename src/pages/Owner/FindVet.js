import './FindVet.css';
import { useLayoutEffect, useRef, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button,
  Card,
//   CardContent,
  CardMedia,
//   Chip
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from "@mui/icons-material/Place";
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import specialty from "../../pics/specialty.png"

import {Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';

// DatePicker imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { el } from 'date-fns/locale';

// ΠΡΟΣΘΗΚΗ: Εισαγωγή των menu components
import FiltersMenu from './FiltersMenu';
import LanguageMenu from './LanguageMenu';
import PaymentMenu from './PaymentMenu';
import ServicesMenu from './ServicesMenu';
import AvailabilityMenu from './AvailabilityMenu';
import ExperienceMenu from './ExperienceMenu';

import Athens_areas from './Athens_areas';
import VetSpecialties from './VetSpecialties';

const drawerWidth = 270;

export default function FindVet(){
    const location = useLocation();
    const hasScrolled = useRef(false);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const role = localStorage.getItem("role");
    const isOwnerLoggedIn = isLoggedIn && role === "owner";

    // State variables για την μπάρα αναζήτησης
    const [locationInput, setLocationInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [specialtyInput, setSpecialtyInput] = useState('');

    // State variables για τα menus
    const [speciesValue, setSpeciesValue] = useState('');
    const [speciesOpen, setSpeciesOpen] = useState(false);
    
    // Στοιχεία για φιλτράρισμα
    const [filters, setFilters] = useState({
        experience: {},
        availability: {},
        languages: {},
        payments: {},
        services: {},
        selectedExperience: [],
        selectedAvailability: [],
        selectedLanguages: [],
        selectedPayments: [],
        selectedServices: []
    });
    
    // ΝΕΑ STATE: Ξεχωριστά state για κάθε dropdown menu
    const [experience, setExperience] = useState('');
    const [experienceOpen, setExperienceOpen] = useState(false);
    const [availability, setAvailability] = useState('');
    const [availabilityOpen, setAvailabilityOpen] = useState(false);
    const [services, setServices] = useState('');
    const [servicesOpen, setServicesOpen] = useState(false);
    const [payments, setPayments] = useState('');
    const [paymentsOpen, setPaymentsOpen] = useState(false);
    const [languages, setLanguages] = useState('');
    const [languagesOpen, setLanguagesOpen] = useState(false);

    // State για κτηνιάτρους
    const [allVets, setAllVets] = useState([]);
    const [filteredVets, setFilteredVets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Συνάρτηση για φόρτωση κτηνιάτρων από τη βάση
    const fetchVets = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3004/users');
            if (!response.ok) {
                throw new Error('HTTP error!');
            }
            
            const users = await response.json();
            
            // Φιλτράρουμε μόνο τους κτηνιάτρους (role: "vet")
            const vets = users.filter(user => user.role === "vet");
            
            // Εμπλουτίζουμε τα δεδομένα αν χρειάζεται
            const enrichedVets = vets.map(vet => ({
                id: vet.id,
                name: `${vet.name} ${vet.surname}`,
                photo: vet.photo,
                specialty: vet.specialty,
                experience: vet.experience,
                clinicAddress: vet.clinicAddress,
                about: vet.about,
                services: vet.services,
                phone: vet.phone || '+30 6935448967',
                email: vet.email || 'vet.clinic@gmail.com',
                rating: vet.rating || 4.8,
                reviewsCount: vet.reviewsCount || 129,
                languages: vet.languages || ["Ελληνικά"],
                paymentMethods: vet.paymentMethods || ["Πληρωμή στο γραφείο"],
                availability: vet.availability || ["Καθημερινά"],
                species: vet.species || ["Σκύλος", "Γάτα"],
                gender: vet.gender || "Θήλυ",
                priceRange: vet.priceRange || "Μέτριο"
            }));
            
            setAllVets(enrichedVets);
            setFilteredVets(enrichedVets);
        } catch (error) {
            console.error('Error fetching vets:', error);
            alert('Σφάλμα φόρτωσης κτηνιάτρων');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Συνάρτηση για εφαρμογή όλων των φίλτρων
    const applyAllFilters = useCallback(() => {
        let filtered = [...allVets];

        // 1. Φίλτρα από search bar (Τοποθεσία)
        if (locationInput) {
            const locationString = typeof locationInput === 'string' 
                ? locationInput 
                : (locationInput?.label || locationInput || '');
            
            if (locationString) {
                filtered = filtered.filter(vet => {
                    const vetLocation = (vet.clinicAddress || '').toLowerCase();
                    const searchLocation = locationString.toLowerCase();
                    
                    return vetLocation.includes(searchLocation);
                });
            }
        }

        // 2. Φίλτρα από search bar (Ειδικότητα)
        if (specialtyInput) {
            const specialtyString = typeof specialtyInput === 'string' 
                ? specialtyInput 
                : (specialtyInput?.label || specialtyInput || '');
            
            if (specialtyString) {
                filtered = filtered.filter(vet => {
                    const vetSpecialty = (vet.specialty || '').toLowerCase();
                    const searchSpecialty = specialtyString.toLowerCase();
                    
                    return vetSpecialty.includes(searchSpecialty);
                });
            }
        }

        // 3. Φίλτρα από PopOverMenu (Όλα τα φίλτρα)
        if (filters.selectedExperience && filters.selectedExperience.length > 0) {
            filtered = filtered.filter(vet => {
                const vetExperience = vet.experience || '';
                return filters.selectedExperience.some(exp => {
                    if (exp === "Έως 10 έτη") {
                        return parseInt(vetExperience) <= 10;
                    } else if (exp === "Από 10 έτη και άνω") {
                        return parseInt(vetExperience) >= 10;
                    }
                    return false;
                });
            });
        }

        if (filters.selectedAvailability && filters.selectedAvailability.length > 0) {
            filtered = filtered.filter(vet => {
                const vetAvailability = vet.availability || [];
                return filters.selectedAvailability.some(avail => 
                    vetAvailability.includes(avail)
                );
            });
        }

        if (filters.selectedLanguages && filters.selectedLanguages.length > 0) {
            filtered = filtered.filter(vet => {
                const vetLanguages = vet.languages || [];
                return filters.selectedLanguages.some(lang => 
                    vetLanguages.includes(lang)
                );
            });
        }

        if (filters.selectedPayments && filters.selectedPayments.length > 0) {
            filtered = filtered.filter(vet => {
                const vetPayments = vet.paymentMethods || [];
                return filters.selectedPayments.some(payment => 
                    vetPayments.includes(payment)
                );
            });
        }

        if (filters.selectedServices && filters.selectedServices.length > 0) {
            filtered = filtered.filter(vet => {
                const vetServices = vet.services || [];
                const serviceNames = vetServices.map(s => s.name);
                return filters.selectedServices.some(service => 
                    serviceNames.includes(service)
                );
            });
        }

        // 4. Φίλτρα από επιμέρους dropdown menus
        if (experience) {
            filtered = filtered.filter(vet => {
                const vetExp = parseInt(vet.experience);
                if (experience === "Έως 10 έτη") {
                    return vetExp <= 10;
                } else if (experience === "Από 10 έτη και άνω") {
                    return vetExp >= 10;
                }
                return false;
            });
        }

        if (availability) {
            filtered = filtered.filter(vet => {
                const vetAvailability = vet.availability || [];
                return vetAvailability.includes(availability);
            });
        }

        if (services) {
            filtered = filtered.filter(vet => {
                const vetServices = vet.services || [];
                const serviceNames = vetServices.map(s => s.name);
                return serviceNames.includes(services);
            });
        }

        if (payments) {
            filtered = filtered.filter(vet => {
                const vetPayments = vet.paymentMethods || [];
                return vetPayments.includes(payments);
            });
        }

        if (languages) {
            filtered = filtered.filter(vet => {
                const vetLanguages = vet.languages || [];
                return vetLanguages.includes(languages);
            });
        }

        setFilteredVets(filtered);
    }, [
        allVets, 
        locationInput, 
        specialtyInput, 
        filters,
        experience,
        availability,
        services,
        payments,
        languages
    ]);

    // Συνάρτηση για handle search - ΜΟΝΟ όταν πατάει το κουμπί
    const handleSearch = useCallback(() => {
        applyAllFilters();
    }, [applyAllFilters]);

    // Συνάρτηση για reset φίλτρων
    const handleResetFilters = useCallback(() => {
        setLocationInput('');
        setDateInput('');
        setSpecialtyInput('');
        
        setSpeciesValue('');
        setSpeciesOpen(false);
        
        setExperience('');
        setExperienceOpen(false);
        setAvailability('');
        setAvailabilityOpen(false);
        setServices('');
        setServicesOpen(false);
        setPayments('');
        setPaymentsOpen(false);
        setLanguages('');
        setLanguagesOpen(false);
        
        setFilters({
            experience: {},
            availability: {},
            languages: {},
            payments: {},
            services: {},
            selectedExperience: [],
            selectedAvailability: [],
            selectedLanguages: [],
            selectedPayments: [],
            selectedServices: []
        });
        
        setFilteredVets(allVets);
    }, [allVets]);

    const ownerBase = isOwnerLoggedIn && userId ? `/owner_main/${userId}` : null;

    // Συνάρτηση για μεταφορά σε σελίδα κτηνίατρου
    const handleViewVetProfile = useCallback((vetId) => {
        if (!ownerBase) {
            navigate(`/find_vet/${vetId}`);
            return;
        }
        navigate(`${ownerBase}/find_vet/${vetId}`);
    }, [navigate, ownerBase]);

    const handleArrangeMeeting = useCallback((vetId) => {
        if (!ownerBase) {
            navigate("/login");
            return;
        }
        navigate(`${ownerBase}/find_vet/${vetId}/arrange_meeting`);
    }, [navigate, ownerBase]);

    // ΧΡΗΣΗ useLayoutEffect - τρέχει ΠΡΙΝ από το render
    useLayoutEffect(() => {
        // Αμέσως scroll στην αρχή
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
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

    // Φόρτωση δεδομένων όταν φορτώνει το component
    useEffect(() => {
        fetchVets();
    }, [fetchVets]);

    // Αυτόματο φιλτράρισμα ΜΟΝΟ όταν αλλάζουν τα dropdown menus (όχι από την μπάρα αναζήτησης)
    useEffect(() => {
        // Έλεγχος αν έχει γίνει αλλαγή σε κάποιο από τα dropdown menus
        const hasDropdownFilters = experience || availability || services || payments || languages;
        
        if (hasDropdownFilters) {
            applyAllFilters();
        }
    }, [experience, availability, services, payments, languages, applyAllFilters]);

    // Αυτόματο φιλτράρισμα όταν αλλάζουν τα filters από το PopOverMenu
    useEffect(() => {
        const hasPopoverFilters = 
            (filters.selectedExperience && filters.selectedExperience.length > 0) ||
            (filters.selectedAvailability && filters.selectedAvailability.length > 0) ||
            (filters.selectedLanguages && filters.selectedLanguages.length > 0) ||
            (filters.selectedPayments && filters.selectedPayments.length > 0) ||
            (filters.selectedServices && filters.selectedServices.length > 0);
        
        if (hasPopoverFilters) {
            applyAllFilters();
        }
    }, [filters, applyAllFilters]);

    // Συνάρτηση για ομαδοποίηση κτηνιάτρων σε γραμμές των 3
    const groupVetsIntoRows = useCallback((vets) => {
        const rows = [];
        for (let i = 0; i < vets.length; i += 3) {
            rows.push(vets.slice(i, i + 3));
        }
        return rows;
    }, []);

    const vetRows = groupVetsIntoRows(filteredVets);

    return(
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            {/* Sidebar Menu */}
            {isOwnerLoggedIn && (
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
                    <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                        <ListItemIcon>
                            <PetsIcon sx={{color: 'black'}}/>
                        </ListItemIcon>
                        <ListItemText primary="Τα Κατοικίδιά μου" />
                    </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate(`/owner_main/${userId}/find_vet`)} sx={{backgroundColor: '#D7D3CB'}}>
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
            )}
            
            {/* Κύριο περιεχόμενο */}
            <Box
                component="main"
                sx={{ 
                    flexGrow: 1, 
                    bgcolor: 'background.default',
                    minHeight: '100vh'
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={el}>
                    <header className="FindVet-main-header">
                        
                        {/* SEARCH BAR SECTION */}
                        <Box className="search-bar-section">
                            <Typography variant="h5" className="search-title">
                                Βρείτε Κτηνίατρο
                            </Typography>
                            
                            <Box className="find_vet">
                                {/* Τοποθεσία */}
                                <Box className="input_group">
                                    <PlaceIcon className="icons" />
                                    <Autocomplete
                                        disablePortal
                                        id="location-input"
                                        options={Athens_areas}
                                        value={locationInput}
                                        onChange={(event, newValue) => {
                                            setLocationInput(newValue || '');
                                        }}
                                        inputValue={locationInput}
                                        onInputChange={(event, newInputValue) => {
                                            setLocationInput(newInputValue);
                                        }}
                                        sx={{ 
                                            minWidth: '220px',
                                            '& .MuiInput-root': {
                                                paddingLeft: '8px'
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                label="Επιλογή Τοποθεσίας" 
                                                variant="standard"
                                                className="input_field"
                                            />
                                        )}
                                    />
                                </Box>

                                {/* Ημερομηνία */}
                                <Box className="input_group">
                                    <CalendarMonthIcon className="icons" />
                                    <TextField
                                        type="date"
                                        label="Επιλογή Ημερομηνίας"
                                        variant="standard"
                                        className="input_field"
                                        value={dateInput}
                                        onChange={(e) => setDateInput(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{ minWidth: '200px' }}
                                    />
                                </Box>

                                {/* Ειδικότητα */}
                                <Box className="input_group">
                                    <img src={specialty} className="pics" alt="Specialty"/>
                                    <Autocomplete
                                        disablePortal
                                        id="specialty-input"
                                        options={VetSpecialties}
                                        value={specialtyInput}
                                        onChange={(event, newValue) => {
                                            setSpecialtyInput(newValue || '');
                                        }}
                                        inputValue={specialtyInput}
                                        onInputChange={(event, newInputValue) => {
                                            setSpecialtyInput(newInputValue);
                                        }}
                                        sx={{ 
                                            minWidth: '300px',
                                            '& .MuiInput-root': {
                                                paddingLeft: '8px'
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                label="Ειδικότητα" 
                                                variant="standard"
                                                className="input_field"
                                            />
                                        )}
                                    />
                                </Box>

                                <Button className='search-button' onClick={handleSearch}>
                                    <SearchIcon className="search_icon" />
                                    Αναζήτηση
                                </Button>
                            </Box>

                            {/* ΠΡΟΣΘΗΚΗ: Επιπλέον φίλτρα με τα menus */}
                            <Box sx={{
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'flex-start', 
                                marginTop: '20px',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '0 20px'
                            }}>
                                <Box sx={{display: 'flex', gap: '10px'}}>
                                    <Button className='menu-bar-button' variant="outlined">
                                        <FiltersMenu 
                                            value={speciesValue}
                                            onChange={setSpeciesValue}
                                            open={speciesOpen}
                                            setOpen={setSpeciesOpen}
                                            filters={filters}
                                            setFilters={setFilters}
                                        />
                                    </Button>

                                    {/* Εμπειρία */}
                                    <ExperienceMenu
                                        value={experience}
                                        onChange={setExperience}
                                        open={experienceOpen}
                                        setOpen={setExperienceOpen}
                                    />

                                    {/* Διαθεσιμότητα */}
                                    <AvailabilityMenu 
                                        value={availability}
                                        onChange={setAvailability}
                                        open={availabilityOpen}
                                        setOpen={setAvailabilityOpen}
                                    />

                                    {/* Υπηρεσίες */}
                                    <ServicesMenu 
                                        value={services}
                                        onChange={setServices}
                                        open={servicesOpen}
                                        setOpen={setServicesOpen}
                                    />

                                    {/* Τρόποι Πληρωμής */}
                                    <PaymentMenu 
                                        value={payments}
                                        onChange={setPayments}
                                        open={paymentsOpen}
                                        setOpen={setPaymentsOpen}
                                    />

                                    {/* Γλώσσες */}
                                    <LanguageMenu 
                                        value={languages}
                                        onChange={setLanguages}
                                        open={languagesOpen}
                                        setOpen={setLanguagesOpen}
                                    />
                                </Box>
                                
                                <Button 
                                    variant="contained"
                                    onClick={handleResetFilters}
                                    sx={{
                                        height: '40px',
                                        minWidth: '90px',
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#fa3838ff',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#d32f2f',
                                            boxShadow: '0px 2px 4px rgba(0,0,0,0.25)'
                                        },
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        marginLeft: 'auto',
                                        boxShadow: 'none',
                                        '&:active': {
                                            transform: 'translateY(1px)'
                                        }
                                    }}
                                >
                                    Καθαρισμός Φίλτρων
                                </Button>
                            </Box>
                        </Box>

                        {/* Λίστα Κτηνιάτρων */}
                        <Box sx={{ mt: 4, px: 4 }}>
                            {isLoading ? (
                                <Typography variant="h6" align="center">
                                    Φόρτωση κτηνιάτρων...
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                        {filteredVets.length} Κτηνίατροι βρέθηκαν
                                    </Typography>
                                    
                                    {vetRows.map((row, rowIndex) => (
                                        <Box key={rowIndex} sx={{ 
                                            display: 'flex', 
                                            gap: 3, 
                                            mb: 3,
                                            flexWrap: 'wrap'
                                        }}>
                                            {row.map((vet) => (
                                                <Card key={vet.id} sx={{ 
                                                    flex: '1 1 30%', 
                                                    minWidth: 900,
                                                    maxWidth: 900,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    height: 280,
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    overflow: 'hidden',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                                        transform: 'translateY(-4px)',
                                                        transition: 'all 0.3s ease'
                                                    }
                                                }}>
                                                    {/* ΑΡΙΣΤΕΡΑ: ΦΩΤΟΓΡΑΦΙΑ */}
                                                    <Box sx={{ 
                                                        width: '23%',
                                                        // minWidth: '35%',
                                                        height: '280px', // Ίδιο με το ύψος του card
                                                        position: 'relative',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: '#f5f5f5' // Προαιρετικό background αν η εικόνα είναι μικρότερη
                                                    }}>
                                                        <CardMedia
                                                            component="img"
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain', // Αλλαγή από 'cover' σε 'contain' για να φαίνεται ολόκληρη
                                                                maxHeight: '100%',
                                                                maxWidth: '100%'
                                                            }}
                                                            image={vet.photo}
                                                            alt={vet.name}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/250x280?text=Vet+Photo";
                                                            }}
                                                        />
                                                    </Box>
                                                    
                                                    {/* ΔΕΞΙΑ: ΠΛΗΡΟΦΟΡΙΕΣ */}
                                                    <Box sx={{ 
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        p: 2.5,
                                                        position: 'relative'
                                                    }}>
                                                        {/* ΒΑΘΜΟΛΟΓΙΑ - ΠΑΝΩ ΔΕΞΙΑ ΓΩΝΙΑ */}
                                                        <Box sx={{ 
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            backgroundColor: '#f8f9fa', 
                                                            p: '4px 8px', 
                                                            borderRadius: '16px',
                                                            border: '1px solid #e9ecef',
                                                            zIndex: 2
                                                        }}>
                                                            <StarIcon sx={{ color: '#FFD700', fontSize: 18, mr: 0.5 }} />
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                                {vet.rating?.toFixed(1) || '4.8'}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ ml: 0.5, color: '#6c757d' }}>
                                                                ({vet.reviewsCount || 129})
                                                            </Typography>
                                                        </Box>
                                                        
                                                        {/* ΟΝΟΜΑΤΕΠΩΝΥΜΟ */}
                                                        <Typography variant="h6" sx={{ 
                                                            fontWeight: 'bold', 
                                                            fontSize: '1.1rem',
                                                            mb: 1.5,
                                                            pr: 6 // Για να μην καλύπτει τη βαθμολογία
                                                        }}>
                                                            {vet.name}
                                                        </Typography>
                                                        
                                                        {/* ΕΙΔΙΚΟΤΗΤΑ */}
                                                        <Typography variant="body2" color="text.secondary" sx={{ 
                                                            mb: 2,
                                                            fontSize: '0.9rem',
                                                            fontStyle: 'italic'
                                                        }}>
                                                            {vet.specialty || 'Γενικός Κτηνίατρος'}
                                                        </Typography>
                                                        
                                                        {/* ΠΕΡΙΟΧΗ */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                            <PlaceIcon sx={{ fontSize: 16, mr: 1.5, color: '#67A3B8', flexShrink: 0 }} />
                                                            <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                                                                {vet.clinicAddress || 'Χωρίς διεύθυνση'}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        {/* ΤΗΛΕΦΩΝΟ */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                            <PhoneIcon sx={{ fontSize: 16, mr: 1.5, color: '#67A3B8', flexShrink: 0 }} />
                                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                                {vet.phone}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        {/* EMAIL */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <EmailIcon sx={{ fontSize: 16, mr: 1.5, color: '#67A3B8', flexShrink: 0 }} />
                                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                                {vet.email}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        {/* ΚΟΥΜΠΙΑ - ΚΑΤΩ */}
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            gap: 5, 
                                                            mt: 'auto',
                                                            justifyContent: 'flex-start'
                                                        }}>
                                                            <Button
                                                                variant="contained"
                                                                onClick={() => handleViewVetProfile(vet.id)}
                                                                sx={{
                                                                    backgroundColor: '#67a3b8e8',
                                                                    color: '#000000',
                                                                    '&:hover': {
                                                                        backgroundColor: '#bbdefb',
                                                                    },
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'none',
                                                                    fontSize: '0.8rem',
                                                                    py: 0.6,
                                                                    px: 2,
                                                                    borderRadius: '6px',
                                                                    boxShadow: 'none',
                                                                    minWidth: '120px'
                                                                }}
                                                            >
                                                                Προβολή Προφίλ
                                                            </Button>
                                                            
                                                            <Button
                                                                variant="contained"
                                                                onClick={() => handleArrangeMeeting(vet.id)}
                                                                sx={{
                                                                    backgroundColor: '#4caf50',
                                                                    color: 'white',
                                                                    '&:hover': {
                                                                        backgroundColor: '#388e3c',
                                                                    },
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'none',
                                                                    fontSize: '0.8rem',
                                                                    py: 0.6,
                                                                    px: 2,
                                                                    borderRadius: '6px',
                                                                    boxShadow: 'none',
                                                                    minWidth: '120px'
                                                                }}
                                                            >
                                                                Κλείσε Ραντεβού
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            ))}
                                        </Box>
                                    ))}
                                    
                                    {filteredVets.length === 0 && allVets.length > 0 && (
                                        <Box sx={{
                                            textAlign: 'center',
                                            padding: '40px',
                                            color: '#666',
                                            fontSize: '18px'
                                        }}>
                                            Δεν βρέθηκαν κτηνίατροι για τα κριτήρια αναζήτησής σας.
                                        </Box>
                                    )}
                                    
                                    {allVets.length === 0 && !isLoading && (
                                        <Box sx={{
                                            textAlign: 'center',
                                            padding: '40px',
                                            color: '#666',
                                            fontSize: '18px'
                                        }}>
                                            Δεν βρέθηκαν διαθέσιμοι κτηνίατροι.
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    </header>   
                </LocalizationProvider>
            </Box>
        </Box>
    );
}
