// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import Link from "@mui/material/Link";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";

// import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import PlaceIcon from "@mui/icons-material/Place";
// import YouTubeIcon from '@mui/icons-material/YouTube';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';

// export default function Footer() {
//   const year = new Date().getFullYear();

//   return (
//     <Box component="footer" sx={{bgcolor: "#1b1b1b", color: "white", position: "relative", zIndex: 2000, borderTop: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 -8px 24px rgba(0,0,0,0.35)" }}>
//       <Container maxWidth="lg" sx={{ py: 3 }}>
//         <Grid container spacing={4}>

//           <Grid item xs={12} md={3}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
//               Εθνική Πλατφόρμα Κατοικιδίων
//             </Typography>

//             <Typography variant="body2" sx={{color: "white"}}>
//               Μία πλατφόρμα για την υγεία και ευημερία των κατοικιδίων στην Ελλάδα. 
//             </Typography>

//             <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//                 <Typography variant="body" sx={{ opacity: 0.8 }}>
//                   Βρείτε μας:
//                 </Typography>
//               <IconButton aria-label="facebook" sx={{ color: "white" }}>
//                 <FacebookIcon fontSize="small" />
//               </IconButton>
//               <IconButton aria-label="linkedin" sx={{ color: "white" }}>
//                 <LinkedInIcon fontSize="small" />
//               </IconButton>
//               <IconButton aria-label="youtube" sx={{ color: "white" }}>
//                 <YouTubeIcon fontSize="small" />
//               </IconButton>
//               <IconButton aria-label="instagram" sx={{ color: "white" }}>
//                 <InstagramIcon fontSize="small" />
//               </IconButton>
//             </Box>
//           </Grid>

//           {/* Links */}
//           <Grid item xs={12} sm={6} md={5}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
//               Σύνδεσμοι
//             </Typography>

//             <Box sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 1, }}>
//               <Box component="li">
//                 <Link href="/login" underline="hover" sx={{ color: "white", opacity: 0.9 }}>
//                   Ιδιοκτήτες Κατοικιδίου
//                 </Link>
//               </Box>
//               <Box component="li">
//                 <Link href="/register" underline="hover" sx={{ color: "white", opacity: 0.9 }}>
//                   Κτηνίατροι
//                 </Link>
//               </Box>
//               <Box component="li">
//                 <Link href="/owner/bibl_ygeias" underline="hover" sx={{ color: "white", opacity: 0.9 }}>
//                   Συχνές Ερωτήσεις
//                 </Link>
//               </Box>
//             </Box>
//           </Grid>

//           {/* Contact */}
//           <Grid item xs={12} sm={6} md={4}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
//               Επικοινωνία
//             </Typography>

//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <PlaceIcon fontSize="small" sx={{ opacity: 0.9 }} />
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                   Οδός Πατησίων 1, Αθήνα
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <PhoneIcon fontSize="small" sx={{ opacity: 0.9 }} />
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                   +30 210 123 1234
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <EmailIcon fontSize="small" sx={{ opacity: 0.9 }} />
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                   info@petmail.gr
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.12)" }} />

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: 1,
//           }}
//         >
//           <Typography variant="caption" sx={{ opacity: 0.7 }}>
//             © {year} Εθνική Πλατφόρμα Κατοικιδίων. Όλα τα δικαιώματα διατηρούνται.
//           </Typography>

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Link href="/privacy" underline="hover" sx={{ color: "white", opacity: 0.7, fontSize: 12 }}>
//               Πολιτική Απορρήτου
//             </Link>
//             <Link href="/terms" underline="hover" sx={{ color: "white", opacity: 0.7, fontSize: 12 }}>
//               Όροι Χρήσης
//             </Link>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// }

import './Footer.css';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg" className="container">
        {/* Κύριο μέρος footer - 3 στήλες */}
        <Box className="footer-main">
          {/* Αριστερή στήλη */}
          <Box className="footer-column left-column">
            <Typography variant="subtitle1" className="title">
              Εθνική Πλατφόρμα Κατοικιδίων
            </Typography>
            
            <Typography variant="body2" className="description">
              Μία πλατφόρμα για την υγεία και ευημερία των κατοικιδίων στην Ελλάδα. 
            </Typography>
            
            <Box className="social-section">
              <Typography variant="body2" className="findUsText">
                Βρείτε μας:
              </Typography>
              <Box className="social-icons">
                <IconButton aria-label="facebook" className="socialIcon" color='inherit' size="small">
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="linkedin" className="socialIcon" color='inherit' size="small">
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="youtube" className="socialIcon" color='inherit' size="small">
                  <YouTubeIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="instagram" className="socialIcon" color='inherit' size="small">
                  <InstagramIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
          
          {/* Κεντρική στήλη */}
          <Box className="footer-column center-column">
            <Typography variant="subtitle1" className="title">
              Σύνδεσμοι
            </Typography>
            
            <Box component="ul" className="linksList">
              <Box component="li">
                <Link component={RouterLink} to="/login" underline="hover" className="link" color="inherit">
                Ιδιοκτήτες Κατοικιδίου
              </Link>
              </Box>
              <Box component="li">
                <Link component={RouterLink} to="/register" underline="hover" className="link" color="inherit">
                  Κτηνίατροι
                </Link>
              </Box>
              <Box component="li">
                <Link component={RouterLink} to="/faq" underline="hover" className="link" color="inherit">
                  Συχνές Ερωτήσεις
                </Link>
              </Box>
            </Box>
          </Box>
          
          {/* Δεξιά στήλη */}
          <Box className="footer-column right-column">
            <Typography variant="subtitle1" className="title">
              Επικοινωνία
            </Typography>
            
            <Box className="contactContainer">
              <Box className="contactItem">
                <PlaceIcon fontSize="small" className="contactIcon" />
                <Typography variant="body2" className="contactText">
                  Οδός Πατησίων 1, Αθήνα
                </Typography>
              </Box>
              
              <Box className="contactItem">
                <PhoneIcon fontSize="small" className="contactIcon" />
                <Typography variant="body2" className="contactText">
                  +30 210 123 1234
                </Typography>
              </Box>
              
              <Box className="contactItem">
                <EmailIcon fontSize="small" className="contactIcon" />
                <Typography variant="body2" className="contactText">
                  info@petmail.gr
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider className="divider" />

        <Box className="bottomContainer">
          <Typography variant="caption" className="copyright">
            © {year} Εθνική Πλατφόρμα Κατοικιδίων. Όλα τα δικαιώματα διατηρούνται.
          </Typography>

          <Box className="legalLinks">
            <Link component={RouterLink} to="/privacy" underline="hover" className="legalLink" color="inherit">
              Πολιτική Απορρήτου
            </Link>
            <Link component={RouterLink} to="/terms" underline="hover" className="legalLink" color="inherit">
              Όροι Χρήσης
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}