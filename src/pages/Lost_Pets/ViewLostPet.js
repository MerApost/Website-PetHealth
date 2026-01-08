import './ViewLostPet.css';
import BackButton from "../../components/BackButton/BackButton";

import { Box, Button } from '@mui/material';
import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function ViewLostPet() {
  const { id } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hasScrolled = useRef(false);
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Φέρε το ενισχυμένο lostPet από το LostPets endpoint
        // Ή φέρε τα δεδομένα και κάνε ενίσχυση εδώ
        const response = await fetch(`http://localhost:3004/lostPets/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lost pet data');
        }
        
        const lostPetData = await response.json();
        
        // Φέρε τον owner για επιπλέον στοιχεία αν χρειάζεται
        if (lostPetData.ownerId) {
          const ownerResponse = await fetch(`http://localhost:3004/users/${lostPetData.ownerId}`);
          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json();
            
            // Βρες το συγκεκριμένο pet
            const pet = ownerData.pets?.find(p => 
              p.id === lostPetData.petId || p.microchip === lostPetData.microchip
            );
            
            if (pet) {
              // Συνδυάζουμε τα δεδομένα
              setPetData({
                // Από lostPet
                id: lostPetData.id,
                lostDate: lostPetData.lostDate,
                location: lostPetData.location,
                info: lostPetData.additionalInfo || lostPetData.info,
                microchip: lostPetData.microchip,
                
                // Από το pet
                name: pet.name,
                type: pet.type,
                breed: pet.breed,
                gender: pet.gender,
                age: pet.age + (pet.age === "1" ? " έτους" : " ετών"),
                color: pet.color,
                photo: pet.photo,
                
                // Από owner
                ownerName: ownerData.name,
                ownerSurname: ownerData.surname,
                ownerPhone: ownerData.phone,
                ownerEmail: ownerData.email
              });
            } else {
              // Αν δεν βρεθεί pet, χρησιμοποιούμε μόνο τα lostPet δεδομένα
              setPetData(lostPetData);
            }
          }
        } else {
          setPetData(lostPetData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleFoundReport = () => {
    navigate('./found_report', { 
      state: { 
        petData: petData
      } 
    });
  };

  if (loading) {
    return (
      <header className="Lost-pets-header">
        <div className='lost-pet-data'>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Φόρτωση δεδομένων...
          </div>
        </div>
      </header>
    );
  }

  if (!petData) {
    return (
      <header className="Lost-pets-header">
        <div className='lost-pet-data'>
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            Δεν βρέθηκαν δεδομένα για αυτό το κατοικίδιο
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="Lost-pets-header">
      <div className='lost-pet-data'>
        <div className='columns-container'> 
          
          <div className='column-left'>
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              {petData.photo ? (
                <img 
                  src={petData.photo} 
                  alt={petData.name}
                  style={{
                    width: '100%',
                    maxHeight: '250px',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                <div style={{ 
                  padding: '50px', 
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  width: '100%'
                }}>
                  Δεν υπάρχει φωτογραφία
                </div>
              )}
            </div>

            <span style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'black',
              display: 'block',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              Περιγραφή Περιστατικού
            </span>

            <Box className='info-box'>
              <div style={{ whiteSpace: 'pre-line', padding: '15px' }}>
                {petData.info || 'Δεν υπάρχει διαθέσιμη περιγραφή.'}
              </div>
            </Box>
          </div>
          
          <div className='column-right'>
            <span style={{
              fontSize: '23px',
              fontWeight: 'bold',
              color: 'black',
              display: 'block',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              Στοιχεία Κατοικιδίου
            </span>

            <div className='pet-data'>
              <span className='pet-data-description'>
                Όνομα:
              </span>
              <Box className='data-box'>
                {petData.name}
              </Box>

              <span className='pet-data-description'>
                Είδος:
              </span>
              <Box className='data-box'>
                {petData.type}
              </Box>

              <span className='pet-data-description'>
                Ράτσα:
              </span>
              <Box className='data-box'>
                {petData.breed}
              </Box>

              <span className='pet-data-description'>
                Φύλο:
              </span>
              <Box className='data-box'>
                {petData.gender}
              </Box>

              <span className='pet-data-description'>
                Αριθμός Microchip:
              </span>
              <Box className='data-box'>
                {petData.microchip}
              </Box>

              <span className='pet-data-description'>
                Ηλικία:
              </span>
              <Box className='data-box'>
                {petData.age}
              </Box>

              <span className='pet-data-description'>
                Χρώμα:
              </span>
              <Box className='data-box'>
                {petData.color}
              </Box>

              <span className='pet-data-description'>
                Ημ/νία Απώλειας:
              </span>
              <Box className='data-box'>
                {petData.lostDate}
              </Box>

              <span className='pet-data-description'>
                Περιοχή Απώλειας:
              </span>
              <Box className='data-box'>
                {petData.location}
              </Box>
            </div>

            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'black',
              display: 'block',
              textAlign: 'center',
              marginTop: '40px',
              marginBottom: '15px'
            }}>
              Σε περίπτωση εύρεσης παρακαλώ επικοινωνήστε με:
            </span>

            <div className='pet-data'>
              <span className='pet-data-description'>
                Όνομα:
              </span>
              <Box className='data-box'>
                {petData.ownerName || 'Δεν υπάρχουν στοιχεία'}
              </Box>

              <span className='pet-data-description'>
                Επώνυμο:
              </span>
              <Box className='data-box'>
                {petData.ownerSurname || 'Δεν υπάρχουν στοιχεία'}
              </Box>

              <span className='pet-data-description'>
                Τηλέφωνο:
              </span>
              <Box className='data-box'>
                {petData.ownerPhone || 'Δεν υπάρχουν στοιχεία'}
              </Box>

              <span className='pet-data-description'>
                Email:
              </span>
              <Box className='data-box'>
                {petData.ownerEmail || 'Δεν υπάρχουν στοιχεία'}
              </Box>
            </div>
            
          </div>

        </div>
        <div className='found-report-box'>
          <Button
            variant="contained"
            onClick={handleFoundReport}
            size="large"
            className='found-report-btn'>
            Δήλωση Εύρεσης
          </Button>
        </div>
      </div>

      <div className="profile-back">
        <BackButton />
      </div>
    </header>
  );
}