import * as React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

// Εισαγωγή όλων των δεδομένων
import { ExperienceOptions } from './Data/ExperienceOptions';
import { AvailabilityOptions } from './Data/AvailabilityOptions';
import { LanguageOptions } from './Data/LanguageOptions';
import { PaymentOptions } from './Data/PaymentOptions';
import { ServicesOptions } from './Data/ServicesOptions';

export default function PopOverMenu({ 
  value = '',
  onChange = () => {},
  open = false, 
  onClose = () => {},
  anchorEl = null,
  filters = {},
  setFilters = () => {}
}) {
  // States για κάθε κατηγορία - ξεκινάμε με κενά
  const [experienceFilters, setExperienceFilters] = React.useState({});
  const [availabilityFilters, setAvailabilityFilters] = React.useState({});
  const [languageFilters, setLanguageFilters] = React.useState({});
  const [paymentFilters, setPaymentFilters] = React.useState({});
  const [servicesFilters, setServicesFilters] = React.useState({});

  // State για show more/less
  const [showAllLanguages, setShowAllLanguages] = React.useState(false);
  const [showAllServices, setShowAllServices] = React.useState(false);

  // Αρχικοποίηση state για κάθε κατηγορία - ΜΟΝΟ όταν ανοίγει το popover
  React.useEffect(() => {
    if (open) {
      // Χρησιμοποιούμε τα υπάρχοντα filters ή κενά
      const initialExperienceState = {};
      ExperienceOptions.forEach(option => {
        if (option.value && option.value !== '') {
          initialExperienceState[option.value] = filters.experience?.[option.value] || false;
        }
      });
      setExperienceFilters(initialExperienceState);

      const initialAvailabilityState = {};
      AvailabilityOptions.forEach(option => {
        if (option.value && option.value !== '') {
          initialAvailabilityState[option.value] = filters.availability?.[option.value] || false;
        }
      });
      setAvailabilityFilters(initialAvailabilityState);

      const initialLanguageState = {};
      LanguageOptions.forEach(option => {
        if (option.value && option.value !== '') {
          initialLanguageState[option.value] = filters.languages?.[option.value] || false;
        }
      });
      setLanguageFilters(initialLanguageState);

      const initialPaymentState = {};
      PaymentOptions.forEach(option => {
        if (option.value && option.value !== '') {
          initialPaymentState[option.value] = filters.payments?.[option.value] || false;
        }
      });
      setPaymentFilters(initialPaymentState);

      const initialServicesState = {};
      ServicesOptions.forEach(option => {
        if (option.value && option.value !== '') {
          initialServicesState[option.value] = filters.services?.[option.value] || false;
        }
      });
      setServicesFilters(initialServicesState);
    }
  }, [open, filters]);

  // Χειριστές για κάθε κατηγορία
  const handleExperienceChange = (event) => {
    const { name, checked } = event.target;
    setExperienceFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleAvailabilityChange = (event) => {
    const { name, checked } = event.target;
    setAvailabilityFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleLanguageChange = (event) => {
    const { name, checked } = event.target;
    setLanguageFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handlePaymentChange = (event) => {
    const { name, checked } = event.target;
    setPaymentFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleServicesChange = (event) => {
    const { name, checked } = event.target;
    setServicesFilters(prev => ({ ...prev, [name]: checked }));
  };

  // Χειριστής εφαρμογής φίλτρων
  const handleApply = () => {
    // Βρίσκουμε τα επιλεγμένα φίλτρα για κάθε κατηγορία
    const selectedExperience = Object.keys(experienceFilters).filter(key => experienceFilters[key]);
    const selectedAvailability = Object.keys(availabilityFilters).filter(key => availabilityFilters[key]);
    const selectedLanguages = Object.keys(languageFilters).filter(key => languageFilters[key]);
    const selectedPayments = Object.keys(paymentFilters).filter(key => paymentFilters[key]);
    const selectedServices = Object.keys(servicesFilters).filter(key => servicesFilters[key]);

    // Δημιουργούμε μια τιμή για το κεντρικό state
    let appliedValue = '';
    const selectedValues = [];
    
    if (selectedExperience.length > 0) {
      selectedValues.push(`Εμπειρία: ${selectedExperience.join(', ')}`);
    }
    if (selectedAvailability.length > 0) {
      selectedValues.push(`Διαθεσιμότητα: ${selectedAvailability.join(', ')}`);
    }
    if (selectedLanguages.length > 0) {
      selectedValues.push(`Γλώσσες: ${selectedLanguages.join(', ')}`);
    }
    if (selectedPayments.length > 0) {
      selectedValues.push(`Πληρωμές: ${selectedPayments.join(', ')}`);
    }
    if (selectedServices.length > 0) {
      selectedValues.push(`Υπηρεσίες: ${selectedServices.join(', ')}`);
    }
    
    appliedValue = selectedValues.join(' | ');

    // Καλούμε το onChange
    onChange(appliedValue);

    // Ενημερώνουμε και τα filters
    if (setFilters) {
      setFilters({
        experience: experienceFilters,
        availability: availabilityFilters,
        languages: languageFilters,
        payments: paymentFilters,
        services: servicesFilters,
        selectedExperience,
        selectedAvailability,
        selectedLanguages,
        selectedPayments,
        selectedServices
      });
    }

    // Κλείνουμε το popover
    onClose();
  };

  // Χειριστής για ΑΚΥΡΩΣΗ - καθαρίζουμε τα φίλτρα
  const handleCancel = () => {
    // Καθαρίζουμε όλα τα state
    const emptyState = {};
    ExperienceOptions.forEach(option => {
      if (option.value && option.value !== '') {
        emptyState[option.value] = false;
      }
    });
    setExperienceFilters(emptyState);

    const emptyAvailabilityState = {};
    AvailabilityOptions.forEach(option => {
      if (option.value && option.value !== '') {
        emptyAvailabilityState[option.value] = false;
      }
    });
    setAvailabilityFilters(emptyAvailabilityState);

    const emptyLanguageState = {};
    LanguageOptions.forEach(option => {
      if (option.value && option.value !== '') {
        emptyLanguageState[option.value] = false;
      }
    });
    setLanguageFilters(emptyLanguageState);

    const emptyPaymentState = {};
    PaymentOptions.forEach(option => {
      if (option.value && option.value !== '') {
        emptyPaymentState[option.value] = false;
      }
    });
    setPaymentFilters(emptyPaymentState);

    const emptyServicesState = {};
    ServicesOptions.forEach(option => {
      if (option.value && option.value !== '') {
        emptyServicesState[option.value] = false;
      }
    });
    setServicesFilters(emptyServicesState);

    // Καλούμε το onChange με κενή τιμή
    onChange('');

    // Ενημερώνουμε και τα filters με κενά
    if (setFilters) {
      setFilters({
        experience: emptyState,
        availability: emptyAvailabilityState,
        languages: emptyLanguageState,
        payments: emptyPaymentState,
        services: emptyServicesState,
        selectedExperience: [],
        selectedAvailability: [],
        selectedLanguages: [],
        selectedPayments: [],
        selectedServices: []
      });
    }

    // Κλείνουμε το popover
    onClose();
  };

  // Χειριστές για show more/less
  const handleShowMoreLanguages = () => {
    setShowAllLanguages(!showAllLanguages);
  };

  const handleShowMoreServices = () => {
    setShowAllServices(!showAllServices);
  };

  // Φιλτράρουμε τις επιλογές (αφαιρούμε την "Καμία επιλογή")
  const filteredExperienceOptions = ExperienceOptions?.filter(option => 
    option.value !== '' && option.value !== 'Καμία επιλογή'
  ) || [];

  const filteredAvailabilityOptions = AvailabilityOptions?.filter(option => 
    option.value !== '' && option.value !== 'Καμία επιλογή'
  ) || [];

  const filteredLanguageOptions = LanguageOptions?.filter(option => 
    option.value !== '' && option.value !== 'Καμία επιλογή'
  ) || [];

  const filteredPaymentOptions = PaymentOptions?.filter(option => 
    option.value !== '' && option.value !== 'Καμία επιλογή'
  ) || [];

  const filteredServicesOptions = ServicesOptions?.filter(option => 
    option.value !== '' && option.value !== 'Καμία επιλογή'
  ) || [];

  // Ορατές επιλογές για γλώσσες και υπηρεσίες
  const initialVisibleLanguages = filteredLanguageOptions.slice(0, 3);
  const visibleLanguages = showAllLanguages ? filteredLanguageOptions : initialVisibleLanguages;

  const initialVisibleServices = filteredServicesOptions.slice(0, 3);
  const visibleServices = showAllServices ? filteredServicesOptions : initialVisibleServices;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleCancel} // Χρησιμοποιούμε handleCancel για να καθαρίζουμε
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ width: 350, p: 2, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
          Όλα τα Φίλτρα
        </Typography>

        {/* Εμπειρία Section */}
        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
          • Εμπειρία
        </Typography>
        <Box sx={{ mb: 2 }}>
          {filteredExperienceOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={experienceFilters[option.value] || false}
                  onChange={handleExperienceChange}
                  name={option.value}
                />
              }
              label={option.label}
            />
          ))}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Διαθεσιμότητα Section */}
        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
          • Διαθεσιμότητα
        </Typography>
        <Box sx={{ mb: 2 }}>
          {filteredAvailabilityOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={availabilityFilters[option.value] || false}
                  onChange={handleAvailabilityChange}
                  name={option.value}
                />
              }
              label={option.label}
            />
          ))}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Γλώσσες Section */}
        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
          • Γλώσσες
        </Typography>
        <Box sx={{ mb: 2, maxHeight: 120, overflow: 'auto' }}>
          <FormGroup>
            {visibleLanguages.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={languageFilters[option.value] || false}
                    onChange={handleLanguageChange}
                    name={option.value}
                  />
                }
                label={option.label}
                sx={{ display: 'block', fontSize: '0.9rem' }}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Κουμπί "Περισσότερα" για γλώσσες */}
        {filteredLanguageOptions.length > 3 && (
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
            onClick={handleShowMoreLanguages}
          >
            {showAllLanguages ? 'Λιγότερες γλώσσες...' : 'Περισσότερες γλώσσες...'}
          </Typography>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Τρόποι Πληρωμής Section */}
        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
          • Τρόποι Πληρωμής
        </Typography>
        <Box sx={{ mb: 2 }}>
          {filteredPaymentOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={paymentFilters[option.value] || false}
                  onChange={handlePaymentChange}
                  name={option.value}
                />
              }
              label={option.label}
            />
          ))}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Υπηρεσίες Section */}
        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
          • Υπηρεσίες
        </Typography>
        <Box sx={{ mb: 2, maxHeight: 120, overflow: 'auto' }}>
          <FormGroup>
            {visibleServices.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={servicesFilters[option.value] || false}
                    onChange={handleServicesChange}
                    name={option.value}
                  />
                }
                label={option.label}
                sx={{ display: 'block', fontSize: '0.9rem' }}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Κουμπί "Περισσότερα" για υπηρεσίες */}
        {filteredServicesOptions.length > 3 && (
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
            onClick={handleShowMoreServices}
          >
            {showAllServices ? 'Λιγότερες υπηρεσίες...' : 'Περισσότερες υπηρεσίες...'}
          </Typography>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Κουμπιά Εφαρμογής */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel} // Χρησιμοποιούμε handleCancel
            sx={{
              flex: 1,
              py: 1,
              borderRadius: 1,
              fontWeight: 'medium',
              borderColor: '#ccc',
              color: '#666',
            }}
          >
            ΑΚΥΡΩΣΗ
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              flex: 1,
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
              py: 1,
              borderRadius: 1,
              fontWeight: 'bold',
            }}
          >
            ΕΦΑΡΜΟΓΗ
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}