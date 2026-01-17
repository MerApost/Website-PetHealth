import './FindVet.css';
import * as React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress, Alert, Button } from '@mui/material';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';

const drawerWidth = 270;

export default function FindVetArrangeMeeting() {
  const location = useLocation();
  const hasScrolled = useRef(false);
  const { id: userId, vetid } = useParams();
  const navigate = useNavigate();

  const [vetData, setVetData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    hasScrolled.current = true;

    const timer1 = setTimeout(() => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }, 10);

    const timer2 = setTimeout(() => {
      if (window.scrollY !== 0) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 50);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      hasScrolled.current = false;
    };
  }, [location.pathname]);

  React.useEffect(() => {
    const fetchVetData = async () => {
      if (!vetid) {
        setError('Δεν βρέθηκε ID κτηνίατρου στο URL');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3004/users/${vetid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.role !== 'vet') {
          throw new Error('Ο χρήστης δεν είναι κτηνίατρος');
        }
        
        const formattedVetData = {
          id: data.id,
          name: `${data.name} ${data.surname}`,
        };
        
        setVetData(formattedVetData);
      } catch (err) {
        console.error('Error fetching vet data:', err);
        setError(`Σφάλμα φόρτωσης δεδομένων: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVetData();
  }, [vetid]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
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
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                <ListItemIcon>
                  <PetsIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Τα Κατοικίδιά μου" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
                sx={{ backgroundColor: '#D7D3CB' }}
              >
                <ListItemIcon>
                  <SearchIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Εύρεση Κτηνίατρου" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
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
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                <ListItemIcon>
                  <PetsIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Τα Κατοικίδιά μου" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
                sx={{ backgroundColor: '#D7D3CB' }}
              >
                <ListItemIcon>
                  <SearchIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Εύρεση Κτηνίατρου" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Alert severity="error" sx={{ mb: 2, width: '80%' }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
            sx={{ mt: 2 }}
          >
            Επιστροφή στη λίστα κτηνιάτρων
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
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
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
              <ListItemIcon>
                <PetsIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Τα Κατοικίδιά μου" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate(`/owner_main/${userId}/find_vet`)}
              sx={{ backgroundColor: '#D7D3CB' }}
            >
              <ListItemIcon>
                <SearchIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Εύρεση Κτηνίατρου" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate(`/owner_main/${userId}/appointments`)}
            >
              <ListItemIcon>
                <CalendarMonthIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate(`/owner_main/${userId}/lost_report`)}
            >
              <ListItemIcon>
                <DescriptionIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Δήλωση Απώλειας" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate(`/owner_main/${userId}/found_report`)}
            >
              <ListItemIcon>
                <DescriptionIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Δήλωση Εύρεσης" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate(`/owner_main/${userId}/history_report`)}
            >
              <ListItemIcon>
                <HistoryIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Ιστορικό Δηλώσεων" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <header className="FindVet-main-header">
          Κλείσε Ραντεβού
        </header>
      </Box>
    </Box>
  );
}