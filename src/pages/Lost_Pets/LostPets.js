import "./LostPets.css";
import Athens_areas from './../Owner/Athens_areas';
import Pet_Types from './Data/Pet_Types';
import LongMenu from './../../components/LongMenu';
import BreedMenu from './BreedMenu'; 
import GenderMenu from './GenderMenu';
import PetSearchBar from './PetSearchBar';

import {
  Box,
  Button,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function LostPets() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
  
  // Συνάρτηση για ταξινόμηση από το πιο πρόσφατα χαμένο
  const sortLostPets = useCallback((pets) => {
    return [...pets].sort((a, b) => {
      return a.daysLost - b.daysLost;
    });
  }, []);
  
  // Συνάρτηση για μορφοποίηση ημερών στα ελληνικά
  const getDaysText = useCallback((days) => {
    if (days === 0) return "Σήμερα";
    if (days === 1) return "Πριν 1 ημέρα";
    return `Πριν ${days} ημέρες`;
  }, []);
  
  // Συνάρτηση μετατροπής ημερομηνίας από DD/MM/YYYY
  const parseEuropeanDate = useCallback((dateString) => {
    if (!dateString) return new Date();
    
    const dateParts = dateString.split('/');
    if (dateParts.length !== 3) return new Date();
    
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    
    return new Date(year, month, day);
  }, []);
  
  // Συνάρτηση υπολογισμού διαφοράς ημερών
  const calculateDaysLost = useCallback((lostDateString) => {
    const lostDate = parseEuropeanDate(lostDateString);
    const today = new Date();
    
    const lostDateNormalized = new Date(lostDate.getFullYear(), lostDate.getMonth(), lostDate.getDate());
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const timeDiff = todayNormalized.getTime() - lostDateNormalized.getTime();
    const daysLost = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    
    return daysLost;
  }, [parseEuropeanDate]);
  
  // Συνάρτηση για φιλτράρισμα τοποθεσίας
  const filterByLocation = useCallback((pets, locationFilter) => {
    if (!locationFilter) return pets;
    
    const locationString = typeof locationFilter === 'string' 
      ? locationFilter 
      : (locationFilter?.label || locationFilter || '');
    
    if (!locationString || !locationString.trim()) return pets;
    
    return pets.filter(pet => {
      if (!pet.location) return false;
      
      const petLocation = pet.location.toLowerCase().trim();
      const searchLocation = locationString.toLowerCase().trim();
      
      if (petLocation === searchLocation) {
        return true;
      }
      
      if (petLocation.includes(', αθήνα')) {
        const cleanPetLocation = petLocation.replace(', αθήνα', '').trim();
        if (cleanPetLocation === searchLocation) {
          return true;
        }
      }
      
      if (petLocation.includes(searchLocation)) {
        return true;
      }
      
      if (searchLocation.includes(petLocation)) {
        return true;
      }
      
      return false;
    });
  }, []);
  
  // Συνάρτηση για ενίσχυση δεδομένων
  const enrichLostPetsData = useCallback((lostPetsData, usersData) => {
    return lostPetsData.map(lostPet => {
      // Βρες τον owner
      const owner = usersData.find(u => u.id === lostPet.ownerId);
      if (!owner) return null;
      
      // Βρες το συγκεκριμένο pet
      const pet = owner.pets?.find(p => 
        p.id === lostPet.petId || p.microchip === lostPet.microchip
      );
      
      if (!pet) return null;
      
      return {
        // Βασικά από lostPets
        id: lostPet.id,
        lostDate: lostPet.lostDate,
        location: lostPet.location,
        info: lostPet.additionalInfo || lostPet.info,
        microchip: lostPet.microchip,
        
        // Στοιχεία από το pet
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        gender: pet.gender,
        age: pet.age + (pet.age === "1" ? " έτους" : " ετών"),
        color: pet.color,
        photo: pet.photo,
        
        // Στοιχεία από owner
        ownerName: owner.name,
        ownerSurname: owner.surname,
        ownerPhone: owner.phone,
        ownerEmail: owner.email,
        ownerId: owner.id,
        
        // Υπολογισμένα πεδία
        daysLost: calculateDaysLost(lostPet.lostDate)
      };
    }).filter(pet => pet !== null);
  }, [calculateDaysLost]);
  
  // Κοινή συνάρτηση για φιλτράρισμα
  const applyAllFilters = useCallback(({
    currentFilters = filters,
    currentPetType = petTypeFilter,
    currentLocation = locationFilter,
    currentBreed = breed,
    currentGender = gender
  } = {}) => {
    
    let filtered = lostPets;
    
    // 1. Φίλτρα από popover (ΕΙΔΗ)
    if (currentFilters.selectedSpecies && currentFilters.selectedSpecies.length > 0) {
      filtered = filtered.filter(pet => {
        const petType = pet.type || '';
        return currentFilters.selectedSpecies.includes(petType);
      });
    }
    
    // 2. Φίλτρα από popover (ΦΥΛΑ)
    if (currentFilters.selectedGenders && currentFilters.selectedGenders.length > 0) {
      filtered = filtered.filter(pet => {
        const petGender = pet.gender || '';
        return currentFilters.selectedGenders.includes(petGender);
      });
    }
    
    // 3. Φίλτρα από popover (ΡΑΤΣΕΣ)
    if (currentFilters.selectedBreeds && currentFilters.selectedBreeds.length > 0) {
      filtered = filtered.filter(pet => {
        const petBreed = pet.breed || '';
        return currentFilters.selectedBreeds.includes(petBreed);
      });
    }
    
    // 4. Φίλτρα από search bar (ΕΙΔΟΣ)
    if (currentPetType) {
      const petTypeString = typeof currentPetType === 'string' 
        ? currentPetType 
        : currentPetType.label || currentPetType;
      
      filtered = filtered.filter(pet => {
        return pet.type && pet.type.toLowerCase().includes(petTypeString.toLowerCase());
      });
    }
    
    // 5. Φίλτρα τοποθεσίας
    if (currentLocation) {
      filtered = filterByLocation(filtered, currentLocation);
    }
    
    // 6. Φίλτρα από dropdown menus (ΡΑΤΣΑ)
    if (currentBreed && currentBreed !== '') {
      filtered = filtered.filter(pet => {
        const petBreed = pet.breed || '';
        return petBreed.toLowerCase() === currentBreed.toLowerCase();
      });
    }
    
    // 7. Φίλτρα από dropdown menus (ΦΥΛΟ)
    if (currentGender && currentGender !== '') {
      filtered = filtered.filter(pet => {
        const petGender = pet.gender || '';
        return petGender.toLowerCase() === currentGender.toLowerCase();
      });
    }
    
    // ΤΑΞΙΝΟΜΗΣΗ
    const sortedFiltered = sortLostPets(filtered);
    setFilteredPets(sortedFiltered);
  }, [lostPets, filters, petTypeFilter, locationFilter, breed, gender, filterByLocation, sortLostPets]);
  
  // Συνάρτηση για εφαρμογή φίλτρων από το popover
  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);
  
  // Συνάρτηση φιλτραρίσματος από το κύριο search
  const handleSearch = useCallback(() => {
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
    
    setSearchParams({});
    setFilteredPets(lostPets);
  }, [lostPets, setSearchParams]);
  
  // Συνάρτηση για ανάγνωση query parameters
  const initializeFiltersFromURL = useCallback(() => {
    const typeParam = searchParams.get('type');
    const locationParam = searchParams.get('location');
    
    if (typeParam) {
      const foundPetType = Pet_Types.find(pet => {
        const petLabel = typeof pet === 'string' ? pet : pet.label;
        return petLabel === typeParam;
      });
      setPetTypeFilter(foundPetType || typeParam);
    }
    
    if (locationParam) {
      const foundLocation = Athens_areas.find(area => {
        const areaLabel = typeof area === 'string' ? area : area.label;
        return areaLabel === locationParam;
      });
      setLocationFilter(foundLocation || locationParam);
    }
  }, [searchParams]);
  
  // Φόρτωση δεδομένων
  useEffect(() => {
    const fetchLostPets = async () => {
      try {
        // Φέρε lostPets και users ταυτόχρονα
        const [lostResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:3004/lostPets'),
          fetch('http://localhost:3004/users')
        ]);
        
        if (!lostResponse.ok || !usersResponse.ok) {
          throw new Error('HTTP error!');
        }
        
        const lostData = await lostResponse.json();
        const usersData = await usersResponse.json();
        
        // Ενίσχυσε τα δεδομένα
        const enrichedData = enrichLostPetsData(lostData, usersData);
        
        console.log('Loaded enriched lost pets:', enrichedData.length, enrichedData);
        
        const sortedData = sortLostPets(enrichedData);
        setLostPets(sortedData);
        setFilteredPets(sortedData);
      } catch (error) {
        console.error('Error fetching lost pets:', error);
        alert('Σφάλμα φόρτωσης δεδομένων απολεσθέντων κατοικιδίων');
      }
    };

    fetchLostPets();
    initializeFiltersFromURL();
  }, [initializeFiltersFromURL, sortLostPets, enrichLostPetsData]);
  
  // Αυτόματη εφαρμογή φίλτρων από URL
  useEffect(() => {
    const hasQueryParams = searchParams.toString().length > 0;
    
    if (hasQueryParams && lostPets.length > 0) {
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
    if (breed !== '' || gender !== '') {
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
    const hasPopoverFilters = 
      (filters.selectedSpecies && filters.selectedSpecies.length > 0) ||
      (filters.selectedGenders && filters.selectedGenders.length > 0) ||
      (filters.selectedBreeds && filters.selectedBreeds.length > 0);
    
    if (hasPopoverFilters) {
      applyAllFilters({
        currentFilters: filters,
        currentPetType: petTypeFilter,
        currentLocation: locationFilter,
        currentBreed: breed,
        currentGender: gender
      });
    }
  }, [filters, applyAllFilters, petTypeFilter, locationFilter, breed, gender]);

  const petRows = groupPetsIntoRows(filteredPets);

  return (
    <header className="Lost-pets-header">  
      <div className="frame-lost_pets">
        <span style={{ display: 'block', marginTop: '40px', marginLeft: '80px', fontSize: '24px', color: 'black', fontWeight: 'bold'}}>
          Αναζήτηση Απολεσθέντων Κατοικιδίων
        </span>
        
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
                      src={pet.photo} 
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
                    
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: '#67a3b8e8',
                        color: '#000000',
                        borderColor: '#000000',
                        '&:hover': {
                          backgroundColor: '#bbdefb',
                          borderColor: '#000000',
                        },
                        height: '30px',
                        width: '180px',
                        marginTop: '25px',
                        marginLeft: '110px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        textTransform: 'none',
                      }}
                      onClick={() => navigate(`/lost_pets/${pet.id}`)}
                    >
                      Προβολή Προφίλ
                    </Button>

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