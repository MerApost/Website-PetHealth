import { Box, Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import './../Owner/OwnerLogIn.css';

const drawerWidth = 270;

export default function VetLogIn() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  
  // Scroll στην αρχη της σελίδας κάθε φορά που μπαίνουμε
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Sidebar Menu */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Κύριο μενού */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/vet_main/${userId}`)} sx={{backgroundColor: '#D7D3CB'}}>
              <ListItemIcon>
                <PetsIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Πρόγραμμα Ημέρας" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./appointment_management`)}>
              <ListItemIcon>
                <SearchIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Διαχείριση Ραντεβού" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./availability_definition`)}>
              <ListItemIcon>
                <CalendarMonthIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Ορισμός Διαθεσιμότητας" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./pet_identity_registration`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Καταγραφή Ταυτότητας Κατοικιδίου" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./recording_medical_acts_incidents`)}>
              <ListItemIcon>
                <DescriptionIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Καταγραφή Ιατρικών Πράξεων - Συμβάντων" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./view_ratings`)}>
              <ListItemIcon>
                <HistoryIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Προβολή Αξιολογήσεων" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`./history_registration`)}>
              <ListItemIcon>
                <HistoryIcon sx={{color: 'black'}}/>
              </ListItemIcon>
              <ListItemText primary="Ιστορικό Καταχωρίσεων" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      {/* Κύριο περιεχόμενο - Άδειο */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <div className="owner-main-container">
          {/* Άδειο περιεχόμενο */}
        </div>
      </Box>
    </Box>
  );
}