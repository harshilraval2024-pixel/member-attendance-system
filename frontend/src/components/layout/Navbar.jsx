import React from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';

const Navbar = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
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
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <FontAwesomeIcon icon={faBars} className="text-white" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
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
            <div className="d-flex align-items-center gap-3">
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
