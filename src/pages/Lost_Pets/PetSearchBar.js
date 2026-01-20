import {
  TextField,
  Box,
  Button,
  MenuItem,
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
      {/* Είδος Κατοικιδίου */}
      <Box sx={{ minWidth: { xs: '100%', md: '250px' } }}>
        <TextField
          select
          label={petTypeLabel}
          variant="standard"
          className="input_field"
          fullWidth
          value={petTypeFilter || ""}
          onChange={(event) => {
            const value = event.target.value;
            onPetTypeChange(value || "");
          }}
        >
          <MenuItem value="">Όλα</MenuItem>
          {petTypes.map((option) => {
            const label = typeof option === "string" ? option : option.label || option;
            return (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            );
          })}
        </TextField>
      </Box>

      {/* Τοποθεσία Εύρεσης */}
      <Box sx={{ minWidth: { xs: '100%', md: '250px' } }}>
        <TextField
          select
          label={locationLabel}
          variant="standard"
          className="input_field"
          fullWidth
          value={locationFilter || ""}
          onChange={(event) => {
            const value = event.target.value;
            onLocationChange(value || "");
          }}
        >
          <MenuItem value="">Όλες</MenuItem>
          {locationAreas.map((option) => {
            const label = option.label || option;
            return (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            );
          })}
        </TextField>
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
