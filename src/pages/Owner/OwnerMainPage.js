import './OwnerMainPage.css';
import owner_main_page from "../../pics/owner_main_page.png";
import vet_pic from "../../pics/vet_pic.png"
import specialty from "../../pics/specialty.png"
import left_arrow from "../../pics/left_arrow.png"

import Athens_areas from './Athens_areas';
import VetSpecialties from './VetSpecialties';

// import React, { useState } from 'react';

import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from "@mui/icons-material/Place";

// DatePicker imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { el } from 'date-fns/locale';

// Προσθήκη του OwnerMainPage component
export default function OwnerMainPage(){
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={el}>
    <header className="Owner-main-header">  
      <img src={owner_main_page} className="Owner" alt="Owner Main Page" />
      <Box className="search">
        <img src={vet_pic} className="pic" alt="Owner Page"/>
        <Typography variant="body2" className="search_vet">
          Βρείτε Κτηνίατρο
        </Typography>
      </Box>
      

      <Box className="find_vet">
        {/* Τοποθεσία */}
        <Box className="input_group">
          <PlaceIcon className="icons" />
          <Autocomplete
            disablePortal
            id="location-input"
            options={Athens_areas}
            sx={{ 
              minWidth: '220px',
              '& .MuiInput-root': {
                paddingLeft: '8px' // Προσθήκη padding για να μην επικαλύπτει το εικονίδιο
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

        {/* Ημερομηνία - ΑΛΛΑΓΗ: ίδιο variant με τα άλλα */}
        <Box className="input_group">
          <CalendarMonthIcon className="icons" />
          <TextField
            type="date"
            label="Επιλογή Ημερομηνίας"
            variant="standard" // ΑΛΛΑΓΗ: από filled σε standard
            className="input_field"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ minWidth: '200px' }}
          />
        </Box>

        {/* Ειδικότητα */}
        <Box className="input_group">
          <img src={specialty} className="pics" alt="Owner Page"/>
          <Autocomplete
            disablePortal
            id="location-input"
            options={VetSpecialties}
            sx={{ 
              minWidth: '300px',
              '& .MuiInput-root': {
                paddingLeft: '8px' // Προσθήκη padding για να μην επικαλύπτει το εικονίδιο
              }
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Ειδικοτητα" 
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

      <p className='page-descr'>Γρήγορες Επιλογές</p>

      <Box className='quick-selection-container'>
        
        {/* ΠΡΩΤΗ ΓΡΑΜΜΗ - 3 ΚΟΥΤΑΚΙΑ */}
        <Box className='quick-selection-row'>
          <Box className='selections'>
            <span className="selections-title">
              Υπηρεσίες Κατοικιδίων 
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Προβολή Βιβλιάριου Υγείας 
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Προβολή Στοιχείων 
              </span>
            </Box>
          </Box>

          <Box className='selections'>
            <span className="selections-title">
              Ιατρική Περίθαλψη
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Διαχείριση Ραντεβού 
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Εύρεση Κτηνίατρου 
              </span>
            </Box>

            {/* Τρίτο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Αξιολόγηση 
              </span>
            </Box>
          </Box>

          <Box className='selections'>
            <span className="selections-title">
              Ιστορικό 
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Ραντεβού 
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Δήλωση Απώλειας 
              </span>
            </Box>

            {/* Τρίτο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Δήλωση Εύρεσης 
              </span>
            </Box>
          </Box>
        </Box>

        {/* ΔΕΥΤΕΡΗ ΓΡΑΜΜΗ - 2 ΚΟΥΤΑΚΙΑ */}
        <Box className='quick-selection-row'>
          <Box className='selections'>
            <span className="selections-title">
              Δηλώσεις
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Απώλεια
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Εύρεση 
              </span>
            </Box>
          </Box>

          <Box className='selections'>
            <span className="selections-title">
              Πληροφορίες
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Συχνές Ερωτήσεις
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements'>
              <img src={left_arrow} className="enum-selections" alt="Left Arrow"/>
              <span className="selection-text">
                Επικοινωνία 
              </span>
            </Box>
          </Box>
        </Box>
      </Box>

    </header>
    </LocalizationProvider>
  );
}
