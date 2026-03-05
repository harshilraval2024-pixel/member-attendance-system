import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faUserPlus,
  faClipboardCheck,
  faChartBar,
  faSignOutAlt,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';

const Navbar = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top" ref={navRef}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="brand-icon">
            <FontAwesomeIcon icon={faChartBar} />
          </span>
          MAS
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-white" />
        </button>

        <div className={`navbar-collapse ${isOpen ? 'show' : 'collapse'}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">
                <FontAwesomeIcon icon={faHome} className="me-1" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/members') ? 'active' : ''}`} to="/members">
                <FontAwesomeIcon icon={faUsers} className="me-1" />
                Members
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/members/new') ? 'active' : ''}`} to="/members/new">
                <FontAwesomeIcon icon={faUserPlus} className="me-1" />
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/attendance') ? 'active' : ''}`} to="/attendance">
                <FontAwesomeIcon icon={faClipboardCheck} className="me-1" />
                Attendance
              </Link>
            </li>
          </ul>

          {authStore.isAuthenticated && (
            <div className="navbar-actions">
              <span className="admin-badge">
                {authStore.admin?.username || 'Admin'}
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
