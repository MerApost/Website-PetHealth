import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import FiltersPopover from './../pages/Lost_Pets/FiltersPopover';

export default function LongMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = (filters) => {
    console.log('Filters applied:', filters);
    // Εδώ μπορείτε να χρησιμοποιήσετε τα φίλτρα για να φιλτράρετε τα αποτελέσματα
  };

  return (
    <div>
      <IconButton
        aria-label="filters"
        aria-controls={open ? 'filters-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ color: 'black' }}
      >
        <TuneSharpIcon />
      </IconButton>
      
      <FiltersPopover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onApply={handleApply}
      />
    </div>
  );
}