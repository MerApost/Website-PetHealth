import './Navigation_bar.css';
import logo from "../../pics/logo.png"
import dropdown_arrow from "../../pics/dropdown_arrow.png"

function Navigationbar(){
  return(
    <nav className='navigation_bar'>
      <div className='logo-container'>
        <img 
          src={logo} 
          alt='logo' 
          className='logo-image'
        />
      </div>

      <div className='nav_bar_links'>
        <a href='/main_page' className='nav_bar_link'> Αρχική </a>

        {/* Ιδιοκτήτης - hover μόνο στο βέλος */}
        <div className='dropdown'>
          <div className='dropdown-header'>
            <span className='dropdown-text'>Ιδιοκτήτης</span>
            <span className='dropdown-arrow-container'>
              <img src={dropdown_arrow} alt='dropdown_arrow' className='dropdown_arrow-image'/>
            </span>
          </div>
          <div className='dropdown-content'>
            <a href='/owner/profile' className='dropdown-link'>Προφίλ</a>
            <a href='/owner/pets' className='dropdown-link'>Κατοικίδια</a>
            <a href='/owner/appointments' className='dropdown-link'>Ραντεβού</a>
            <a href='/owner/history' className='dropdown-link'>Ιστορικό</a>
          </div>
        </div>

        {/* Κτηνίατρος - ίδια δομή με hover μόνο στο βέλος */}
        <div className='dropdown'>
          <div className='dropdown-header'>
            <span className='dropdown-text'>Κτηνίατρος</span>
            <span className='dropdown-arrow-container'>
              <img src={dropdown_arrow} alt='dropdown_arrow' className='dropdown_arrow-image'/>
            </span>
          </div>
          <div className='dropdown-content'>
            <a href='/vet/profile' className='dropdown-link'>Προφίλ</a>
            <a href='/vet/clinic' className='dropdown-link'>Κλινική</a>
            <a href='/vet/appointments' className='dropdown-link'>Ραντεβού</a>
            <a href='/vet/patients' className='dropdown-link'>Ασθενείς</a>
          </div>
        </div>
        
        <div className='button-container'>
          <button className='login-button'> Είσοδος </button>
          <button className='signin-button'> Εγγραφή </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigationbar;