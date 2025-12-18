import './Navigation_bar.css';
import logo from "../../pics/logo.png";
import Dropdown from './Dropdown';
import { Link } from 'react-router-dom';

function Navigationbar() {
  return (
    <nav className='navigation_bar'>
      <div className='logo-container'>
        <img
          src={logo}
          alt='logo'
          className='logo-image'
        />
      </div>

      <div className='nav_bar_links'>
        <a href='/main_page' className='nav_bar_link'>Αρχική</a>

        <Dropdown
          title="Ιδιοκτήτης"
          items={[
            { label: 'Βιβλιάριο Υγείας', href: '/owner/bibl_ygeias' },
            { label: 'Δήλωση Απώλειας', href: '/owner/lost_stat' },
            { label: 'Δήλωση Εύρεσης', href: '/owner/found_stat' },
            { label: 'Εύρεση Κτηνίατρου', href: '/owner/find_vet' },
            { label: 'Ραντεβού', href: '/owner/appointment' }
          ]}
        />

        <Dropdown
          title="Κτηνίατρος"
          items={[
            { label: 'Διαχείριση Ραντεβού', href: '/vet/arrange_appointment' },
            { label: 'Διαθεσιμότητα', href: '/vet/availability' },
            {
              label: 'Καταγραφή',
              children: [
                { label: 'Ταυτότητα Κατοικιδίου', href: '/vet/register/pet_id' },
                { label: 'Ιατρικών Πράξεων', href: '/vet/register/med_procedures' },
                { label: 'Συμβάντος', href: '/vet/register/incident' }
              ]
            }
          ]}
        />

        <div className='button-container'>
            {/* <button className='login-button'>Είσοδος</button>
            <button className='signin-button'>Εγγραφή</button> */}
            <Link to="/login" className="login-button">
                Είσοδος
            </Link>

          <Link to="/register" className="signin-button">
            Εγγραφή
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigationbar;
