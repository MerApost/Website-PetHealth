import * as React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

// Εισαγωγή δεδομένων από τα αρχεία
import Pet_Types from './Data/Pet_Types';
import { Pet_Breeds } from './Data/Pet_Breeds';
import { GenderOptions } from './Data/GenderOptions';

export default function FiltersPopover({ anchorEl, open, onClose, onApply }) {
  // States
  const [showAllSpecies, setShowAllSpecies] = React.useState(false);
  const [showAllBreeds, setShowAllBreeds] = React.useState(false);
  const [species, setSpecies] = React.useState({});
  const [gender, setGender] = React.useState({});
  const [breeds, setBreeds] = React.useState({});

  // Προσθήκη value στα είδη για να έχουν σταθερό key
  const petTypesWithValues = Pet_Types.map((type, index) => ({
    ...type,
    value: type.label.toLowerCase().replace(/\s+/g, '_') || `type_${index}`
  }));

  // Αρχικοποίηση state για είδη
  React.useEffect(() => {
    const initialSpeciesState = {};
    petTypesWithValues.forEach(type => {
      initialSpeciesState[type.value] = false;
    });
    setSpecies(initialSpeciesState);
  }, []);

  // Αρχικοποίηση state για φύλα
  React.useEffect(() => {
    const initialGenderState = {};
    GenderOptions.forEach(option => {
      if (option.value && option.value !== '') {
        initialGenderState[option.value] = false;
      }
    });
    setGender(initialGenderState);
  }, []);

  // Αρχικοποίηση state για ράτσες
  React.useEffect(() => {
    const initialBreedsState = {};
    Pet_Breeds.forEach(breed => {
      if (breed.value && breed.value !== '') {
        initialBreedsState[breed.value] = false;
      }
    });
    setBreeds(initialBreedsState);
  }, []);

  // Χειριστής για είδη
  const handleSpeciesChange = (event) => {
    setSpecies({
      ...species,
      [event.target.name]: event.target.checked,
    });
  };

  // Χειριστής για φύλα
  const handleGenderChange = (event) => {
    setGender({
      ...gender,
      [event.target.name]: event.target.checked,
    });
  };

  // Χειριστής για ράτσες
  const handleBreedChange = (event) => {
    setBreeds({
      ...breeds,
      [event.target.name]: event.target.checked,
    });
  };

  // Χειριστής εφαρμογής φίλτρων
  const handleApply = () => {
    onApply({ 
      species, 
      gender, 
      breeds,
      selectedSpecies: Object.keys(species).filter(key => species[key]),
      selectedGenders: Object.keys(gender).filter(key => gender[key]),
      selectedBreeds: Object.keys(breeds).filter(key => breeds[key])
    });
    onClose();
  };

  // Χειριστές για show more/less
  const handleShowMoreSpecies = () => {
    setShowAllSpecies(!showAllSpecies);
  };

  const handleShowMoreBreeds = () => {
    setShowAllBreeds(!showAllBreeds);
  };

  // Ορατές επιλογές
  const initialVisibleSpecies = petTypesWithValues.slice(0, 4);
  const visibleSpecies = showAllSpecies ? petTypesWithValues : initialVisibleSpecies;

  const filteredBreeds = Pet_Breeds?.filter(breed => 
    breed.value !== '' && breed.label !== 'Καμία επιλογή'
  ) || [];
  
  const initialVisibleBreeds = filteredBreeds.slice(0, 4);
  const visibleBreeds = showAllBreeds ? filteredBreeds : initialVisibleBreeds;

  const filteredGenderOptions = GenderOptions?.filter(option => 
    option.value !== '' && option.label !== 'Καμία επιλογή'
  ) || [];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: 320,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          maxHeight: '80vh',
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
        Φίλτρα
      </Typography>
      
      {/* Είδος Section */}
      <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
        • Είδος
      </Typography>
      <Box sx={{ mb: 2, maxHeight: 150, overflow: 'auto' }}>
        <FormGroup>
          {visibleSpecies.map((type) => (
            <FormControlLabel
              key={type.value}
              control={
                <Checkbox
                  checked={species[type.value] || false}
                  onChange={handleSpeciesChange}
                  name={type.value}
                />
              }
              label={type.label}
              sx={{ display: 'block', fontSize: '0.9rem' }}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Κουμπί "Περισσότερα" για είδη */}
      {petTypesWithValues.length > 4 && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'primary.main', 
            cursor: 'pointer',
            mb: 2,
            fontWeight: 'medium',
            textAlign: 'center',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
          onClick={handleShowMoreSpecies}
        >
          {showAllSpecies ? 'Λιγότερα...' : 'Περισσότερα...'}
        </Typography>
      )}

      <Divider sx={{ my: 1 }} />

      {/* Φύλο Section */}
      <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
        • Φύλο
      </Typography>
      <Box sx={{ mb: 2 }}>
        {filteredGenderOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={gender[option.value] || false}
                onChange={handleGenderChange}
                name={option.value}
              />
            }
            label={option.label}
          />
        ))}
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Ράτσα Section */}
      <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
        • Ράτσα
      </Typography>
      <Box sx={{ mb: 2, maxHeight: 150, overflow: 'auto' }}>
        <FormGroup>
          {visibleBreeds.map((breed) => (
            <FormControlLabel
              key={breed.value}
              control={
                <Checkbox
                  checked={breeds[breed.value] || false}
                  onChange={handleBreedChange}
                  name={breed.value}
                />
              }
              label={breed.label}
              sx={{ display: 'block', fontSize: '0.9rem' }}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Κουμπί "Περισσότερα" για ράτσες */}
      {filteredBreeds.length > 4 && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'primary.main', 
            cursor: 'pointer',
            mb: 2,
            fontWeight: 'medium',
            textAlign: 'center',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
          onClick={handleShowMoreBreeds}
        >
          {showAllBreeds ? 'Λιγότερα...' : 'Περισσότερα...'}
        </Typography>
      )}

      <Divider sx={{ my: 1 }} />

      {/* Εφαρμογή Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleApply}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
            width: '100%',
            py: 1,
            borderRadius: 1,
            fontWeight: 'bold',
          }}
        >
          ΕΦΑΡΜΟΓΗ
        </Button>
      </Box>
    </Popover>
  );
}