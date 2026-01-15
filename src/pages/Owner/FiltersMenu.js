import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import PopOverMenu from './PopOverMenu';

export default function FiltersMenu({ 
  value = '', 
  onChange = () => {}, 
  open = false, 
  setOpen = () => {},
  filters = {},
  setFilters = () => {}
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  // Χρησιμοποιούμε το open από τα props, όχι δικό μας state
  React.useEffect(() => {
    if (open && !anchorEl) {
      // Αν πρέπει να ανοίξει το popover, αλλά δεν έχουμε anchorEl
      // τότε πρέπει να το πάρουμε από το κουμπί
      const button = document.querySelector('.menu-bar-button');
      if (button) {
        setAnchorEl(button);
      }
    }
  }, [open, anchorEl]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true); // Καλούμε το setOpen από τα props
  };

  return (
    <div>
      <IconButton
        aria-label="filters"
        onClick={handleClick}
        sx={{ 
          color: 'black',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <TuneSharpIcon />
        {/* ΑΦΑΙΡΕΣΑ ΤΟ ΚΕΙΜΕΝΟ ΤΩΝ ΕΠΙΛΕΓΜΕΝΩΝ */}
      </IconButton>
      
      {anchorEl && (
        <PopOverMenu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setOpen(false)} // Απλό κλείσιμο
          value={value}
          onChange={onChange}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </div>
  );
}