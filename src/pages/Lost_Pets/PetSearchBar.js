import {
  TextField,
  Autocomplete,
  Box,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const PetSearchBar = ({
  // Props για τα options
  petTypes = [],
  locationAreas = [],
  
  // Props για τις τρέχουσες τιμές
  petTypeFilter = null,
  locationFilter = null,
  
  // Props για τα handlers
  onPetTypeChange = () => {},
  onLocationChange = () => {},
  onSearch = () => {},
  
  // Προσθήκη labels για customization
  petTypeLabel = "Εισάγετε Είδος Κατοικιδίου",
  locationLabel = "Εισάγετε Τοποθεσία Εύρεσης",
  searchButtonText = "Αναζήτηση",
  
  // Προσθήκη styling props
  sx = {},
  className = "",
}) => {
  return (
    <Box 
      className={`find_pet-lost_pets ${className}`}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: '20px',
        marginTop: '20px',
        width: '100%',
        ...sx
      }}
    >
      {/* Είδος Κατοιδίου */}
      <Box sx={{ minWidth: { xs: '100%', md: '250px' } }}>
        <Autocomplete
          disablePortal
          id="pet-type-input"
          options={petTypes}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.label || option}
          isOptionEqualToValue={(option, value) => {
            if (typeof option === 'string' && typeof value === 'string') {
              return option === value;
            }
            if (option && value) {
              const optionLabel = option.label || option;
              const valueLabel = value.label || value;
              return optionLabel === valueLabel;
            }
            return false;
          }}
          sx={{ 
            width: '100%',
            '& .MuiInput-root': {
              paddingLeft: '8px'
            }
          }}
          value={petTypeFilter}
          onChange={(event, newValue) => {
            console.log('Pet type changed to:', newValue);
            onPetTypeChange(newValue);
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label={petTypeLabel}
              variant="standard"
              className="input_field"
              fullWidth
            />
          )}
        />
      </Box>

      {/* Τοποθεσία Εύρεσης */}
      <Box sx={{ minWidth: { xs: '100%', md: '250px' } }}>
        <Autocomplete
          disablePortal
          id="location-input"
          options={locationAreas}
          getOptionLabel={(option) => option.label || option}
          isOptionEqualToValue={(option, value) => {
            const optionLabel = option?.label || option;
            const valueLabel = value?.label || value;
            return optionLabel === valueLabel;
          }}
          sx={{ 
            width: '100%',
            '& .MuiInput-root': {
              paddingLeft: '8px'
            }
          }}
          value={locationFilter}
          onChange={(event, newValue) => {
            console.log('Location changed to:', newValue);
            onLocationChange(newValue);
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label={locationLabel}
              variant="standard"
              className="input_field"
              fullWidth
            />
          )}
        />
      </Box>

      <Button 
        className='search-button' 
        onClick={onSearch}
        variant="contained"
        sx={{
          height: '56px',
          minWidth: { xs: '100%', md: '150px' },
          backgroundColor: '#AD653A',
          color: 'white',
          '&:hover': {
            backgroundColor: '#AD653A',
          },
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(103, 163, 184, 0.3)',
        }}
        startIcon={<SearchIcon />}
      >
        {searchButtonText}
      </Button>
    </Box>
  );
};

export default PetSearchBar;