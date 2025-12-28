import './App.css';
import dog_main_page from "./pics/dog_main_page.png";
import Toolbar from "@mui/material/Toolbar";
import Navigationbar from "./components/Navigation_bar/Navigation_bar";
import Footer from "./components/Footer/Footer";

import { Routes, Route, Navigate } from 'react-router-dom';

function MainPage() {
  return (
    <header className="App-header">
      <img src={dog_main_page} className="Dog" alt="Main Page" />
      <p className="app-description">Εθνική Πλατφόρμα Κατοικιδίων</p>
    </header>
  );
}

// Προσθήκη του OwnerMainPage component
function OwnerMainPage() {
  return (
    <div style={{ paddingTop: 90, padding: 20 }}>
      <h1>Κύρια Σελίδα Ιδιοκτήτη</h1>
      <p>Αυτή είναι η κύρια σελίδα για τους ιδιοκτήτες κατοικιδίων.</p>
      {/* Εδώ μπορείς να προσθέσεις περισσότερο περιεχόμενο */}
    </div>
  );
}

export default function App() {
  return (
    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigationbar />
      <Toolbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/main_page" replace />} />
          <Route path="/main_page" element={<MainPage />} />
          <Route path="/owner" element={<OwnerMainPage />} /> {/* ΔΙΟΡΘΩΣΗ ΕΔΩ */}
          <Route path="/login" element={<div style={{ paddingTop: 90 }}>σελίδα login</div>} />
          <Route path="/register" element={<div style={{ paddingTop: 90 }}>σελίδα εγγραφή</div>} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}


// import './App.css';
// import dog_main_page from "./pics/dog_main_page.png";
// import Navigationbar from './components/Navigation_bar';
// import { Routes, Route } from 'react-router-dom';

// function App() {
//   return (
//     <div className="App">
//       <Navigationbar />

//       <Routes>
//         <Route
//           path="/main_page"
//           element={
//             <header className="App-header">
//               <img src={dog_main_page} className="Dog" alt="Main Page" />
//               <p className='app-description'>
//                 Εθνική Πλατφόρμα Κατοικιδίων
//               </p>
//             </header>
//           }
//         />

//         <Route
//           path="/login"
//           element={<div>σελίδα login</div>}
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;




// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;