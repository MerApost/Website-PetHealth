import "../Owner/OwnerMainPage.css";
import "./VetMainPage.css"
import vet_main_page from "../../pics/vet_main_page.png";
import left_arrow from "../../pics/left_arrow.png"


// import React, { useState } from 'react';
import {
  TextField,
  // Autocomplete,
  Box,
  // Typography,
  Button
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import SearchIcon from '@mui/icons-material/Search';

export default function VetMainPage() {
  return (
    <header className="Owner-main-header">  
      <img src={vet_main_page} className="Owner" alt="Vet Main Page" />
      
      <Box className="find_vet-vet">
        <Box className="input_group_vet">
          <MemoryIcon className="icons" />
          <TextField id="filled-basic" label="Εισαγωγή κωδικού Microchip" variant="filled" className="input_field_vet" 
          sx={{
            '& .MuiInputBase-root': {
              height: '56px', // Ύψος
              width: '400px' // Πλάτος
            }
          }}/>
        </Box>

        <Button className='search-button'>
          <SearchIcon className="search_icon" />
          Αναζήτηση
        </Button>
      </Box>

      <Box className='quick-selection-container-vet'>
        {/* ΔΕΥΤΕΡΗ ΓΡΑΜΜΗ - 2 ΚΟΥΤΑΚΙΑ */}
        <Box className='quick-selection-row-vet'>
          <Box className='selections-vet'>
            <span className="selections-title-vet">
              Υπηρεσίες Κατοικιδίων
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Καταγραφή Ταυτότητας Κατοικιδίου
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Καταγραφή Ιατρικών Πράξεων 
              </span>
            </Box>
          </Box>

          <Box className='selections-vet'>
            <span className="selections-title-vet">
               Ωράριο / Ραντεβού
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Διαθεσιμότητα 
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Παρακολούθηση Ραντεβού 
              </span>
            </Box>

            {/* Τρίτο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Διαχείριση Ραντεβού 
              </span>
            </Box>
          </Box>
        </Box>
      
        {/* ΔΕΥΤΕΡΗ ΓΡΑΜΜΗ - 2 ΚΟΥΤΑΚΙΑ */}
        <Box className='quick-selection-row-vet'>
          <Box className='selections-vet'>
            <span className="selections-title-vet">
              Προφίλ
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Επεξεργασία Προφίλ
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Αξιολογήσεις 
              </span>
            </Box>
          </Box>

          <Box className='selections-vet'>
            <span className="selections-title-vet">
              Πληροφορίες
            </span>
            {/* Πρώτο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Συχνές Ερωτήσεις
              </span>
            </Box>
            
            {/* Δεύτερο στοιχείο */}
            <Box className='elements-vet'>
              <img src={left_arrow} className="enum-selections-vet" alt="Left Arrow"/>
              <span className="selection-text-vet">
                Επικοινωνία 
              </span>
            </Box>
          </Box>
        </Box>
      </Box>

    </header>
  );
}
