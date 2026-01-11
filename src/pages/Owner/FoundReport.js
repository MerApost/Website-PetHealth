import './FindVet.css';
import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

import {Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 270;

export default function FoundReport(){
    const location = useLocation();
    const hasScrolled = useRef(false);
    const { id: userId } = useParams();
    const navigate = useNavigate();

    // ΧΡΗΣΗ useLayoutEffect - τρέχει ΠΡΙΝ από το render
    useLayoutEffect(() => {
    // Αμέσως scroll στην αρχή
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });

    // Κρατάμε ότι έχουμε κάνει scroll
    hasScrolled.current = true;

    // Extra insurance - μετά από μικρή καθυστέρηση
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
        // Reset για επόμενη επίσκεψη
        hasScrolled.current = false;
    };
    }, [location.pathname]);

    return(
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
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}`)}>
                    <ListItemIcon>
                    <PetsIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Τα Κατοικίδιά μου" />
                </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/find_vet`)}>
                    <ListItemIcon>
                    <SearchIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Εύρεση Κτηνίατρου" />
                </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/appointments`)}>
                    <ListItemIcon>
                    <CalendarMonthIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Ιστορικό / Διαχείριση Ραντεβού" />
                </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/lost_report`)}>
                    <ListItemIcon>
                    <DescriptionIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Δήλωση Απώλειας" />
                </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/found_report`)} sx={{backgroundColor: '#D7D3CB'}}>
                    <ListItemIcon>
                    <DescriptionIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Δήλωση Εύρεσης" />
                </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/owner_main/${userId}/history_report`)}>
                    <ListItemIcon>
                    <HistoryIcon sx={{color: 'black'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Ιστορικό Δηλώσεων" />
                </ListItemButton>
                </ListItem>
            </List>
            </Drawer>
            
            {/* Κύριο περιεχόμενο */}
            <Box
            component="main"
            sx={{ 
                flexGrow: 1, 
                bgcolor: 'background.default',
                minHeight: '100vh'
            }}
            >
            <header className="FindVet-main-header">
                {/* Υπολοιπο περιεχομενο της σελιδας FindVet */}
                <Box>
                    {/* Προσθέστε εδώ τη λίστα κτηνιάτρων ή άλλο περιεχόμενο */}
                    <Typography variant="h6">
                        Δήλωση Εύρεσης
                    </Typography>
                </Box>
            </header>
            </Box>
        </Box>
    );
}