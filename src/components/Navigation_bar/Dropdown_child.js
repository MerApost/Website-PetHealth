import { useState } from 'react';
import dropdown_arrow from "../../pics/dropdown_arrow.png";

function Dropdownchild({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-item">
      <div className="dropdown-item-header">
        {item.href ? (
          <a href={item.href} className="dropdown-link">
            {item.label}
          </a>
        ) : (
          <span className="dropdown-link">{item.label}</span>
        )}

        {item.children && (
          <img
            src={dropdown_arrow}
            alt="arrow"
            className={`dropdown_arrow-image ${open ? 'open' : ''}`}
            onClick={() => setOpen(prev => !prev)}
          />
        )}
      </div>

      {open && item.children && (
        <div className="dropdown-submenu">
          {item.children.map((child, index) => (
            <a
              key={index}
              href={child.href}
              className="dropdown-link"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdownchild;
