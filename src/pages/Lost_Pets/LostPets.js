import "./LostPets.css";
import Athens_areas from './../Owner/Athens_areas';
import Pet_Types from './../Main/Pet_Types';
import LongMenu from './../../components/LongMenu';
import BreedMenu from './BreedMenu'; 
import GenderMenu from './GenderMenu';

import maximos from './../../pics/maximos.png'
import fiona from './../../pics/fiona.png'
import frixos from './../../pics/frixos.png'
import melomakarono from './../../pics/melomakarono.png'
import hasan from './../../pics/hasan.png'
import loukoumi from './../../pics/loukoumi.png'

import{
  TextField,
  Autocomplete,
  Box,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function LostPets(){
  const location = useLocation();
  const hasScrolled = useRef(false);

  const [breed, setBreed] = useState(''); // Κατάσταση για το dropdown
  const [open, setOpen] = useState(false); // Κατάσταση για το άνοιγμα του dropdown

  // Καταστάσεις για το φύλλο
  const [gender, setGender] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);

  
  useLayoutEffect(() => {
    console.log('LostPetsPage: Location changed', location.pathname);
    
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

  return (
    <header className="Lost-pets-header">  
      <div className="frame-lost_pets">
        <span style={{ display: 'block', marginTop: '40px', marginLeft: '80px', fontSize: '24px', color: 'black', fontWeight: 'bold'}}>
          Αναζήτηση Απολεσθέντων Κατοικιδίων
        </span>
        <Box className="find_pet-lost_pets">
          {/* Είδος Κατοιδίου */}
          <Box className="input_group-lost_pets">
            <Autocomplete
              disablePortal
              id="pet-type-input"
              options={Pet_Types}
              sx={{ 
                minWidth: '250px',
                '& .MuiInput-root': {
                  paddingLeft: '8px'
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Εισάγετε Είδος Κατοικιδίου" 
                  variant="standard"
                  className="input_field"
                />
              )}
            />
          </Box>

          {/* Τοποθεσία Εύρεσης */}
          <Box className="input_group-lost_pets">
            <Autocomplete
              disablePortal
              id="location-input"
              options={Athens_areas}
              sx={{ 
                minWidth: '250px',
                '& .MuiInput-root': {
                  paddingLeft: '8px'
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Εισάγετε Τοποθεσία Εύρεσης" 
                  variant="standard"
                  className="input_field"
                />
              )}
            />
          </Box>

          <Button className='search-button'>
            <SearchIcon className="search_icon" />
            Αναζήτηση
          </Button>
        </Box>
        
        <Box sx={{display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '20px'}}>
          <Button className='menu-bar-button' variant="outlined">
            <LongMenu />
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
      </div>

      <Box className='quick-selection-container-vet'>
        {/* ΔΕΥΤΕΡΗ ΓΡΑΜΜΗ - 2 ΚΟΥΤΑΚΙΑ */}
        <Box className='quick-selection-row-pet'>
          <Box className='around-box'>
            <Box className='inside-box'>
              {/* Στήλη 1: Εικόνα */}
              <Box sx={{flexShrink: 0}}>
                <img src={maximos} className='lost-pet-img' alt="Maximos" />
              </Box>

              {/* Στήλη 2: Κείμενο */}
              <Box className='text-column'>
                <span className='pet-name'>
                  Μάξιμος
                </span>
                <span className='pet-range'>
                  Border Collie, Αρσενικό
                </span>
                
                <span className='pet-location'>
                  <PlaceIcon sx={{color: '#67A3B8', width: 22, height: 22}} />
                  Ζωγράφου, Αθήνα
                </span>
                
                <span className='pet-location'>
                  <AccessTimeIcon sx={{color: '#67A3B8', width: 22, height: 20}} />
                  Πριν 1 ημέρα
                </span>
              </Box>
            </Box>
          </Box>  

          <Box className='around-box'>
            <Box className='inside-box'>
              {/* Στήλη 1: Εικόνα */}
              <Box sx={{flexShrink: 0}}>
                <img src={fiona} className='lost-pet-img' alt="Fiona" />
              </Box>

              {/* Στήλη 2: Κείμενο */}
              <Box className='text-column'>
                <span className='pet-name'>
                  Φιόνα
                </span>
                <span className='pet-range'>
                  Domestic Longhair, Θηλυκό
                </span>
                
                <span className='pet-location'>
                  <PlaceIcon sx={{color: '#67A3B8', width: 22, height: 22}} />
                  Εξάρχεια, Αθήνα
                </span>
                
                <span className='pet-location'>
                  <AccessTimeIcon sx={{color: '#67A3B8', width: 22, height: 20}} />
                  Πριν 2 ημέρες
                </span>
              </Box>
            </Box>
          </Box>
        </Box>
      
        {/* ΔΕΥΤΕΡΗ ΓΡΑΜΜΗ - 2 ΚΟΥΤΑΚΙΑ */}
        <Box className='quick-selection-row-pet'>
          <Box className='around-box'>
            <Box className='inside-box'>
              {/* Στήλη 1: Εικόνα */}
              <Box sx={{flexShrink: 0}}>
                <img src={frixos} className='lost-pet-img' alt="Frixos" />
              </Box>

              {/* Στήλη 2: Κείμενο */}
              <Box className='text-column'>
                <span className='pet-name'>
                  Φρίξος
                </span>
                <span className='pet-range'>
                  Maine Coon, Αρσενικό
                </span>
                
                <span className='pet-location'>
                  <PlaceIcon sx={{color: '#67A3B8', width: 22, height: 22}} />
                  Ψυχικό, Αθήνα
                </span>
                
                <span className='pet-location'>
                  <AccessTimeIcon sx={{color: '#67A3B8', width: 22, height: 20}} />
                  Πριν 2 ημέρες
                </span>
              </Box>
            </Box>
          </Box>  

          <Box className='around-box'>
            <Box className='inside-box'>
              {/* Στήλη 1: Εικόνα */}
              <Box sx={{flexShrink: 0}}>
                <img src={melomakarono} className='lost-pet-img' alt="Melomakarono" />
              </Box>

              {/* Στήλη 2: Κείμενο */}
              <Box className='text-column'>
                <span className='pet-name'>
                  Μελομακάρονο
                </span>
                <span className='pet-range'>
                  Golden Retriever, Αρσενικό
                </span>
                
                <span className='pet-location'>
                  <PlaceIcon sx={{color: '#67A3B8', width: 22, height: 22}} />
                  Αμπελόκηποι, Αθήνα
                </span>
                
                <span className='pet-location'>
                  <AccessTimeIcon sx={{color: '#67A3B8', width: 22, height: 20}} />
                  Πριν 5 ημέρες
                </span>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ΤΡΙΤΗ ΓΡΑΜΜΗ - 2 ΚΟΥΤΑΚΙΑ */}
        <Box className='quick-selection-row-pet'>
          <Box className='around-box'>
            <Box className='inside-box'>
              {/* Στήλη 1: Εικόνα */}
              <Box sx={{flexShrink: 0}}>
                <img src={loukoumi} className='lost-pet-img' alt="Loukoumi" />
              </Box>

              {/* Στήλη 2: Κείμενο */}
              <Box className='text-column'>
                <span className='pet-name'>
                  Λουκούμι
                </span>
                <span className='pet-range'>
                  Goldendoodle, Θηλυκό
                </span>
                
                <span className='pet-location'>
                  <PlaceIcon sx={{color: '#67A3B8', width: 22, height: 22}} />
                  Παγκράτι, Αθήνα
                </span>
                
                <span className='pet-location'>
                  <AccessTimeIcon sx={{color: '#67A3B8', width: 22, height: 20}} />
                  Πριν 5 ημέρες
                </span>
              </Box>
            </Box>
          </Box>  

          <Box className='around-box'>
            <Box className='inside-box'>
              {/* Στήλη 1: Εικόνα */}
              <Box sx={{flexShrink: 0}}>
                <img src={hasan} className='lost-pet-img' alt="Hasan" />
              </Box>

              {/* Στήλη 2: Κείμενο */}
              <Box className='text-column'>
                <span className='pet-name'>
                  Χασάν
                </span>
                <span className='pet-range'>
                  Beagle, Αρσενικό
                </span>
                
                <span className='pet-location'>
                  <PlaceIcon sx={{color: '#67A3B8', width: 22, height: 22}} />
                  Αιγάλεω, Αθήνα
                </span>
                
                <span className='pet-location'>
                  <AccessTimeIcon sx={{color: '#67A3B8', width: 22, height: 20}} />
                  Πριν 8 ημέρες
                </span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </header>
  );
}