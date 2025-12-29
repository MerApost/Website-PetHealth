import './App.css';
import dog_main_page from "./pics/dog_main_page.png";
import Toolbar from "@mui/material/Toolbar";
import Navigationbar from "./components/Navigation_bar/Navigation_bar";
import Footer from "./components/Footer/Footer";

import OwnerMainPage from "./pages/Owner/OwnerMainPage";
import VetMainPage from "./pages/Vet/VetMainPage";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

import { Routes, Route, Navigate } from 'react-router-dom';

function MainPage() {
  return (
    <header className="App-header">
      <img src={dog_main_page} className="Dog" alt="Main Page" />
      <p className="app-description">Εθνική Πλατφόρμα Κατοικιδίων</p>
    </header>
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
          <Route path="/owner" element={<OwnerMainPage />} />
          <Route path="/vet" element={<VetMainPage />} /> 
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/terms" element={<Terms />} />
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