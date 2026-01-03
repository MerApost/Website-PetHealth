import React from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem
} from '@mui/material';
import dropdown_arrow from './../../pics/drop_down_arrow_1.png';
import { GenderOptions } from './Data/GenderOptions';

const GenderMenu = ({ gender, setGender, open, setOpen }) => {
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <Button
          variant="outlined"
          onClick={handleToggle}
          className="menu-button"
          sx={{
            height: '56px',
            minWidth: '95px',
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
          endIcon={<img src={dropdown_arrow} className="dropdown-arrow" alt="Drop Down Pic"/>}
        >
          Φύλο
        </Button>
        {open && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              zIndex: 1300,
              mt: '-40px',
              marginLeft: '11px',
              maxHeight: '300px',
              overflowY: 'auto',
              width: '200px'
            }}
          >
            {GenderOptions.map((option) => (
              <MenuItem 
                key={option.value}
                onClick={() => { 
                  setGender(option.value); 
                  setOpen(false); 
                }}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 16px'
                }}
              >
                <span>{option.label}</span>
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: '#000000ff',
                    backgroundColor: gender === option.value ? '#9d8a20ff' : 'transparent',
                    ml: 2
                  }}
                />
              </MenuItem>
            ))}
          </Box>
        )}
      </FormControl>
    </Box>
  );
};

export default GenderMenu;