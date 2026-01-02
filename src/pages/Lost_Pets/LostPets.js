import "./LostPets.css";
import Athens_areas from './../Owner/Athens_areas';
import Pet_Types from './../Main/Pet_Types';
import LongMenu from './../../components/LongMenu';

import{
  TextField,
  Autocomplete,
  Box,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function LostPets(){
  const location = useLocation();
  const hasScrolled = useRef(false);
  
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
        
        <Button className='menu-bar-button' variant="outlined">
          <LongMenu />
        </Button>
        <Button className='menu-button' variant="outlined">
          Ράτσα
        </Button>
      </div>
    </header>
  );
}