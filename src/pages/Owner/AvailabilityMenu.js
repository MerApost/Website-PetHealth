import {
  Box,
  Button,
  FormControl,
  MenuItem
} from '@mui/material';
import dropdown_arrow from './../../pics/drop_down_arrow_1.png';
import { AvailabilityOptions } from './Data/AvailabilityOptions';

const AvailabilityMenu = ({ value, onChange, open, setOpen }) => {
  const handleToggle = () => {
    setOpen(!open);
  };

  // Προσθέτουμε επιλογή "Όλα τα φύλα"
  const allGenderOptions = [
    ...AvailabilityOptions
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <Button
          variant="outlined"
          onClick={handleToggle}
          className="menu-button"
          sx={{
            height: '56px',
            minWidth: '160px',
            justifyContent: 'space-between',
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            },
            color: '#000000',
            fontWeight: 'normal'
          }}
          endIcon={<img src={dropdown_arrow} className="dropdown-arrow" alt="Drop Down Pic"/>}
        >
          Διαθεσιμότητα
        </Button>
        {open && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              zIndex: 1300,
              mt: '-40px',
              maxHeight: '300px',
              overflowY: 'auto',
              width: '200px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            {allGenderOptions.map((option) => (
              <MenuItem 
                key={option.value || "all"}
                onClick={() => { 
                  onChange(option.value); 
                  setOpen(false); 
                }}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <span style={{
                  color: option.value === value ? '#9d8a20' : '#000000',
                  fontWeight: option.value === value ? '500' : 'normal'
                }}>
                  {option.label}
                </span>
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: option.value === value ? '#9d8a20' : '#000000',
                    backgroundColor: option.value === value ? '#9d8a20' : 'transparent',
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

export default AvailabilityMenu;