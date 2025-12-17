import { useState } from 'react';
import Dropdownchild from './Dropdown_child';
import dropdown_arrow from "../../pics/dropdown_arrow.png";

function Dropdown({ title, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <div className="dropdown-header">
        <span className="dropdown-text">{title}</span>

        <div
          className="dropdown-arrow-container"
          onClick={() => setOpen(prev => !prev)}
        >
          <img
            src={dropdown_arrow}
            alt="arrow"
            className={`dropdown_arrow-image ${open ? 'open' : ''}`}
          />
        </div>
      </div>

      {open && (
        <div className="dropdown-content">
          {items.map((item, index) => (
            <Dropdownchild key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
