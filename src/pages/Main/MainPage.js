import "./MainPage.css";
import dog_main_page from "./../../pics/dog_main_page.png";
import owner_main from "./../../pics/owner_main.png"
import vet_main from "./../../pics/vet_main.png"
import citizen_main from "./../../pics/citizen_main.png"
import big_left_arrow from "./../../pics/big_left_arrow.png"
import search_icon from "./../../pics/search_icon.png"
import heart_icon from "./../../pics/heart_icon.png"
import location_icon from "./../../pics/location_icon.png"
import search_location from "./../../pics/search_location.png"
import calendar_time from "./../../pics/calendar_time.png"
import health_file from "./../../pics/health_file.png"
import hasan from "./../../pics/hasan.png"
import frixos from "./../../pics/frixos.png"
import frank from "./../../pics/frank.png"

import Athens_areas from './../Owner/Athens_areas';
import Pet_Types from './../Lost_Pets/Data/Pet_Types';
import PetSearchBar from './../Lost_Pets/PetSearchBar'; // ΠΡΟΣΘΗΚΗ

import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import {
  Box,
  Button
} from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef, useState, useCallback } from 'react'; // ΠΡΟΣΘΗΚΗ useState, useCallback

export default function MainPage(){
  const location = useLocation();
  const hasScrolled = useRef(false);
  
  // ΠΡΟΣΘΗΚΗ state variables για τα φίλτρα
  const [petTypeFilter, setPetTypeFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  
  const navigate = useNavigate();
  
  // ΠΡΟΣΘΗΚΗ handler για το search
  const handleSearch = useCallback(() => {
    console.log('Search clicked from MainPage:', { petTypeFilter, locationFilter });
    navigateToLostPetsWithFilters();
  }, [petTypeFilter, locationFilter]);
  
  // ΠΡΟΣΘΗΚΗ Νέα συνάρτηση για navigation με φίλτρα
  const navigateToLostPetsWithFilters = useCallback(() => {
    console.log('Navigating to lost pets with filters...');
    
    // Δημιουργία query parameters αν υπάρχουν φίλτρα
    const params = new URLSearchParams();
    if (petTypeFilter) {
      const petTypeValue = typeof petTypeFilter === 'string' 
        ? petTypeFilter 
        : petTypeFilter.label || petTypeFilter;
      params.append('type', petTypeValue);
    }
    if (locationFilter) {
      const locationValue = typeof locationFilter === 'string'
        ? locationFilter
        : locationFilter.label || locationFilter;
      params.append('location', locationValue);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/lost_pets?${queryString}` : '/lost_pets';
    
    window.scrollTo(0, 0);
    navigate(url);
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);
  }, [petTypeFilter, locationFilter, navigate]);
  
  // ΠΡΟΣΘΗΚΗ useLayoutEffect για scroll στην αρχή
  useLayoutEffect(() => {
    console.log('MainPage: Location changed', location.pathname);
    
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    hasScrolled.current = true;
    
    const timer1 = setTimeout(() => {
      if (window.scrollY !== 0) {
        console.log('First scroll failed, trying again...');
        window.scrollTo(0, 0);
      }
    }, 10);
    
    const timer2 = setTimeout(() => {
      if (window.scrollY !== 0) {
        console.log('Second scroll failed, using documentElement...');
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
  
  // Βελτιωμένη συνάρτηση navigation
  const navigateToOwner = () => {
    console.log('Navigating to owner...');
    
    window.scrollTo(0, 0);
    navigate('/owner');
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);
  };

  const navigateToVet = () => {
    console.log('Navigating to vet...');
    
    window.scrollTo(0, 0);
    navigate('/vet');
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);
  };

  const navigateToLostPets = () => {
    console.log('Navigating to lost pets...');
    
    window.scrollTo(0, 0);
    navigate('/lost_pets');
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);
  };
  

  return (
    <header className="App-header">
      <img src={dog_main_page} className="Dog" alt="Main Page" />
      <p className="app-descr">Εθνική Πλατφόρμα Κατοικιδίων</p>
      <span className="descr-text">
        Η πιο ολοκληρωμένη πλατφόρμα για τη διαχείριση της υγείας των κατοικιδίων σας,
        την ευρεση ειδικευμένων κτηνιάτρων και την επανένωση με χαμένα ζώα.
      </span>

      {/* ΑΦΑΙΡΕΣΗ παλιού search section και ΠΡΟΣΘΗΚΗ του PetSearchBar */}
      <span style={{ display: 'block', marginTop: '40px', fontSize: '24px'}}>
        Αναζήτηση Απολεσθέντων Κατοικιδίων
      </span>
      
      {/* Χρήση του PetSearchBar */}
      <PetSearchBar
        petTypes={Pet_Types}
        locationAreas={Athens_areas}
        petTypeFilter={petTypeFilter}
        locationFilter={locationFilter}
        onPetTypeChange={setPetTypeFilter}
        onLocationChange={setLocationFilter}
        onSearch={handleSearch}
        petTypeLabel="Εισάγετε Είδος Κατοικιδίου"
        locationLabel="Εισάγετε Τοποθεσία Εύρεσης"
        searchButtonText="Αναζήτηση"
        sx={{
          width: '100%',
          maxWidth: '800px',
          margin: '20px auto'
        }}
      />

      <Box className='quick-details'>
        {/* Αριστερό κουτάκι */}
        <Box className='selections'>
          <span className="box-details-title">
            Ιδιοκτήτης/τρια  
          </span>
          <div className='box-details-text vertical'>
            <img 
              src={owner_main} 
              className="box-details-pics" 
              alt="Owner Main Pic"
              onClick={navigateToOwner}
              style={{ cursor: 'pointer' }}
            />
            <span className="selection-text with-bullet">
              Διαχειριστείτε τα στοιχεία του κατοικιδίου σας
            </span>
            <span className="selection-text with-bullet">
              Παρακολουθίστε το ιατρικό ιστορικό και το βιβλιάριο υγείας 
            </span>
            <span className="selection-text with-bullet">
              Αναζητήσετε και κλείσετε ραντεβού με κτηνιάτρους 
            </span>
            <span className="selection-text with-bullet">
              Αξιολογήσετε τους επαγγελματίες κτηνιάτρους 
            </span>
            <span className="selection-text with-bullet">
              Δηλώσετε απώλεια ή εύρεση κατοικιδίου 
            </span>
          </div>
        </Box>

        {/* Κεντρικό κουτάκι */}
        <Box className='selections'>
          <span className="box-details-title">
            Κτηνίατρος  
          </span>
          <div className='box-details-text vertical'>
            <img 
              src={vet_main} 
              className="box-details-pics" 
              alt="Vet Main Pic"
              onClick={navigateToVet}
              style={{ cursor: 'pointer' }}
            />
            <span className="selection-text with-bullet">
              Καταγραφή ταυτότητας κατοικιδίων
            </span>
            <span className="selection-text with-bullet">
              Καταγραφή ιατρικών πράξεων και εμβλιασμών 
            </span>
            <span className="selection-text with-bullet">
              Διαχείριση διαθεσιμότητας και ραντεβού 
            </span>
            <span className="selection-text with-bullet">
              Προβολή αξιολογήσεων 
            </span>
          </div>
        </Box>

        {/* Δεξί κουτάκι */}
        <Box className='selections'>
          <span className="box-details-title">
            Πολίτης  
          </span>
          <div className='box-details-text vertical'>
            <img 
              src={citizen_main} 
              className="box-details-pics" 
              alt="Citizen Main Pic"
              onClick={navigateToLostPets}
              style={{ cursor: 'pointer' }}
            />
            <span className="selection-text with-bullet">
              Αναζήτηση χαμένων κατοικιδίων
            </span>
            <span className="selection-text with-bullet">
              Δήλωση εύρεσης κατοικιδίου 
            </span>
            <span className="selection-text with-bullet">
              Βοήθεια στην επανένωση οικογενειών 
            </span>
            <span className="selection-text with-bullet">
              Εύκολη πρόσβαση χωρίς ταυτοποίηση 
            </span>
            <span className="selection-text with-bullet">
              Κοινωνική συνεισφορά 
            </span>
          </div>
        </Box>
      </Box>

      <span style={{display: 'block', marginTop: '60px', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', width: '100%'}}>
        Βοηθήστε στην επανένωση των χαμένων κατοικιδίων με τις οικογένειές τους
      </span>
      <Box className='quick-details'>
        {/* Αριστερό κουτάκι */}
        <Box className='selections'>
          <span className="box-details-title">
            1. Αναζήτηση Χαμένων Κατοικιδίων  
          </span>
          <div className='box-details-text vertical'>
            <img 
              src={search_icon} 
              className="citizen-details-pics" 
              alt="Search Pic"
              onClick={navigateToLostPets}
              style={{ cursor: 'pointer' }}
            />
            <span className="citizen-details-text">
              Αναζητήστε τα αναφερόμενα χαμένα κατοικίδια στη περιοχή σας με βάση την τοποθεσία, τον τύπο και την ώρα αναφοράς.
            </span>
          </div>
        </Box>

        <img src={big_left_arrow} className="arrow-pic" alt="Arrow"/>

        {/* Κεντρικό κουτάκι */}
        <Box className='selections'>
          <span className="box-details-title">
            2. Δήλωση Εύρεσης Κατοικιδίου  
          </span>
          <div className='box-details-text vertical'>
            <img 
              src={location_icon} 
              className="citizen-details-pics" 
              alt="Location Pic"
              onClick={navigateToLostPets}
              style={{ cursor: 'pointer' }}
            />
            <span className="citizen-details-text">
              Βρήκατε κάποιο κατοικίδιο; Δηλώστε την εύρεσή του!
            </span>
          </div>
        </Box>

        <img src={big_left_arrow} className="arrow-pic" alt="Arrow"/>

        {/* Δεξί κουτάκι */}
        <Box className='selections'>
          <span className="box-details-title">
            3. Επανένωση Οικογενειών  
          </span>
          <div className='box-details-text vertical'>
            <img 
              src={heart_icon} 
              className="citizen-details-pics" 
              alt="Heart Pic"
              onClick={navigateToLostPets}
              style={{ cursor: 'pointer' }}
            />
            <span className="citizen-details-text">
              Βοηθήστε τα κατοικίδια να συνδεθούν ξανά με τους ιδιοκτήτες τους!
            </span>
          </div>
        </Box>
      </Box>

      <div className="frame">
        <span style={{display: 'block', marginTop: '1px', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', width: '100%', color: 'black'}}>
          Χαρακτηριστικά Πλατφόρμας
        </span>
        <Box className='quick-details'>
          {/* Αριστερό κουτάκι */}
          <Box className='frame-boxes'>
            <div className='box-details-text vertical'>
              <img src={calendar_time} className="frame-boxes-imgs" alt="Calendar Time Pic"/>
              <span style={{display: 'block', marginTop: '1px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', width: '100%', color: 'black'}}>
                Εύκολος προγραμματισμός!
              </span>
              <span style={{display: 'block', fontSize: '15px', textAlign: 'center', width: '100%', color: 'black'}}>
                Κλείστε ραντεβού με κτηνίατρους με βάση τη διαθεσιμότητα και την τοποθεσία.
              </span>
            </div>
          </Box>

          {/* Κεντρικό κουτάκι */}
          <Box className='frame-boxes'>
            <div className='box-details-text vertical'>
              <img src={search_location} className="frame-boxes-imgs" alt="Search Location Pic"/>
              <span style={{display: 'block', marginTop: '1px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', width: '100%', color: 'black'}}>
                Αρχεία Υγείας!
              </span>
              <span style={{display: 'block', fontSize: '15px', textAlign: 'center', width: '100%', color: 'black'}}>
                Πλήρες ιατρικό ιστορικό και αρχεία εμβολιασμού σε ένα μέρος.
              </span>
            </div>
          </Box>

          {/* Δεξί κουτάκι */}
          <Box className='frame-boxes'>
            <div className='box-details-text vertical'>
              <img src={health_file} className="frame-boxes-imgs" alt="Health File Pic"/>
              <span style={{display: 'block', marginTop: '1px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', width: '100%', color: 'black'}}>
                Εύρεση Χαμένου Κατοικιδίου!
              </span>
              <span style={{display: 'block', fontSize: '15px', textAlign: 'center', width: '100%', color: 'black'}}>
                Δημόσια ανάρτηση για να βοηθήσει στην επανένωση των χαμένων κατοικιδίων με τους ιδιοκτήτες τους.
              </span>
            </div>
          </Box>
        </Box>
      </div>

      <span style={{display: 'block', marginTop: '1px', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', width: '100%', color: 'black'}}>
        Μήπως τα είδατε;
      </span>
      <Box className='quick-details'>
          {/* Αριστερό κουτάκι */}
          <Box className='selections'>
            <div className='box-details-text vertical'>
              <img src={hasan} className="box-details-pics" alt="Hasan Pic"/>
              <span style={{display: 'block', marginTop: '-30px', fontSize: '25px', fontWeight: 'bold', textAlign: 'left', width: '100%', color: 'black'}}>
                Χασάν
              </span>
              <span style={{display: 'block', marginTop: '-28px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                Beagle, Αρσενικό
              </span>
              <span style={{display: 'block', marginTop: '28px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                <PlaceIcon sx={{color: '#67A3B8', width: 20, height: 20, margin: 0, display: 'inline-flex', alignItems: 'center'}} />
                Αμπελόκηποι, Αθήνα
              </span>
              <span style={{display: 'block', marginTop: '3px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                <AccessTimeIcon sx={{color: '#67A3B8', width: 20, height: 18, margin: 0, display: 'inline-flex', alignItems: 'center'}} />
                Πριν 8 ημέρες
              </span>
            </div>
          </Box>

          {/* Κεντρικό κουτάκι */}
          <Box className='selections'>
            <div className='box-details-text vertical'>
              <img src={frixos} className="box-details-pics" alt="Frixos Pic"/>
              <span style={{display: 'block', marginTop: '-30px', fontSize: '25px', fontWeight: 'bold', textAlign: 'left', width: '100%', color: 'black'}}>
                Φρίξος
              </span>
              <span style={{display: 'block', marginTop: '-28px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                Maine Coon, Αρσενικό
              </span>
              <span style={{display: 'block', marginTop: '28px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                <PlaceIcon sx={{color: '#67A3B8', width: 20, height: 20, margin: 0, display: 'inline-flex', alignItems: 'center'}} />
                Ψυχικό, Αθήνα
              </span>
              <span style={{display: 'block', marginTop: '3px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                <AccessTimeIcon sx={{color: '#67A3B8', width: 20, height: 18, margin: 0, display: 'inline-flex', alignItems: 'center'}} />
                Πριν 2 ημέρες
              </span>
            </div>
          </Box>

          {/* Δεξί κουτάκι */}
          <Box className='selections'>
            <div className='box-details-text vertical'>
              <img src={frank} className="box-details-pics" alt="Frank Pic"/>
              <span style={{display: 'block', marginTop: '-30px', fontSize: '25px', fontWeight: 'bold', textAlign: 'left', width: '100%', color: 'black'}}>
                Φρανκ
              </span>
              <span style={{display: 'block', marginTop: '-28px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                Chameleon, Αρσενικό
              </span>
              <span style={{display: 'block', marginTop: '28px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                <PlaceIcon sx={{color: '#67A3B8', width: 20, height: 20, margin: 0, display: 'inline-flex', alignItems: 'center'}} />
                Κηφισιά, Αθήνα
              </span>
              <span style={{display: 'block', marginTop: '3px', fontSize: '15px', textAlign: 'left', width: '100%', color: 'black'}}>
                <AccessTimeIcon sx={{color: '#67A3B8', width: 20, height: 18, margin: 0, display: 'inline-flex', alignItems: 'center'}} />
                Πριν 5 ημέρες
              </span>
            </div>
          </Box>
        </Box>
        <Button className='lost-pet-button'>
          <span onClick={navigateToLostPets}
                style={{display: 'block', marginTop: '3px', fontSize: '20px', textAlign: 'left', width: '100%', color: 'white', cursor: 'pointer'}}>
            Δείτε όλα τα απολεσθέντα κατοικίδια
          </span>
        </Button>
    </header>
  );
}