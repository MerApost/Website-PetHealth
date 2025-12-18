// import './App.css';
// import dog_main_page from "./pics/dog_main_page.png";
// import Navigationbar from './components/Navigation_bar';
// import { BrowserRouter } from 'react-router-dom';

// function App() {
//   return (
//     <div className="App">
//       <Navigationbar />
//       <header className="App-header">
//         <img src={dog_main_page} className="Dog" alt="Main Page" />
        
//         <p className='app-description'>
//           Εθνική Πλατφόρμα Κατοικιδίων
//         </p>

//       </header>
//     </div>
//   );
// }

// export default App;

import './App.css';
import dog_main_page from "./pics/dog_main_page.png";
import Navigationbar from './components/Navigation_bar';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navigationbar />

      <Routes>
        <Route
          path="/main_page"
          element={
            <header className="App-header">
              <img src={dog_main_page} className="Dog" alt="Main Page" />
              <p className='app-description'>
                Εθνική Πλατφόρμα Κατοικιδίων
              </p>
            </header>
          }
        />

        <Route
          path="/login"
          element={<div>σελίδα login</div>}
        />
      </Routes>
    </div>
  );
}

export default App;




// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;