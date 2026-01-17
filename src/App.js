import './App.css';
import Toolbar from "@mui/material/Toolbar";
import Navigationbar from "./components/Navigation_bar/Navigation_bar";
import Footer from "./components/Footer/Footer";

import MainPage from "./pages/Main/MainPage";
import OwnerMainPage from "./pages/Owner/OwnerMainPage";
import VetMainPage from "./pages/Vet/VetMainPage";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import LogoutSuccess from "./pages/LogoutSuccess";
import PasswordRecovery from "./pages/PasswordRecovery";
import OwnerProfileView from "./pages/Owner/OwnerProfileView";
import OwnerProfileEdit from "./pages/Owner/OwnerProfileEdit";
import LostPets from "./pages/Lost_Pets/LostPets";
import VetProfileView from "./pages/Vet/VetProfileView";
import VetProfileEdit from "./pages/Vet/VetProfileEdit";
import DeleteAccount from "./pages/DeleteAccount";
import ViewLostPet from "./pages/Lost_Pets/ViewLostPet";
import FoundReport from "./pages/Lost_Pets/FoundReport";
import OwnerLogIn from "./pages/Owner/OwnerLogIn";
import FindVet from "./pages/Owner/FindVet";
import Appointments from "./pages/Owner/Appointments";
import LostReport from "./pages/Owner/LostReport";
import OwnerFoundReport from "./pages/Owner/FoundReport";
import HistoryReport from "./pages/Owner/HistoryReport";
import PetHealthBook from './pages/Owner/PetHealthBook';
import FindVetViewProfileBio from './pages/Owner/FindVetViewProfileBio';
import FindVetArrangeMeeting from './pages/Owner/FindVetArrangeMeeting';

import VetPetRegister from "./pages/Vet/VetPetRegister";
import VetPetRegisterHistory from "./pages/Vet/VetPetRegisterHistory";
import VetPetRegisterPreview from "./pages/Vet/VetPetRegisterPreview";
import VetPetRegisterEdit from "./pages/Vet/VetPetRegisterEdit";

import VetHealthBook from "./pages/Vet/VetHealthBook";
import VetMedicalActCreate from "./pages/Vet/VetMedicalActCreate";
import VetMicrochip from './pages/Vet/VetMicrochip';
import VetNewEvent from "./pages/Vet/VetNewEvent";
import VetEventPreview from "./pages/Vet/VetEventPreview";
import VetMedicalActPreview from "./pages/Vet/VetMedicalActPreview";

import { useState } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [role, setRole] = useState(localStorage.getItem("role") || "guest");
  return (
    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigationbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} role={role} setRole={setRole}/>
      <Toolbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/main_page" replace />} />
          <Route path="/main_page" element={<MainPage />} />
          <Route path="/owner" element={<OwnerMainPage />} />
          <Route path="/vet" element={<VetMainPage />} /> 
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/logout-success" element={<LogoutSuccess />} />
          <Route path="/forgot-password" element={<PasswordRecovery />} />
          <Route path="/owner/profile" element={<OwnerProfileView />} />
          <Route path="/owner/profile/edit" element={<OwnerProfileEdit />} />
          <Route path="/lost_pets" element={<LostPets/>} />
          <Route path="/vet/profile" element={<VetProfileView />} />
          <Route path="/vet/profile/edit" element={<VetProfileEdit />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/lost_pets/:id" element={<ViewLostPet/>} />
          <Route path="/lost_pets/:id/found_report" element={<FoundReport/>} />
          <Route path="/owner_main/:id" element={<OwnerLogIn />} />
          <Route path="/owner_main/:id/find_vet" element={<FindVet />} />
          <Route path="/owner_main/:id/appointments" element={<Appointments />} />
          <Route path="/owner_main/:id/lost_report" element={<LostReport />} />
          <Route path="/owner_main/:id/found_report" element={<OwnerFoundReport />} />
          <Route path="/owner_main/:id/history_report" element={<HistoryReport />} />
          <Route path="/owner_main/:id/pet/:petid/health_book" element={<PetHealthBook />} />
          <Route path="/owner_main/:id/find_vet/:vetid" element={<FindVetViewProfileBio />} />
          <Route path="/owner_main/:id/find_vet/:vetid/arrange_meeting" element={<FindVetArrangeMeeting />} />

          <Route path="/vet/pet-register" element={<VetPetRegister />} />
          <Route path="/vet/pet-history" element={<VetPetRegisterHistory />} />
          <Route path="/vet/pet-preview/:id" element={<VetPetRegisterPreview />} />
          <Route path="/vet/pet-edit/:id" element={<VetPetRegisterEdit />} />


          <Route path="/vet/health-book/:ownerId/:petId" element={<VetHealthBook />} />
          <Route path="/vet/health-book/:ownerId/:petId/new-act" element={<VetMedicalActCreate />} />
          <Route path="/vet/health-book/:ownerId/:petId/new-event" element={<VetNewEvent />} />
          <Route path="/vet/health-book/event-preview/:eventId" element={<VetEventPreview />} />
          <Route path="/vet/health-book/act-preview/:actId" element={<VetMedicalActPreview />} />
          <Route path="/vet/microchip" element={<VetMicrochip />} />

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
