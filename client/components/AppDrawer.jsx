import React from 'react';

function AppDrawer({ menuHeading, menuItems, handleToggle, isOpen }) {
  return (
    <>
      <div>
        <i className="fa fa-bars menu-icon" onClick={handleToggle}></i>
      </div>
      {isOpen ? (
        <div className={`toggleMenu ${isOpen ? 'open' : ''}`}>
          <div className="menu-content">
            <h2>{menuHeading}</h2>
            <div className="menu-items">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="menu-item"
                  onClick={handleToggle}>
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AppDrawer;
