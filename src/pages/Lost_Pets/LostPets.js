import "./LostPets.css";
import Athens_areas from './../Owner/Athens_areas';
import Pet_Types from './Data/Pet_Types';
import LongMenu from './../../components/LongMenu';
import BreedMenu from './BreedMenu'; 
import GenderMenu from './GenderMenu';
import PetSearchBar from './PetSearchBar';

import maximos from './../../pics/maximos.png'
import fiona from './../../pics/fiona.png'
import frixos from './../../pics/frixos.png'
import melomakarono from './../../pics/melomakarono.png'
import hasan from './../../pics/hasan.png'
import loukoumi from './../../pics/loukoumi.png'

import {
  Box,
  Button,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

// Χάρτης φωτογραφιών για αντιστοίχιση
const petPhotos = {
  "maximos": maximos,
  "fiona": fiona,
  "frixos": frixos,
  "melomakarono": melomakarono,
  "hasan": hasan,
  "loukoumi": loukoumi
};

export default function LostPets(){
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasScrolled = useRef(false);

  const [breed, setBreed] = useState('');
  const [open, setOpen] = useState(false);
  
  const [gender, setGender] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  
  const [lostPets, setLostPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filters, setFilters] = useState({
    species: {},
    gender: {},
    breeds: {},
    selectedSpecies: [],
    selectedGenders: [],
    selectedBreeds: []
  });
  
  const [petTypeFilter, setPetTypeFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  
  // Συνάρτηση για φιλτράρισμα τοποθεσίας
  const filterByLocation = useCallback((pets, locationFilter) => {
    if (!locationFilter) return pets;
    
    // Παίρνουμε το string από το locationFilter
    const locationString = typeof locationFilter === 'string' 
      ? locationFilter 
      : (locationFilter?.label || locationFilter || '');
    
    if (!locationString || !locationString.trim()) return pets;
    
    console.log('Filtering by location:', locationString);
    
    return pets.filter(pet => {
      if (!pet.location) return false;
      
      const petLocation = pet.location.toLowerCase().trim();
      const searchLocation = locationString.toLowerCase().trim();
      
      // 1. Ακριβής αντιστοιχία
      if (petLocation === searchLocation) {
        return true;
      }
      
      // 2. Αν το pet.location περιέχει ", Αθήνα"
      if (petLocation.includes(', αθήνα')) {
        const cleanPetLocation = petLocation.replace(', αθήνα', '').trim();
        if (cleanPetLocation === searchLocation) {
          return true;
        }
      }
      
      // 3. Αν το searchLocation είναι μέρος του pet.location
      if (petLocation.includes(searchLocation)) {
        return true;
      }
      
      // 4. Αν το pet.location είναι μέρος του searchLocation
      if (searchLocation.includes(petLocation)) {
        return true;
      }
      
      return false;
    });
  }, []);
  
  // Κοινή συνάρτηση για φιλτράρισμα
  const applyAllFilters = useCallback(({
    currentFilters = filters,
    currentPetType = petTypeFilter,
    currentLocation = locationFilter,
    currentBreed = breed,
    currentGender = gender
  } = {}) => {
    console.log('=== APPLYING ALL FILTERS ===');
    console.log('Active filters:');
    console.log('- Pet type:', currentPetType);
    console.log('- Location:', currentLocation);
    console.log('- Breed:', currentBreed);
    console.log('- Gender:', currentGender);
    console.log('- Popover filters:', currentFilters);
    console.log('- URL params:', searchParams.toString());
    
    let filtered = lostPets;
    console.log('Starting with', filtered.length, 'pets');
    
    // Εμφάνιση όλων των κατοικιδίων για debugging
    console.log('All pets for debugging:', lostPets.map(p => ({
      name: p.name,
      type: p.type,
      breed: p.breed,
      gender: p.gender,
      location: p.location
    })));
    
    // 1. Φίλτρα από popover (ΕΙΔΗ)
    if (currentFilters.selectedSpecies && currentFilters.selectedSpecies.length > 0) {
      filtered = filtered.filter(pet => {
        const petType = pet.type || '';
        return currentFilters.selectedSpecies.includes(petType);
      });
      console.log('After popover species filter:', filtered.length);
    }
    
    // 2. Φίλτρα από popover (ΦΥΛΑ)
    if (currentFilters.selectedGenders && currentFilters.selectedGenders.length > 0) {
      filtered = filtered.filter(pet => {
        const petGender = pet.gender || '';
        return currentFilters.selectedGenders.includes(petGender);
      });
      console.log('After popover gender filter:', filtered.length);
    }
    
    // 3. Φίλτρα από popover (ΡΑΤΣΕΣ)
    if (currentFilters.selectedBreeds && currentFilters.selectedBreeds.length > 0) {
      filtered = filtered.filter(pet => {
        const petBreed = pet.breed || '';
        return currentFilters.selectedBreeds.includes(petBreed);
      });
      console.log('After popover breed filter:', filtered.length);
    }
    
    // 4. Φίλτρα από search bar (ΕΙΔΟΣ)
    if (currentPetType) {
      const petTypeString = typeof currentPetType === 'string' 
        ? currentPetType 
        : currentPetType.label || currentPetType;
      
      console.log('Filtering by pet type:', petTypeString);
      
      filtered = filtered.filter(pet => {
        const matches = pet.type && pet.type.toLowerCase().includes(petTypeString.toLowerCase());
        console.log(`Pet "${pet.name}" type "${pet.type}" matches "${petTypeString}":`, matches);
        return matches;
      });
      console.log('After pet type filter:', filtered.length);
    }
    
    // 5. Φίλτρα τοποθεσίας
    if (currentLocation) {
      const locationString = typeof currentLocation === 'string' 
        ? currentLocation 
        : currentLocation.label || currentLocation;
      
      console.log('Filtering by location:', locationString);
      
      filtered = filterByLocation(filtered, currentLocation);
      console.log('After location filter:', filtered.length);
    }
    
    // 6. Φίλτρα από dropdown menus (ΡΑΤΣΑ)
    if (currentBreed && currentBreed !== '') {
      filtered = filtered.filter(pet => {
        const petBreed = pet.breed || '';
        return petBreed.toLowerCase() === currentBreed.toLowerCase();
      });
      console.log('After breed dropdown filter:', filtered.length);
    }
    
    // 7. Φίλτρα από dropdown menus (ΦΥΛΟ)
    if (currentGender && currentGender !== '') {
      filtered = filtered.filter(pet => {
        const petGender = pet.gender || '';
        return petGender.toLowerCase() === currentGender.toLowerCase();
      });
      console.log('After gender dropdown filter:', filtered.length);
    }
    
    console.log('Final filtered count:', filtered.length);
    console.log('Filtered pets:', filtered.map(p => `${p.name} (${p.type}, ${p.breed}, ${p.gender}, ${p.location})`));
    setFilteredPets(filtered);
  }, [lostPets, filters, petTypeFilter, locationFilter, breed, gender, filterByLocation, searchParams]);
  
  // Συνάρτηση για εφαρμογή φίλτρων από το popover
  const handleApplyFilters = useCallback((newFilters) => {
    console.log('=== LOSTPETS: Received filters from popover ===', newFilters);
    setFilters(newFilters);
    // ΜΗΝ καλείς την applyAllFilters εδώ - θα κληθεί από το useEffect για popover filters
  }, []);
  
  // Συνάρτηση φιλτραρίσματος από το κύριο search
  const handleSearch = useCallback(() => {
    console.log('=== SEARCH BUTTON CLICKED ===');
    
    // Ενημέρωση URL με τα τρέχοντα φίλτρα
    const params = new URLSearchParams();
    if (petTypeFilter) {
      const petTypeValue = typeof petTypeFilter === 'string' 
        ? petTypeFilter 
        : petTypeFilter.label || petTypeFilter;
      params.set('type', petTypeValue);
    }
    if (locationFilter) {
      const locationValue = typeof locationFilter === 'string'
        ? locationFilter
        : locationFilter.label || locationFilter;
      params.set('location', locationValue);
    }
    
    setSearchParams(params);
    
    applyAllFilters({
      currentFilters: filters,
      currentPetType: petTypeFilter,
      currentLocation: locationFilter,
      currentBreed: breed,
      currentGender: gender
    });
  }, [applyAllFilters, filters, petTypeFilter, locationFilter, breed, gender, setSearchParams]);
  
  // Συνάρτηση για επαναφορά φίλτρων
  const handleResetFilters = useCallback(() => {
    console.log('=== RESETTING ALL FILTERS ===');
    setPetTypeFilter(null);
    setLocationFilter(null);
    setBreed('');
    setGender('');
    setOpen(false);
    setGenderOpen(false);
    setFilters({
      species: {},
      gender: {},
      breeds: {},
      selectedSpecies: [],
      selectedGenders: [],
      selectedBreeds: []
    });
    
    // Καθαρισμός query parameters από το URL
    setSearchParams({});
    
    // Εμφανίζουμε όλα τα κατοικίδια
    setFilteredPets(lostPets);
  }, [lostPets, setSearchParams]);
  
  // Συνάρτηση για ανάγνωση query parameters
  const initializeFiltersFromURL = useCallback(() => {
    const typeParam = searchParams.get('type');
    const locationParam = searchParams.get('location');
    
    console.log('Reading URL params:', { typeParam, locationParam });
    
    if (typeParam) {
      // Ψάχνουμε στο Pet_Types το αντίστοιχο object
      const foundPetType = Pet_Types.find(pet => {
        const petLabel = typeof pet === 'string' ? pet : pet.label;
        return petLabel === typeParam;
      });
      console.log('Found pet type from URL:', foundPetType);
      setPetTypeFilter(foundPetType || typeParam);
    }
    
    if (locationParam) {
      // Ψάχνουμε στο Athens_areas το αντίστοιχο object
      const foundLocation = Athens_areas.find(area => {
        const areaLabel = typeof area === 'string' ? area : area.label;
        return areaLabel === locationParam;
      });
      console.log('Found location from URL:', foundLocation);
      setLocationFilter(foundLocation || locationParam);
    }
  }, [searchParams]);
  
  // Φόρτωση δεδομένων από API κατά την αρχική φόρτωση
  useEffect(() => {
    const fetchLostPets = async () => {
      try {
        const response = await fetch('http://localhost:3004/lostPets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Loaded pets from API:', data.length, data);
        setLostPets(data);
        setFilteredPets(data);
      } catch (error) {
        console.error('Error fetching lost pets from API:', error);
        alert('Σφάλμα φόρτωσης δεδομένων απολεσθέντων κατοικιδίων');
      }
    };

    fetchLostPets();
    initializeFiltersFromURL();
  }, [initializeFiltersFromURL]);
  
  // useEffect για αυτόματη εφαρμογή φίλτρων όταν φορτωθεί η σελίδα με parameters
  useEffect(() => {
    // Ελέγχουμε αν υπάρχουν query parameters
    const hasQueryParams = searchParams.toString().length > 0;
    
    if (hasQueryParams && lostPets.length > 0) {
      console.log('URL has query params, applying filters...');
      // Χρησιμοποιούμε ένα μικρό timeout για να βεβαιωθούμε ότι τα states έχουν ενημερωθεί
      setTimeout(() => {
        applyAllFilters({
          currentFilters: filters,
          currentPetType: petTypeFilter,
          currentLocation: locationFilter,
          currentBreed: breed,
          currentGender: gender
        });
      }, 100);
    }
  }, [lostPets, searchParams, filters, petTypeFilter, locationFilter, breed, gender, applyAllFilters]);
  
  // Συνάρτηση για ομαδοποίηση κατοικιδίων σε γραμμές των 2
  const groupPetsIntoRows = useCallback((pets) => {
    const rows = [];
    for (let i = 0; i < pets.length; i += 2) {
      rows.push(pets.slice(i, i + 2));
    }
    return rows;
  }, []);
  
  // Αυτόματο φιλτράρισμα όταν αλλάζουν τα dropdowns
  useEffect(() => {
    // Εφαρμόζουμε φίλτρα μόνο αν υπάρχει επιλογή
    if (breed !== '' || gender !== '') {
      console.log('Breed or gender changed, applying filters:', { breed, gender });
      applyAllFilters({
        currentFilters: filters,
        currentPetType: petTypeFilter,
        currentLocation: locationFilter,
        currentBreed: breed,
        currentGender: gender
      });
    }
  }, [breed, gender, applyAllFilters, filters, petTypeFilter, locationFilter]);
  
  // Αυτόματο φιλτράρισμα όταν αλλάζουν τα popover filters
  useEffect(() => {
    // Ελέγχουμε αν υπάρχουν επιλεγμένα φίλτρα από το popover
    const hasPopoverFilters = 
      (filters.selectedSpecies && filters.selectedSpecies.length > 0) ||
      (filters.selectedGenders && filters.selectedGenders.length > 0) ||
      (filters.selectedBreeds && filters.selectedBreeds.length > 0);
    
    if (hasPopoverFilters) {
      console.log('Popover filters changed, applying filters');
      applyAllFilters({
        currentFilters: filters,
        currentPetType: petTypeFilter,
        currentLocation: locationFilter,
        currentBreed: breed,
        currentGender: gender
      });
    }
  }, [filters, applyAllFilters, petTypeFilter, locationFilter, breed, gender]);

  // Προσθήκη debugging για τα δεδομένα
  useEffect(() => {
    console.log('=== PET DATA DEBUG ===');
    console.log('All pets:', lostPets.map(pet => ({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      gender: pet.gender,
      location: pet.location
    })));
    
    console.log('Unique types:', [...new Set(lostPets.map(pet => pet.type).filter(Boolean))]);
    console.log('Unique breeds:', [...new Set(lostPets.map(pet => pet.breed).filter(Boolean))]);
    console.log('Unique genders:', [...new Set(lostPets.map(pet => pet.gender).filter(Boolean))]);
  }, [lostPets]);
  
  // Debugging για τα query parameters
  useEffect(() => {
    console.log('=== URL PARAMS DEBUG ===');
    console.log('Current URL params:', searchParams.toString());
    console.log('Type param:', searchParams.get('type'));
    console.log('Location param:', searchParams.get('location'));
    console.log('PetTypeFilter state:', petTypeFilter);
    console.log('LocationFilter state:', locationFilter);
  }, [searchParams, petTypeFilter, locationFilter]);
  
  useLayoutEffect(() => {
    console.log('LostPetsPage: Location changed', location.pathname);
    console.log('Search params:', searchParams.toString());
    
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
  }, [location.pathname, searchParams]);

  // Μετατροπή ημερών στα ελληνικά
  const getDaysText = useCallback((days) => {
    if (days === 1) return "Πριν 1 ημέρα";
    return `Πριν ${days} ημέρες`;
  }, []);

  const petRows = groupPetsIntoRows(filteredPets);

  return (
    <header className="Lost-pets-header">  
      <div className="frame-lost_pets">
        <span style={{ display: 'block', marginTop: '40px', marginLeft: '80px', fontSize: '24px', color: 'black', fontWeight: 'bold'}}>
          Αναζήτηση Απολεσθέντων Κατοικιδίων
        </span>
        
        {/* Χρήση του νέου PetSearchBar component */}
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
        />
        
        <Box sx={{
          display: 'flex', 
          gap: '10px', 
          alignItems: 'flex-start', 
          marginTop: '20px',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <Box sx={{display: 'flex', gap: '10px'}}>
            <Button className='menu-bar-button' variant="outlined">
              <LongMenu onApplyFilters={handleApplyFilters} />
            </Button>

            <BreedMenu
              breed={breed}
              setBreed={setBreed}
              open={open}
              setOpen={setOpen}
            />

            <GenderMenu 
              gender={gender}
              setGender={setGender}
              open={genderOpen}
              setOpen={setGenderOpen}
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
      </div>

      <Box className='quick-selection-container-vet'>
        {petRows.map((row, rowIndex) => (
          <Box key={rowIndex} className='quick-selection-row-pet'>
            {row.map((pet) => (
              <Box key={pet.id} className='around-box'>
                <Box className='inside-box'>
                  <Box sx={{flexShrink: 0}}>
                    <img 
                      src={petPhotos[pet.photo] || "https://via.placeholder.com/150"} 
                      className='lost-pet-img' 
                      alt={pet.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </Box>

                  <Box className='text-column'>
                    <span className='pet-name'>
                      {pet.name}
                    </span>
                    <span className='pet-range'>
                      {pet.breed}, {pet.gender}
                    </span>
                    
                    <span className='pet-location'>
                      <PlaceIcon sx={{color: '#67A3B8', width: 22, height: 22}} />
                      {pet.location}
                    </span>
                    
                    <span className='pet-location'>
                      <AccessTimeIcon sx={{color: '#67A3B8', width: 22, height: 20}} />
                      {getDaysText(pet.daysLost)}
                    </span>
                    
                    {pet.reward && (
                      <span className='pet-reward' style={{
                        display: 'block',
                        marginTop: '5px',
                        color: '#e91e63',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        Ανταμοιβή: {pet.reward}
                      </span>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
        
        {filteredPets.length === 0 && lostPets.length > 0 && (
          <Box sx={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            fontSize: '18px'
          }}>
            Δεν βρέθηκαν αποτελέσματα για τα κριτήρια αναζήτησής σας.
          </Box>
        )}
        
        {lostPets.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            fontSize: '18px'
          }}>
            Φόρτωση απολεσθέντων κατοικιδίων...
          </Box>
        )}
      </Box>
    </header>
  );
}